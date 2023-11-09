const User = require('../../models/User');
const Professional = require('../../models/Professional')
const { Calendar, createDefaultCalendar } = require('../../models/Calendar');
const AppError = require('../../utils/AppError');
const passport = require('passport');
const { sendEmail } = require('../../utils/NodeMailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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
 * @returns {JSON} - A JSON response with a success message and tempToken on successful login, or an error message on failure.
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
 *   "message": "authentication succeeded",
 *   "tempToken": jsont web token with userId
 * }
 *
 * // Failure Response Example:
 * {
 *   "message": "authentication failed"
 * }
 */

//this is assumes emails are unique
const login = async (req, res, next) => {
    console.log("LOGIN CONTROLLER CALLED");
    const userId = null;
    const { email, password } = req.body;

    let user = null;

    try {
        user = await User.findOne({ email: email }).exec();
        if(user){
            console.log("User found: " + user);
        }
        if (!user) {
            user = await Professional.findOne({ email: email }).exec();
            console.log("Professional found: " + user);
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
        }

        //console.log(password);
        // Passport authentication logic here...
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                return next(new AppError(err.message, 500));
            }
            if (!user) {
                return res.status(401).json({ success: false, message: 'authentication failed', info: info });
            }
            req.login(user, { session: false }, async (loginErr) => {
                if (loginErr) {
                    return next(new AppError(loginErr.message, 500));
                }
                // Generate a token
                const tempToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
                console.log("LOGIN SUCCESS");
                return res.status(200).json({ success: true, message: 'authentication succeeded', tempToken: tempToken, userId: user._id});
            });
        })(req, res, next);
    } catch (queryErr) {
        return next(new AppError(queryErr.message, 500));
    }
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
 *   "userID": Unique user id
 * }
 *
 * // Failure Response Example:
 * {
 *   "message": "Email already in use"
 * }
 */

const signUpUser = async (req, res, next) => {
    console.log("USER SIGN UP CONTROLLER CALLED");
    try {
        const { email, password, height, weight } = req.body;
        const userObj = {
            email,
            password,
            height,
            weight
        };
        const newUser = new User(userObj);

        //OTP generation
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.otp = otp;
        newUser.otpExpires = Date.now() + (10 * 60 * 1000);

        const email_func_input = {
            content: `Your OTP for registration is: ${otp}`,
            title: "OTP verification FITFRIEND",
            email: email
        };

        await sendEmail(email_func_input);
        await newUser.save();

        const tempToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        createDefaultCalendar(newUser._id);
        console.log("Generating temp token");
        console.log("TEMP TOKEN GENERATED: " + tempToken);
        console.log("USER SIGNUP SUCCESS");
        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser._id,
            tempToken: tempToken
        });
    } catch (error) {
        if (error.code && error.code == 11000) {
            return next(new AppError('Email already in use', 409));
        }
        return next(new AppError(error.message, error.statusCode || 500));
    }
};


const signUpProfessional = async (req, res, next) => {
    console.log("PROFESSIONAL SIGN UP CONTROLLER CALLED");
    try {
        const { email, password, specialization } = req.body;
        const userObj = {
            email,
            password,
            specialization
        };
        const newUser = new Professional(userObj);

        //OTP generation
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.otp = otp;
        newUser.otpExpires = Date.now() + (10 * 60 * 1000);

        const email_func_input = {
            content: `Your OTP for registration is: ${otp}`,
            title: "OTP verification FITFRIEND",
            email: email
        };

        await sendEmail(email_func_input);
        await newUser.save();

        const tempToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        console.log("Generating temp token");
        console.log("TEMP TOKEN GENERATED: " + tempToken);
        createDefaultCalendar(newUser._id);

        console.log("PROFESSIONAL SIGNUP SUCCESS");
        res.status(201).json({
            message: 'Professional registered successfully',
            userId: newUser._id,
            tempToken: tempToken
        });
    } catch (error) {
        if (error.code && error.code == 11000) {
            return next(new AppError('Email already in use', 409));
        }
        return next(new AppError(error.message, error.statusCode || 500));
    }
};









const verifyOTP = async (req, res, next) => {
    try {
        const { userId, otp } = req.body;
        console.log("USER ID: " + userId);
        console.log("OTP: " + otp);
        if (!userId || !otp) {
            return next(new AppError('User ID and OTP are required', 400));
        }

        let user = await User.findById(userId).select('+otp +otpExpires');
        if(user) {
            console.log("User found:", user.toObject());
        }

        if (!user) {
            user = await Professional.findById(userId).select('+otp +otpExpires');
            console.log("Professional found:", user.toObject());
        }

        if (!user) {
            return next(new AppError('User not found', 404));
        }
        console.log("USEROTP: " + user.otp);
        console.log("OTP: " + otp);
         if (user.otp !== otp || user.otpExpires < Date.now()) {
             return next(new AppError('Invalid or expired OTP', 400));
          }

        // OTP is valid, remove it and complete registration
        user.otp = undefined;
        user.otpExpires = undefined;
        const savedUser = await user.save();
        console.log("OTP PROCESS SUCCEEDED");
        res.status(200).json({ message: "OTP verified", userId: user._id });
    } catch (error) {
        return next(new AppError(error.message, error.statusCode || 500));
    }
};


const passwordReset = async (req, res, next) => {
    console.log("PASSWORD RESET CALLED");
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    let user = await User.findOne({ email });
    if (!user) {
        user = await Professional.findOne({ email });
    }

    if (!user) {
        return next(new AppError('Email address not found', 404));
    }

    //generate reset token for the user or professional.
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + (10 * 60 * 1000); // 10 minutes from now

    //save this to user's record.
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // TODO: Update the link to the actual password reset page once available.
    const resetLink = `http://34.170.53.225:3000/update-password?__upt=${resetToken}`;

    // Prepare email content
    const email_func_input = {
        content: `Your Password Reset link is: ${resetLink}`,
        title: "RESET-PASSWORD FITFRIEND",
        email: email,
        link: resetLink
    };

    // Send the email with the password reset link
    await sendEmail(email_func_input);

    res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to email'
    });
};



const updatePassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        console.log(token);

        if (!token || !newPassword) {
            return next(new AppError('Token and new password are required', 400));
        }

        let user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if(user){
            console.log("User found.")
        }
        if (!user) {
            user = await Professional.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            if(user){
                console.log("Professional found.");
            }
        }

        if (!user) {
            return next(new AppError('Token is invalid or has expired', 400));
        }

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
    signUpUser,
    signUpProfessional,
    passwordReset,
    updatePassword,
    verifyOTP
}

