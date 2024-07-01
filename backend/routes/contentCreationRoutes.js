const express = require('express');
const router = express.Router();
const contentCreationController = reqire("../controllers/content/contentCreationController");

router.post('/upload/meal-plan', contentCreationController.createMealPlan);
router.post('/upload/exercise-plan', contentCreationController.createExercisePlan);
router.post('/upload/video', contentCreationController.createVideo);

module.exports = router;