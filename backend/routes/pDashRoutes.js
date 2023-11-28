const express = require('express');
const router = express.Router();
const pDashController = require('../controllers/dash/pDashController');


router.get('/tags',pDashController.allTags)

module.exports = router;