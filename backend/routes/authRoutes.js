const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/passwordReset', authController.passwordReset);
//because only one req body is allowed and resetpassword will have its own page.
router.post('/updatePassword', authController.passwordReset);
module.exports = router;