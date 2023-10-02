const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const AppError = require('../utils/AppError');

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

    const { user_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) return next(new AppError('User not found', 404));

    user.twoFASecret = secret.base32;
    user.twoFAEnabled = True;
    await user.save();

    //generate QR code for user to scan
    const dataUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({ dataUrl });

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
    const { token } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    // Verify the token
    const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: token
    });

    if (!verified) {
        return next(new AppError('Invalid token', 400));
    }

    // Send success response (you might want to do more here, like logging the user in)
    res.status(200).json({ message: 'Token verified successfully' });
};
module.exports = { setup2FA, verify2FAToken }

