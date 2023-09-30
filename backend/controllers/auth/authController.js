const User = require('../../models/User')
const AppError = require('../../utils/AppError')
const passport = require('passport');



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

    console.log("LOGIN CONTROLLER CALLED")
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


// TODO - Password Reset
//POST request from frontend with email
const passwordReset = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    // Generate password reset link

    // TODO: Send link to user's email address (you might use a package like Nodemailer)
    // Note: You would typically use an email sending service to send the link to the user.
    // You should not expose the link in the response for security reasons.

    res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to email'
    });
};

module.exports = {
    login,
    signup,
    passwordReset
}