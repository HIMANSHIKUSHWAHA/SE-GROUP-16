const express = require('express');
const router = express.Router();
const twoFAController = require('../controllers/2faController');
// route base - /api/v1/auth/2fa/setup
router.post('/setup', twoFAController.setup2FA);

router.post('/verify', twoFAController.verify2FAToken);

module.exports = router;

