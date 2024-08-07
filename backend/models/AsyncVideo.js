const mongoose = require('mongoose');
const { Schema } = mongoose;
const Ratings = require('../models/Ratings').schema;

const asyncVideoSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
    },
    title: {
        type: String,
        required: true
    },
    ratings: {
        type: Schema.Types.ObjectId,
        ref: 'Ratings'
    },
    viewCount: {
        type: Number,
        required: true,
        default: 0
    },
    tags: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AsyncVideo', asyncVideoSchema);