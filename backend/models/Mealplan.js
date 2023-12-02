const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    cost: Number,
    title: String,
    description: String,
    tags: Array,
    isDefault: { type: Boolean, default: false },
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
const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
module.exports = MealPlan;
