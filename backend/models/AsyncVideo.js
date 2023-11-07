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
        required: true
    },
    ratings: Ratings,
    viewCount: {
        type: Number,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    }
});
export default AsyncVideo