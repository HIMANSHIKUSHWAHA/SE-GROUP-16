const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/passwordReset', authController.passwordReset);

module.exports = router;