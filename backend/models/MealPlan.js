const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ratings = require('../models/Ratings').schema;
// Define the Meal schema
const mealSchema = new Schema({
    mealItems: [String],
    calories: Number,
    carbs: Number,
    fats: Number,
    proteins: Number
});

// Define the MealPlanDay schema
const mealPlanDaySchema = new mongoose.Schema({
    waterIntake: Number, // in liters
    calories: {
        type: Number,
        default: function () {
            return this.breakfast.calories + this.lunch.calories + this.dinner.calories;
        }
    },
    proteins: {
        type: Number,
        default: function () {
            return this.breakfast.proteins + this.lunch.proteins + this.dinner.proteins;
        }
    },
    carbs: {
        type: Number,
        default: function () {
            return this.breakfast.carbs + this.lunch.carbs + this.dinner.carbs;
        }
    },
    fats: {
        type: Number,
        default: function () {
            return this.breakfast.fats + this.lunch.fats + this.dinner.fats;
        }
    },
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema
});

// Define the MealPlan schema
const mealPlanSchema = new mongoose.Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        select: false
    },
    cost: Number,
    title: String,
    description: String,
    tags: Array,
    ratings: {
        type: Schema.Types.ObjectId,
        ref: 'Ratings'
    },
    isDefault: { type: Boolean, default: false },
    ratings: { type: Schema.Types.ObjectId, ref: 'Ratings' },
    creator: { type: Schema.Types.ObjectId, ref: 'Professional' },
    Monday: mealPlanDaySchema,
    Tuesday: mealPlanDaySchema,
    Wednesday: mealPlanDaySchema,
    Thursday: mealPlanDaySchema,
    Friday: mealPlanDaySchema,
    Saturday: mealPlanDaySchema,
    Sunday: mealPlanDaySchema
});

// Create and export the MealPlan model
module.exports = mongoose.model('MealPlan', mealPlanSchema); 