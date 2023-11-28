const express = require('express');
const router = express.Router();
const dashController = require('../controllers/dash/calendarController');

router.get('/calendar_data', dashController.calendarData);

module.exports = router;