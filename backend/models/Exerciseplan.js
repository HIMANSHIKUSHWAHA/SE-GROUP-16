const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Exercise schema
const exerciseSchema = new Schema({
    title: String,
    description: String,
    referenceVideo: String, // URL of the reference video
    reps: Number,
    sets: Number
});

// Define the ExerciseDay schema
// const exerciseDaySchema = new mongoose.Schema({
//     exercises: [exerciseSchema] // An array of exercise schemas
// });

// Define the ExercisePlan schema
const exercisePlanSchema = new mongoose.Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        select: false
    },
    cost: Number,
    title: String,
    difficulty_level: String,
    description: String,
    tags: Array,
    ratings: {
        type: Schema.Types.ObjectId,
        ref: 'Ratings'
    },
    isDefault: { type: Boolean, default: false },
    Monday: [exerciseSchema],
    Tuesday: [exerciseSchema],
    Wednesday: [exerciseSchema],
    Thursday: [exerciseSchema],
    Friday: [exerciseSchema],
    Saturday: [exerciseSchema],
    Sunday: [exerciseSchema]
});

// Create and export the ExercisePlan model
const ExercisePlan = mongoose.model('ExercisePlan', exercisePlanSchema);
module.exports = ExercisePlan;

