const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const Professional = require('../models/Professional');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/NodeMailer');

//function not completing.
const setup2FA = async (req, res, next) => {
    console.log("SETTING UP 2 FACTOR CALLED");
    const secret = speakeasy.generateSecret({ length: 20 });
    const { userId } = req.body;
    console.log("UserId passed into setup : " + userId)
    let user = await User.findById(userId);
    if (!user) {
        user = await Professional.findById(userId);
    }
    if (!user) return next(new AppError('User not found', 404));

    user.twoFASecret = secret.base32;
    user.twoFAEnabled = true;
    await user.save();

    const dataUrl = await qrcode.toDataURL(secret.otpauth_url);
    console.log("2FA SETUP IS DONE");
    res.json({ qrCodeUrl: dataUrl });
};

const verify2FAToken = async (req, res, next) => {
    console.log("VERIFYING 2 FACTOR CALLED");
    const { token, code } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.temp == false) {
            return next(new AppError('Invalid token', 400));
        }
        const userId = decoded.userId;
        let user = await User.findById(userId).select('+twoFASecret');
        if (!user) {
            user = await Professional.findById(userId).select('+twoFASecret');
        }
        if (!user) return next(new AppError('User not found', 404));


        const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token: code
        });

        if (!verified) {
            return next(new AppError('Invalid code', 400));
        }

        const fullAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('access_token', fullAccessToken, {
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            httpOnly: true,
            // secure: true, // uncomment this for HTTPS
        });

        console.log("VERIFYING 2 FACTOR FINISHED");
        res.status(200).json({ message: 'Token verified successfully', userId: userId });
    } catch (error) {
        console.error(error.message);
        return next(new AppError('Invalid temporary token', 400));
    }
};

module.exports = { setup2FA, verify2FAToken }