const express = require('express');
const router = express.Router();
const twoFAController = require('../controllers/2faController');

router.post('/setup', twoFAController.setup2FA);

router.post('/verify', twoFAController.verify2FAToken);

module.exports = router;

