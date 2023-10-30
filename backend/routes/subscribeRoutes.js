const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');

// Subscribe to a user
router.post('/subscribe/:userId', subscriberController.subscribe);

// Unsubscribe from a user
router.post('/unsubscribe/:userId', subscriberController.unsubscribe);

// View subscribers
router.get('/subscribers', subscriberController.viewSubscribers);

// View users the authenticated user is subscribed to
router.get('/subscribed', subscriberController.viewSubscribedUsers);

module.exports = router;
