const express = require('express');
const AsyncVideo = require('../../models/AsyncVideo');

// Define the handler function for the route
const getAllVideos = async (req, res) => {
    try {
        const videos = await AsyncVideo.find().populate('ratings');
        console.log(videos);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export the handler function
module.exports = getAllVideos;