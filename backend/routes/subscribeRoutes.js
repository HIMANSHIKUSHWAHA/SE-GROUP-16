const express = require('express');
const router = express.Router();
const subscribeController = require('../controllers/subscribeController');

// Subscribe to a user
router.post('/subscribe/:subscriberId/:subscribeToUserId',async (req, res) => {
    const { subscriberId, subscribeToUserId } = req.params;
    const result = await subscribeController.subscribe(subscriberId, subscribeToUserId);
    res.status(result.status).json(result.json);
});

// Unsubscribe from a user
router.post('/unsubscribe/:subscriberId/unsubscribeFromUserId:', async (req, res) => {
    const { subscriberId, unsubscribeFromUserId } = req.params;
    const result = await subscribeController.unsubscribe(subscriberId, unsubscribeFromUserId);
    res.status(result.status).json(result.json);
});

// View subscribers
router.get('/subscribers/:id', async (req, res) => {
    const { id } = req.params;
    const result = await subscribeController.viewSubscribers(id);
    res.status(result.status).json(result.json);
});

// View users the authenticated user is subscribed to
router.get('/subscribed/:id', async (req, res) => {
    const { id } = req.params;
    const result = await subscribeController.viewSubscribed(id);
    res.status(result.status).json(result.json);
});

module.exports = router;
