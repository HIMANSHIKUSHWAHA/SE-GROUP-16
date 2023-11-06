const express = require('express');
const router = express.Router();


const { searchVideos, searchLiveSessions, searchProfessionals } = require('../controllers/search/searchController');
const { getAllVideos } = require("../controllers/search/getAllVideos");

router.get('/search/searchvideos', searchVideos);
router.get('/search/sessions', searchLiveSessions);
router.get('/search/professionals', searchProfessionals);
router.get('/search/allvideos', getAllVideos);


module.exports = router;