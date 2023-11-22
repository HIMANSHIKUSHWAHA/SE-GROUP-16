const User = require('../../models/User');
const AsyncVideo = require('../../models/AsyncVideo');
const LiveSession = require('../../models/LiveSession');
const { buildTrieFromVideos } = require('../search/autoComplete');
const Professional = require('../../models/Professional');
const {buildTrieFromProfessionals} = require("./autoComplete");
let trie;

const autocompleteSearchVideos = async (req, res) => {
    if (!trie) {
        trie = await buildTrieFromVideos(AsyncVideo);
    }
    const { prefix } = req.query;
    try {
        const suggestions = trie.autocomplete(prefix.toLowerCase());
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const autocompleteSearchProfessionals = async (req, res) => {
    if (!trie) {
        trie = await buildTrieFromProfessionals(Professional);
    }
    const { prefix } = req.query;
    try {
        const suggestions = trie.autocomplete(prefix.toLowerCase());
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
        const videos = await AsyncVideo.find(queryObject);
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchLiveSessions = async (req, res, next) => {
    let { title, description, tags, startDate, endDate } = req.query;
    let queryObject = {};

    if (title) {
        queryObject['title'] = { $regex: title, $options: 'i' };
    }
    if (description) {
        queryObject['description'] = { $regex: description, $options: 'i' };
    }
    if (tags) {
        const tagsArray = tags.split(',').map(tag => new RegExp(tag.trim(), 'i'));
        queryObject['tags'] = { $all: tagsArray };
    }
    if (startDate || endDate) {
        queryObject['date'] = {};
        if (startDate) {
            queryObject['date'].$gte = new Date(startDate);
        }
        if (endDate) {
            queryObject['date'].$lte = new Date(endDate);
        }
    }

    try {
        const liveSessions = await LiveSession.find(queryObject).populate('creator');
        res.json(liveSessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchProfessionals = async (req, res, next) => {
    let { firstName, lastName, specialization, email } = req.query;
    let queryObject = { role: 'professional' };

    if (firstName) {
        queryObject['firstName'] = { $regex: firstName, $options: 'i' };
    }
    if (lastName) {
        queryObject['lastName'] = { $regex: lastName, $options: 'i' };
    }
    if (specialization) {
        queryObject['specialization'] = { $regex: specialization, $options: 'i' };
    }
    if (email) {
        queryObject['email'] = { $regex: email, $options: 'i' };
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
    let { title, description, cost } = req.query;
    let queryObject = {};

    if (title) {
        queryObject['title'] = { $regex: title, $options: 'i' };
    }
    if (description) {
        queryObject['description'] = { $regex: description, $options: 'i' };
    }
    if (cost) {
        queryObject['cost'] = cost;
    }

    try {
        const exercisePlans = await ExercisePlan.find(queryObject);
        res.json(exercisePlans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchMealPlans = async (req, res, next) => {
    let { title, calories, cost } = req.query;
    let queryObject = {};

    if (title) {
        queryObject['title'] = { $regex: title, $options: 'i' };
    }
    if (calories) {
        queryObject['calories'] = calories;
    }
    if (cost) {
        queryObject['cost'] = cost;
    }

    try {
        const mealPlans = await MealPlan.find(queryObject);
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
    autocompleteSearchProfessionals
};