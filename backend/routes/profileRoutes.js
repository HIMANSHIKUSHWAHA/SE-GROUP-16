const express = require('express');
const router = express.Router();
const { findObject } = require('../controllers/content/profileController');
// Search for content by id
router.get('/:objectId', async (req, res) => {
    const { objectId } = req.params;
    const result = await findObject(objectId);
    res.status(result.status).json(result.json);
});

module.exports = router;
