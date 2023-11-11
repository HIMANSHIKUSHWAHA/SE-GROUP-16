require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

// Import the models 
const ExercisePlan = require('../models/Exerciseplan');
const SleepPlan = require('../models/Sleepplan');
const MealPlan = require('../models/Mealplan');

// MongoDB connection URI
const mongoURI = process.env.DB_STRING;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const createDefaultExercisePlan = async () => {
    // Check for an existing default ExercisePlan
    let exercisePlan = await ExercisePlan.findOne({ isDefault: true });

    if (!exercisePlan) {
        // Define a single default exercise to be used for each day
        const defaultExercise = {
            title: 'Push-ups',
            description: 'Standard push-ups.',
            referenceVideo: 'http://example.com/push-up-video',
            reps: 10,
            sets: 3
        };

        // Create a default ExerciseDay for each day of the week with the same exercise
        const exerciseDay = { exercises: [defaultExercise] };
        const exerciseDays = {};
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
            exerciseDays[day] = exerciseDay;
        }

        // Create the default ExercisePlan
        exercisePlan = new ExercisePlan({
            cost: 0, // Example default cost
            ...exerciseDays,
            isDefault: true
        });

        await exercisePlan.save();
        console.log('Default ExercisePlan created successfully.');
    } else {
        console.log('Default ExercisePlan already exists.');
    }

    return exercisePlan._id;
};



const createDefaultMealPlan = async () => {
    // Check for an existing default MealPlan
    let mealPlan = await MealPlan.findOne({ isDefault: true });

    if (!mealPlan) {
        // Define a single default meal to be used for each day
        const defaultMeal = {
            mealItems: ['Brown Rice', 'Grilled Chicken Breast', 'Steamed Broccoli'],
            calories: 600,
            carbs: 45,
            fats: 10,
            proteins: 40
        };

        // Create a default meal for each mealtime
        const defaultMealsForDay = {
            breakfast: defaultMeal,
            lunch: defaultMeal,
            dinner: defaultMeal,
            // Add any additional meals/snacks if necessary
        };

        // Create a default MealPlan for each day of the week with the same meals
        const mealDays = {};
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
            mealDays[day] = defaultMealsForDay;
        }

        // Create the default MealPlan
        mealPlan = new MealPlan({
            cost: 0, // Example default cost
            ...mealDays,
            isDefault: true // You might want to flag the default plan for easier retrieval
        });

        await mealPlan.save();
        console.log('Default MealPlan created successfully.');
    } else {
        console.log('Default MealPlan already exists.');
    }

    return mealPlan._id;
};

const createDefaultSleepPlan = async () => {
    // Check for an existing default SleepPlan
    let sleepPlan = await SleepPlan.findOne({ isDefault: true });

    if (!sleepPlan) {
        // Create the default SleepPlan
        sleepPlan = new SleepPlan({
            // Default values are already set in the schema
            isDefault: true // You might want to flag the default plan for easier retrieval
        });

        await sleepPlan.save();
        console.log('Default SleepPlan created successfully.');
    } else {
        console.log('Default SleepPlan already exists.');
    }

    return sleepPlan._id;
};

const setupDefaultPlans = async () => {
    try {
        const exercisePlanId = await createDefaultExercisePlan();
        const sleepPlanId = await createDefaultSleepPlan();
        const mealPlanId = await createDefaultMealPlan();
        console.log(`Default MealPlan ID: ${mealPlanId}`);
        console.log(`Default ExercisePlan ID: ${exercisePlanId}`);
        console.log(`Default SleepPlan ID: ${sleepPlanId}`);
    } catch (err) {
        console.error('Error setting up default plans:', err);
    } finally {
        mongoose.disconnect();
    }
};

setupDefaultPlans();