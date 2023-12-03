const User = require('../../models/User');
const AsyncVideo = require('../../models/AsyncVideo');
const LiveSession = require('../../models/LiveSession');
const { buildTrieFromVideos } = require('../search/autoComplete');
const ExercisePlan = require('../../models/ExercisePlan');
const MealPlan = require('../../models/MealPlan');
const Professional = require('../../models/Professional');
const { buildTrieFromProfessionals, buildTrieFromMealPlans, buildTrieFromExercisePlans, buildTrieFromLiveSessions } = require("../search/autoComplete");

let videosTrie, professionalsTrie, mealPlansTrie, exercisePlansTrie, liveSessionsTrie;

const autocompleteSearchVideos = async (req, res) => {
    if (!videosTrie) {
        videosTrie = await buildTrieFromVideos(AsyncVideo);
    }
    const { prefix } = req.query;
    try {
        const suggestions = videosTrie.autocomplete(prefix.toLowerCase());
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const autocompleteSearchProfessionals = async (req, res) => {
    if (!professionalsTrie) {
        professionalsTrie = await buildTrieFromProfessionals(Professional);
    }
    const { prefix } = req.query;
    try {
        const suggestions = professionalsTrie.autocomplete(prefix.toLowerCase());
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const autocompleteSearchMealPlans = async (req, res) => {
    if (!mealPlansTrie) {
        mealPlansTrie = await buildTrieFromMealPlans(MealPlan);
    }
    const { prefix } = req.query;
    try {
        const suggestions = mealPlansTrie.autocomplete(prefix.toLowerCase());
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const autocompleteSearchLiveSessions = async (req, res) => {
    if (!liveSessionsTrie) {
        liveSessionsTrie = await buildTrieFromLiveSessions(LiveSession);
    }
    const { prefix } = req.query;
    try {
        const suggestions = liveSessionsTrie.autocomplete(prefix.toLowerCase());
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const autocompleteSearchExercisePlans = async (req, res) => {
    if (!exercisePlansTrie) {
        exercisePlansTrie = await buildTrieFromExercisePlans(ExercisePlan);
    }
    const { prefix } = req.query;
    try {
        const suggestions = exercisePlansTrie.autocomplete(prefix.toLowerCase());
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchVideos = async (req, res) => {
    let { searchTerm } = req.query;
    let queryObject = {};

    if (searchTerm) {
        // Search in title, tags, or description
        queryObject['$or'] = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { tags: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    try {
        const videos = await AsyncVideo.find(queryObject)
            .populate('ratings')
            .populate('creator', 'firstName lastName');
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchLiveSessions = async (req, res, next) => {
    const { searchTerm } = req.query;
    let queryObject = {};

    if (searchTerm) {
        // This will create a query that looks for the searchTerm in any of the specified fields
        queryObject['$or'] = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { creator: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $regex: searchTerm, $options: 'i' } },
            { date: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    try {
        const liveSessions = await LiveSession.find(queryObject)
            .populate('creator', 'firstName lastName');
        res.json(liveSessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchProfessionals = async (req, res, next) => {
    const { searchTerm } = req.query;
    let queryObject = {};

    if (searchTerm) {
        // This will create a query that looks for the searchTerm in any of the specified fields
        queryObject['$or'] = [
            { firstName: { $regex: searchTerm, $options: 'i' } },
            { lastName: { $regex: searchTerm, $options: 'i' } },
            { specialization: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    try {
        const professionals = await Professional.find(queryObject);
        res.json(professionals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchExercisePlans = async (req, res, next) => {
    const { searchTerm } = req.query;
    let queryObject = {};

    if (searchTerm) {
        queryObject['$or'] = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            // You can also include other relevant fields here, for example:
            // { cost: { $regex: searchTerm, $options: 'i' } },
            // { 'creator.firstName': { $regex: searchTerm, $options: 'i' } },
            // { 'creator.lastName': { $regex: searchTerm, $options: 'i' } }
        ];
    }

    try {
        const exercisePlans = await ExercisePlan.find(queryObject)
            .populate('creator', 'firstName lastName');
        res.json(exercisePlans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchMealPlans = async (req, res, next) => {
    const { searchTerm } = req.query;
    console.log(searchTerm)
    let queryObject = {};

    if (searchTerm) {
        queryObject['$or'] = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
        ];
    } else {
        // Handle case where searchTerm is empty
        return res.json([]); // Or you can send a custom message
    }

    try {
        const mealPlans = await MealPlan.find(queryObject)
            .populate('creator', 'firstName lastName');
        res.json(mealPlans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    searchVideos,
    searchLiveSessions,
    searchProfessionals,
    searchExercisePlans,
    searchMealPlans,
    autocompleteSearchVideos,
    autocompleteSearchProfessionals,
    autocompleteSearchExercisePlans,
    autocompleteSearchMealPlans,
    autocompleteSearchLiveSessions
};