const express = require('express');
const router = express.Router();

const {sendMessage, getAllMessages}  = require('../controllers/messaging/messagingController');

router.post('/sendMessage', sendMessage);
router.get('/getAllMessages', getAllMessages);

module.exports = router;