const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');

/**
 * @function setup2FA
 * @description Initiates the setup process for 2FA for a user.
 * Generates a 2FA secret and QR code URL for the user to scan.
 * 
 * @param {Object} req - Express request object, expected to contain the authenticated user's ID.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {JSON} - A JSON response containing the QR code URL.
 *
 * @example
 * // post request with user_email_id as a parameter
 * // Successful Response Example:
 * {
 *   "dataUrl": "data:image/png;base64,..."
 * }
 */
const setup2FA = async (req, res, next) => {
    console.log("SETTING UP 2 FACTOR CALLED");
    const secret = speakeasy.generateSecret({ length: 20 });

    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return next(new AppError('User not found', 404));

    user.twoFASecret = secret.base32;
    user.twoFAEnabled = true;
    await user.save();

    //generate QR code for user to scan
    const dataUrl = await qrcode.toDataURL(secret.otpauth_url);
    console.log("2FA SETUP IS DONE");
    res.json({ qrCodeUrl: dataUrl });

};

/**
 * @function verify2FAToken
 * @description Verifies the 2FA token provided by the user.
 * 
 * @param {Object} req - Express request object, expected to contain the token and the authenticated user's ID.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {JSON} - A JSON response indicating whether the token is verified or not.
 *
 * @example
 * // Request Payload Example:
 * {
 *   "token": "123456"
 * }
 *
 * // Successful Response Example:
 * {
 *   "message": "Token verified successfully"
 * }
 *
 * // Failure Response Example:
 * {
 *   "message": "Invalid token"
 * }
 */
const verify2FAToken = async (req, res, next) => {
    console.log("VERIFYING 2 FACTOR CALLED");
    const { code, token } = req.body;
    // console.log("THE REQUEST TO VERIFY TOKEN HAS- ", req.body);
    // Decode the temporary token to get the user ID
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.temp == false) {
            return next(new AppError('Invalid token', 400));
        }
        // console.log("THE DECODED TEMP TOKOEN IS - ", decoded);
        const userId = decoded.userId;

        const user = await User.findById(userId).select('+twoFASecret');
        if (!user) return next(new AppError('User not found', 404));

        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token: code
        });

        if (!verified) {
            return next(new AppError('Invalid code', 400));
        }

        // Create a full-access token (you might want to include more user information)
        const fullAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the full-access token as a cookie
        res.cookie('access_token', fullAccessToken, {
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            httpOnly: true,
            // secure: true, // uncomment this for HTTPS
        });

        console.log("VERIFYING 2 FACTOR FINISHED");
        // Send success response
        // Send userId as well
        res.status(200).json({ message: 'Token verified successfully', userId: userId });
    } catch (error) {
        return next(new AppError('Invalid temporary token', 400));
    }
};
module.exports = { setup2FA, verify2FAToken }