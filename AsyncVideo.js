const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Ratings } = require('../models/Ratings');
const AsyncVideo = new mongoose.schema({
    creator: {
        type: Schema.types.objectId,
        ref: 'Professional',
        select: false
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    ratings: Ratings,
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
export default AsyncVideo