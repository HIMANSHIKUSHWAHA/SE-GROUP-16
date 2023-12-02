const express = require('express');
const router = express.Router();
const searchContentController = require('../controllers/content/profileController');

// Search for content by id
router.get('/profile:objectId', async (req, res) => {
    const { objectId } = req.params;
    const result = await searchContentController.findObject(objectId);
    res.status(result.status).json(result.json);
});

module.exports = router;
