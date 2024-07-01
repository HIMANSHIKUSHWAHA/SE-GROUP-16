const express = require('express');
const router = express.Router();

const liveSessionController = require('../controllers/liveSessionController');

router.post('/schedule', liveSessionController.schedule);
router.post('/enroll', liveSessionController.enroll);

module.exports = router;