const express = require('express');
const User = require('../../models/User');
const AsyncVideo = require('../../models/AsyncVideo');
const LiveSession = require('../../models/LiveSession');
const ExercisePlan = require('../../models/ExercisePlan');
const MealPlan = require('../../models/MealPlan');
const Professional = require('../../models/Professional');
const { populate } = require("dotenv");


//for the purpose of returning all content upon initially visiting a page.
const getAllAsyncVideos = async (req, res) => {
    try {
        const videos = await AsyncVideo.find().populate('ratings');
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllLiveSessions = async (req, res) => {
    try {
        const userId = req.query.userId; // Get user ID from the query parameters

        const liveSessions = await LiveSession.find()
            .select('+enrolled')
            .populate('creator', 'firstName lastName')
            .lean(); // Convert to plain JavaScript objects to add custom fields

        const sessionsWithEnrollment = liveSessions.map(session => {
            const enrolledUserIds = session.enrolled.map(id => id.toString());
            const isEnrolled = enrolledUserIds.includes(userId);

            return {
                ...session,
                isEnrolled: isEnrolled
            };
        });

        res.json(sessionsWithEnrollment);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllExercisePlans = async (req, res) => {
    try {
        const exercisePlans = await ExercisePlan.find();
        res.json(exercisePlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllMealPlans = async (req, res) => {
    try {
        const mealPlans = await MealPlan.find();
        res.json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAsyncVideos,
    getAllLiveSessions,
    getAllUsers,
    getAllExercisePlans,
    getAllMealPlans
};