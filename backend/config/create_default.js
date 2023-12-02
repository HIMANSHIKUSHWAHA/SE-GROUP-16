require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

// Import the models
const ExercisePlan = require('../models/Exerciseplan');
const SleepPlan = require('../models/SleepPlan');
const MealPlan = require('../models/Mealplan');
const LiveSession = require('../models/LiveSession');
const AsyncVideo = require('../models/AsyncVideo');
const Ratings = require("../models/Ratings")
const Professional = require('../models/Professional');
const User = require('../models/User');
// MongoDB connection URI
const mongoURI = process.env.DB_STRING;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const createDefaultAsyncVideo = async () => {
    let asyncVideo = await AsyncVideo.findOne({ title: "Default Video" });

    if (!asyncVideo) {
        // Create a new Ratings document
        const newRatings = new Ratings({ ratings: new Map() }); // Assuming you have a map structure in Ratings
        await newRatings.save();

        asyncVideo = new AsyncVideo({
            title: "Default Video",
            ratings: newRatings._id, // Set the Object ID of the new Ratings document
            viewCount: 0,
            tags: ["default", "video"],
            description: "This is a default video.",
            link: "https://www.youtube.com/watch?v=cIwTYL1fwJk&ab_channel=freshvids123"
        });

        await asyncVideo.save();
        console.log('Default AsyncVideo created successfully.');
    } else {
        console.log('Default AsyncVideo already exists.');
    }

    return asyncVideo._id;
};

const createLiveSession = async () => {
    // Check for an existing default ExercisePlan
    let liveSession = await LiveSession.findOne({ isDefault: true });

    // profess is ac and user is ab
    const professionalId = "656ab00646472068847d7bc7";
    const userId = "656aaf5946472068847d7b6d";

    const profesh = await Professional.findById(professionalId).select("+LiveSessionCreated");
    const user = await User.findById(userId).select("+LiveSessionEnrolled");

    console.log("user - ", user.firstName, "Profesh ", profesh.firstName);

    if (!liveSession) {
        liveSession = new LiveSession({
            title: 'Default Session Title',
            creator: profesh._id, // Generate a new ObjectId
            duration: 30,
            enrolled: [user._id],
            description: 'Default session description',
            tags: ['default', 'session'],
            date: new Date(),
            isDefault: true
        });



        user.LiveSessionEnrolled.push(liveSession._id);
        profesh.LiveSessionCreated.push(liveSession._id);

        await liveSession.save();
        await user.save();
        await profesh.save();

        console.log('Default Livesession created successfully.');
    } else {
        console.log('Default Livesession already exists.');
    }

    return liveSession._id;
};

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
        const asyncVideoId = await createDefaultAsyncVideo();
        const liveSessionId = await createLiveSession();
        console.log(`Default MealPlan ID: ${mealPlanId}`);
        console.log(`Default ExercisePlan ID: ${exercisePlanId}`);
        console.log(`Default SleepPlan ID: ${sleepPlanId}`);
        console.log(`Default AsyncVideo ID: ${asyncVideoId}`);
        console.log(`Default Live session ID: ${liveSessionId}`);;

    } catch (err) {
        console.error('Error setting up default plans:', err);
    } finally {
        mongoose.disconnect();
    }
};

setupDefaultPlans();