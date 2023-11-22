const express = require('express');
const router = express.Router();


const { searchVideos, searchLiveSessions, searchProfessionals, searchExercisePlans, searchMealPlans, autocompleteSearchVideos, autocompleteSearchProfessionals  } = require('../controllers/search/searchController');
const {
    getAllAsyncVideos,
    getAllLiveSessions,
    getAllUsers,
    getAllExercisePlans,
    getAllMealPlans,
    getAllProfessionals
} = require('../controllers/search/aggregatesController');


//search functions
router.get('/autocomplete/video', autocompleteSearchVideos);
router.get('/autocomplete/professional', autocompleteSearchProfessionals);
//autocomplete functionality
router.get('/videos', searchVideos);
router.get('/sessions', searchLiveSessions);
router.get('/professionals', searchProfessionals);
router.get('/exercisePlans', searchExercisePlans);
router.get('/mealPlans', searchMealPlans);


//initial rendering functions
router.get('/allVideos', getAllAsyncVideos);
router.get('/allLivesessions', getAllLiveSessions);
router.get('/allUsers', getAllUsers);
router.get('/allExercisePlans', getAllExercisePlans);
router.get('/allMealPlans', getAllMealPlans);
router.get('/allProfessionals', getAllProfessionals);
module.exports = router;