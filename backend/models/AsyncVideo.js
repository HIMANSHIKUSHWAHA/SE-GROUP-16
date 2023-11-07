const mongoose = require('mongoose');
const { Schema } = mongoose;
// const { Ratings } = require('../models/Ratings');
const AsyncVideo = new mongoose.Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        select: false
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    // ratings: Ratings,
    ViewCount: {
        type: Number,
        required: true,
    },
    Tags: {
        type: [String],
        required: true,
    },
    Description: {
        type: String,
        required: true,
        unique: true
    },
    Link: {
        type: String,
        required: true,
        unique: true
    }
});

const videoCards = mongoose.model('videoCards', AsyncVideo);

module.exports = { videoCards }