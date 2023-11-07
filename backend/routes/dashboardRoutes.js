const express = require('express');
const router = express.Router();
const dashController = require('../controllers/dash/dashController');

router.get('/calendar_data', dashController.calendarData);
router.get('/video_cards', dashController.videoCardData);
module.exports = router;

