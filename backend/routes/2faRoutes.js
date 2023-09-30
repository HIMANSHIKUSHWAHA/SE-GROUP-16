const express = require('express');
const router = express.Router();
const twoFAController = require('../controllers/2faController.js');


router.post('/setup', twoFAController.setup);

router.post('/verify', twoFAController.verify);

module.exports = router;

