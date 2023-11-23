const express = require('express');
const router = express.Router();

const {sendMessage, getAllMessages}  = require('../controllers/messaging/messagingController');

router.get('/messages/sendMessage', sendMessage);
router.get('/messages/getAllMessages', getAllMessages);

module.exports = router;