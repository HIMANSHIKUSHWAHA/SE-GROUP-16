const User = require('../../models/User')
const AppError = require('../../utils/AppError')
const passport = require('passport');
const { sendEmail } = require('../../utils/NodeMailer');
const crypto = require('crypto');

/**
 * @function login
 * @description Handles user login functionality.
 * 
 * - Retrieves the user's credentials (email and password) from the request payload.
 * - Verifies the credentials against the stored data in the database.
 * - If credentials are valid:
 *   - Initiates a user session.
 *   - Responds with a success message and user's role.
 * - If credentials are invalid or user is not found:
 *   - Responds with an appropriate error message.
 *
 * @param {Object} req - Express request object; expected to contain user's credentials in the body.
 * @param {Object} res - Express response object; used to send the response back to the client.
 * @returns {JSON} - A JSON response with a success message and user's role on successful login, or an error message on failure.
 *
 * @example
 * // Expected Request Payload:
 * {
 *   "email": "user@example.com",
 *   "password": "userpassword"
 * }
 *
 * // Successful Response Example:
 * {
 *   "message": "Login successful",
 *   "role": "user_role"
 * }
 *
 * // Failure Response Example:
 * {
 *   "message": "Incorrect email or password"
 * }
 */
const login = async (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(new AppError(err.message, 500));
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'authentication failed', info: info });
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(new AppError(loginErr.message, 500));
            }
            return res.status(200).json({ success: true, message: 'authentication succeeded', user: req.user });
        });
    })(req, res, next);

};


/**
 * @function signup
 * @description Handles user registration functionality.
 * 
 * - Retrieves user's details (email, password, and role) from the request payload.
 * - Creates a new User instance with the provided details.
 * - Saves the new user to the database.
 * - If user registration is successful:
 *   - Responds with a success message and user details.
 * - If registration fails (e.g., email already in use):
 *   - Responds with an appropriate error message.
 *
 * @param {Object} req - Express request object; expected to contain user's details in the body.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {function} next - Express next middleware function.
 * @returns {JSON} - A JSON response with a success message and user details on successful registration, or an error message on failure.
 *
 * @example
 * // Expected Request Payload:
 * {
 *   "email": "user@example.com",
 *   "password": "userpassword",
 *   "role": "user_role"
 * }
 *
 * // Successful Response Example:
 * {
 *   "message": "User registered successfully",
 *   "user": {
 *     "email": "user@example.com",
 *     "role": "user_role"
 *     // other user details...
 *   }
 * }
 *
 * // Failure Response Example:
 * {
 *   "message": "Email already in use"
 * }
 */
const signup = async (req, res, next) => {
    console.log("SIGN UP CONTROLLER CALLED")
    try {

        const { email, password, role, height, weight, specialization } = req.body;
        const Userobj = { email, password, role }
        if (Userobj.role.toLowerCase() == 'customer') {
            Userobj.height = height;
            Userobj.weight = weight;
        }

        if (Userobj.role.toLowerCase() == 'professional') {
            Userobj.specialization = specialization;
        }
        console.log({ Userobj });
        const newUser = new User(Userobj);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {

        //email has unique tag in database, error code 11000 when duplicate returned by mongo
        if (error.code && error.code == 11000) {
            return next(new AppError('Email already in use', 409));
        }
        return next(new AppError(error.message, error.statusCode || 500));

    }

};


//POST request from frontend with email
const passwordReset = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('Email address not found', 404));
    }

    //generate reset token for user.
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + (10 * 60 * 1000);


    //save this to user's record.
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    //TODO: Figure out what the link actually is when hosting works, front end for this general page.
    //generate password reset link w/ token
    const resetLink = `http://your-frontend-app.com/reset-password/${resetToken}`;
    await sendEmail(email, resetLink);
    res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to email'
    });
};
const updatePassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return next(new AppError('Token and new password are required', 400));
        }

        //verify user token granted by email.
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Token is invalid or has expired', 400));
        }

        //update user/remove token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();


        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        });

    } catch (error) {
        return next(new AppError(error.message, error.statusCode || 500));
    }
};
module.exports = {
    login,
    signup,
    passwordReset,
    updatePassword
}

