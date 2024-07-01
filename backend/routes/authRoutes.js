const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');

router.post('/login', authController.login);
router.post('/signup/user', authController.signUpUser);
router.post('/signup/professional', authController.signUpProfessional);
router.post('/passwordReset', authController.passwordReset);
router.post('/updatePassword', authController.updatePassword);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;