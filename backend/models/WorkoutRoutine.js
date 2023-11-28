const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Ratings } = require('../models/Ratings');

const WorkoutRoutine = new mongoose.schema({

    creator: {
        type: Schema.types.objectId,
        ref: 'Professional',
        select: false // why
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: Array, // Array of string
        required: true
    },
    ratings: Ratings,
    description: {
        type: String,
        required: true
    },
    difficultyLevel: {
        type: String,
        required: true
    },
    routine: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('WorkoutRoutine', WorkoutRoutine);