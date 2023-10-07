const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendEmail } = require('../utils/NodeMailer');


/**
 *  route -> /api/v1/auth/2fa/setup
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
    const user = await User.findOne({ email: user_id }).exec();
    if (!user) return next(new AppError('User not found', 404));

    user.twoFASecret = secret.base32;
    user.twoFAEnabled = true;
    await user.save();

    //generate QR code for user to scan
    const dataUrl = await qrcode.toDataURL(secret.otpauth_url);


    // TODO call send email function with dataUrl
    const title = "Google authenticator setup";
    const content = "Click on the link to setup 2FA and scan the code with google authenticator";
    const email = 'rg913000@gmail.com';
    sendEmail(title, email, dataUrl, content);
    res.status(200).json({ dataUrl });
};

/**
 * ROUTE -> /api/v1/auth/2fa/verify
 * @function verify2FAToken
 * @description 
 * This function verifies the 2FA token provided by the user during the login process. 
 * It decodes a temporary JWT sent by the user to extract their ID, retrieves the user's 
 * details from the database, and verifies the 2FA token against the user's secret. 
 * If the verification is successful, it creates a full-access token and sends it back to the user as a cookie.
 *
 * @param {Object} req - Express request object; expected to contain:
 *   @property {String} token - The 2FA token provided by the user.
 *   @property {String} tempToken - A temporary JWT containing the user's ID.
 * @param {Object} res - Express response object; used to send the response back to the client.
 * @param {Function} next - Express next middleware function.
 *
 * @example
 * // Expected Request Payload:
 * {
 *   "token": "123456",
 *   "tempToken": "eyJhbGci...<truncated>...ybGciOi"
 * }
 *
 * // Successful Response Example:
 * {
 *   "message": "Token verified successfully"
 * }
 *
 * // Failure Response Example (sent through next middleware with an AppError object):
 * "Invalid token", "User not found", "Invalid temporary token"
 */
const verify2FAToken = async (req, res, next) => {
    console.log("VERIFYING 2 FACTOR CALLED");
    const { token, tempToken } = req.body;

    // Decode the temporary token to get the user ID
    try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (!decoded.temp) {
            return next(new AppError('Invalid token', 400));
        }
        const userId = decoded.userId;

        const user = await User.findById(userId);
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

        // Create a full-access token (you might want to include more user information)
        const fullAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the full-access token as a cookie
        res.cookie('access_token', fullAccessToken, {
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            httpOnly: true,
            // secure: true, // uncomment this for HTTPS
        });

        // Send success response
        res.status(200).json({ message: 'Token verified successfully' });
    } catch (error) {
        return next(new AppError('Invalid temporary token', 400));
    }
};
module.exports = { setup2FA, verify2FAToken }

