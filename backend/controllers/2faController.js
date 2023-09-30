const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const AppError = require('../utils/AppError');
try {
    const setup2FA = async (req, res, next) => {

        const secret = speakeasy.generateSecret({ length: 20 });

        const user = await User.findById(req.user.id);
        if (!user) return next(new AppError('User not found', 404));

        user.twoFASecret = secret.base32;
        await user.save();

        //generate QR code for user to scan
        const dataUrl = await qrcode.toDataURL(secret.otpauth_url);

        res.json({ dataUrl });

    };

    const verify2FAToken = async (req, res, next) => {

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
} catch (error) {
    console.log("error in 2fa");
}
