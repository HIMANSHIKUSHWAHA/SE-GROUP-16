const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratings/ratingsController'); // Update with the actual path to your ratings controller


router.post('/updateRating', ratingsController.updateRating);
router.get('/:ratingsId', ratingsController.getRating);
module.exports = router;