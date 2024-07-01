require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
// Import the models
const ExercisePlan = require('../models/ExercisePlan');
const SleepPlan = require('../models/SleepPlan');
const MealPlan = require('../models/MealPlan');
const AsyncVideo = require('../models/AsyncVideo');
const Professional = require("../models/Professional");
const User = require("../models/User");
const LiveSession = require('../models/LiveSession');
const Ratings = require('../models/Ratings');
// MongoDB connection URI
// const mongoURI = 'mongodb://localhost:27017'
// const mongoURI = 'mongodb+srv://rahul:rahul@p465.4cmbcpe.mongodb.net/';
const mongoURI = process.env.DB_STRING;
const data = require("./data.json");

console.log('Database URI:', process.env.DB_STRING);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const createAsyncVideo = async (title, description, link, tags, professionalId, isDefault = false) => {
    let asyncVideo = await AsyncVideo.findOne({ title: title });

    if (!asyncVideo) {
        // Create a new Ratings document if needed
        const newRatings = new Ratings({ ratings: new Map() });
        await newRatings.save();

        // Create a new AsyncVideo document with provided details
        asyncVideo = new AsyncVideo({
            title: title,
            ratings: newRatings._id,
            viewCount: 0,
            creator: professionalId,
            tags: tags,
            description: description,
            link: link,
            isDefault: isDefault
        });

        await asyncVideo.save();
        console.log(`${title} AsyncVideo created successfully.`);
        return asyncVideo._id;
    } else {
        console.log(`${title} AsyncVideo already exists.`);
        return asyncVideo._id;
    }
};

const createDefaultAsyncVideo = async (professionalId) => {

    await AsyncVideo.deleteMany({});
    // const id = await createAsyncVideo("How to do push-ups", "temp", "https://www.youtube.com/embed/IODxDxX7oi4?si=tmEZbNQSGXV3NqZt", professionalId);
    const videos = data["videos"];

    // console.log(videos);
    let ids = [];
    for (let i = 0; i < videos.length; i++) {
        const item = videos[i];
        const tmp_id = await createAsyncVideo(item.title, item.description, item.link, item.tags);
        ids.push(tmp_id);
    }
    return ids;
};

const createExercisePlan = async (title, description, cost, difficulty_level, exerciseDays, professionalId, tags = [], isDefault = false) => {
    let exercisePlan = await ExercisePlan.findOne({ title: title });

    if (!exercisePlan) {
        const newRatings = new Ratings({ ratings: new Map() });
        await newRatings.save();
        exercisePlan = new ExercisePlan({
            title: title,
            ratings: newRatings._id,
            description: description,
            difficulty_level: difficulty_level,
            cost: cost,
            ...exerciseDays,
            tags: tags, // Add tags here
            isDefault: isDefault,
            creator: professionalId
        });

        await exercisePlan.save();
        console.log(`${title} ExercisePlan created successfully.`);
    } else {
        console.log(`${title} ExercisePlan already exists.`);
    }

    return exercisePlan._id;
};
const createDefaultExercisePlan = async (professionalId) => {

    await ExercisePlan.deleteMany({});

    const mp = data["exercise-plans"];
    let ids = [];
    for (let i = 0; i < mp.length; i++) {
        let mealDays = {};
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
            mealDays[day] = mp[i][day];
        }
        const tmp_id = await createExercisePlan(mp[i]["title"], mp[i]["description"], mp[i]["cost"], mp[i]["difficulty_level"], mealDays, professionalId, mp[i]["tags"]);
        ids.push(tmp_id);
    }

    return ids;
};

const createDefaultUser = async () => {
    // Check for an existing default User
    let user = await User.findOne({ email: "default.user@example.com" });

    if (!user) {
        user = new User({
            firstName: "Default",
            lastName: "User",
            email: "default.user@example.com",
            password: "defaultPassword",
            height: 170,
            weight: 60
        });

        await user.save();
        console.log('Default User created successfully.');
    } else {
        console.log('Default User already exists.');
    }

    return user._id;
};



const createProfessional = async (firstName, lastName, email, password, specialization) => {
    let professional = await Professional.findOne({ email: email });

    if (!professional) {
        professional = new Professional({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password, // This should be hashed in the pre-save hook
            specialization: specialization
            // Add other necessary default values
        });

        await professional.save();
        console.log(`${firstName} ${lastName} created successfully.`);
    } else {
        console.log(`${firstName} ${lastName} already exists.`);
    }

    return professional._id;
};

const createDefaultProfessional = async () => {
    const defaultProfessionalId = await createProfessional("Default", "Professional", "default.professional@example.com", "defaultPassword", "General Wellness");
    const professional2Id = await createProfessional("John", "Doe", "john.doe@example.com", "johnPassword", "Nutrition");
    const professional3Id = await createProfessional("Jane", "Smith", "jane.smith@example.com", "janePassword", "Fitness Training");

    return [defaultProfessionalId, professional2Id, professional3Id];
};


const createMealPlan = async (title, description, cost, mealsForDay, professionalId, tags = [], isDefault = false) => {
    let mealPlan = await MealPlan.findOne({ title: title });

    if (!mealPlan) {
        const newRatings = new Ratings({ ratings: new Map() });
        await newRatings.save();
        mealPlan = new MealPlan({
            title: title,
            description: description,
            cost: cost,
            ratings: newRatings._id,
            ...mealsForDay,
            tags: tags, // Add tags here
            isDefault: isDefault,
            creator: professionalId
        });

        await mealPlan.save();
        console.log(`${title} MealPlan created successfully.`);
    } else {
        console.log(`${title} MealPlan already exists.`);
    }

    return mealPlan._id;
};

const createDefaultMealPlan = async (professionalId) => {

    await MealPlan.deleteMany({});

    const mp = data["meal-plans"];
    let ids = [];
    for (let i = 0; i < mp.length; i++) {
        let mealDays = {};
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
            mealDays[day] = mp[i][day];
        }
        const tmp_id = await createMealPlan(mp[i]["title"], mp[i]["description"], mp[i]["cost"], mealDays, professionalId, mp[i]["tags"]);
        ids.push(tmp_id);
    }

    return ids;
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

const createLiveSession = async (title, description, tags, date, professionalId, isDefault = false) => {
    let liveSession = await LiveSession.findOne({ title: title });

    if (!liveSession) {
        // Create a new LiveSession document with provided details
        const newLiveSession = new LiveSession({
            title: title,
            creator: professionalId,
            enrolled: [],
            description: description,
            tags: tags,
            date: date,
            isDefault: isDefault
        });

        await newLiveSession.save();
        console.log(`${title} LiveSession created successfully.`);
        return newLiveSession._id;
    } else {
        console.log(`${title} LiveSession already exists.`);
        return liveSession._id;
    }
};

const createDefaultLiveSession = async (professionalId) => {
    const defaultLiveSessionId = await createLiveSession("Default Live Session", "This is a default live session.", ["default", "live-session"], new Date(), professionalId, true);
    const fitnessSessionId = await createLiveSession("Fitness Bonanza", "High energy fitness session for all levels.", ["fitness", "energy"], new Date(), professionalId);
    const meditationSessionId = await createLiveSession("Mindful Meditation", "Relax and find peace with our meditation session.", ["meditation", "relaxation"], new Date(), professionalId);

    return { defaultLiveSessionId, fitnessSessionId, meditationSessionId };
};

const setupDefaultPlans = async () => {
    try {
        const [defaultProfessionalId, professional2Id, professional3Id] = await createDefaultProfessional();
        const userId = await createDefaultUser();
        const sleepPlanId = await createDefaultSleepPlan();
        const exercisePlanId = await createDefaultExercisePlan(defaultProfessionalId);
        const mealPlanId = await createDefaultMealPlan(defaultProfessionalId);
        const asyncVideoId = await createDefaultAsyncVideo(defaultProfessionalId);
        const liveSessionId = await createDefaultLiveSession(defaultProfessionalId);
        console.log(`Default Professional ID: ${defaultProfessionalId}`);
        console.log(`Default User ID: ${userId}`);
        console.log(`Default MealPlan ID: ${mealPlanId}`);
        console.log(`Default ExercisePlan ID: ${exercisePlanId}`);
        console.log(`Default SleepPlan ID: ${sleepPlanId}`);
        console.log(`Default AsyncVideo ID: ${asyncVideoId}`);
        console.log(`Default LiveSession ID: ${liveSessionId}`);
    } catch (err) {
        console.error('Error setting up default plans:', err);
    } finally {
        mongoose.disconnect();
    }
};

setupDefaultPlans();