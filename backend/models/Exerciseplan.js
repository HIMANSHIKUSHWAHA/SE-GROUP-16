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
const exerciseDaySchema = new mongoose.Schema({
    exercises: [exerciseSchema] // An array of exercise schemas
});

// Define the ExercisePlan schema
const exercisePlanSchema = new mongoose.Schema({
    cost: Number,
    title: String,
    difficulty_level: String,
    description: String,
    tags: Array,
    isDefault: { type: Boolean, default: false },
    Monday: exerciseDaySchema,
    Tuesday: exerciseDaySchema,
    Wednesday: exerciseDaySchema,
    Thursday: exerciseDaySchema,
    Friday: exerciseDaySchema,
    Saturday: exerciseDaySchema,
    Sunday: exerciseDaySchema
});

// Create and export the ExercisePlan model
const ExercisePlan = mongoose.model('ExercisePlan', exercisePlanSchema);
module.exports = ExercisePlan;

