const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const jwt = require('jsonwebtoken');

router.post('/login', authController.login);
router.post('/signup/user', authController.signUpUser);
router.post('/signup/professional', authController.signUpProfessional);
router.post('/passwordReset', authController.passwordReset);
router.post('/updatePassword', authController.updatePassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/admin-login', (req, res) => {
    const { email, password } = req.body;
  
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // Generate a JWT token
        const token = jwt.sign(
          { email: email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({ status: 'success', token: token });
      } else {
        // Handle login failure
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }      
  });
module.exports = router;