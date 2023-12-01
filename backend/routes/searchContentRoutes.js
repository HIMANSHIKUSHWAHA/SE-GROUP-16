const express = require('express');
const router = express.Router();
const searchContentController = require('../controllers/content/searchContentController');

// Search for content by id
router.get('/searchContent:contentId', async (req, res) => {
    const { contentId } = req.params;
    const result = await searchContentController.findContent(contentId);
    res.status(result.status).json(result.json);
});

module.exports = router;
