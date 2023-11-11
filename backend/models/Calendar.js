const mongoose = require('mongoose');
const SleepPlan = require('./Sleepplan');
const MealPlan = require('./Mealplan');
const ExercisePlan = require('./Exerciseplan');


// Define the schema for the calendar, linked to a user
const CalendarSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    sleepId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sleepplan',
        required: true,
        unique: true
    },
    mealPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mealplan',
        required: true,
        unique: true
    },
    exercisePlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exerciseplan',
        required: true,
        unique: true
    },
    liveSessionList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveSession'
    }]
});


const createDefaultCalendar = async (userId) => {
    try {
        // Retrieve the default IDs from the database
        const defaultSleepPlan = await SleepPlan.findOne({ isDefault: true });
        const defaultMealPlan = await MealPlan.findOne({ isDefault: true });
        const defaultExercisePlan = await ExercisePlan.findOne({ isDefault: true });
        //const defaultLiveSessions = await LiveSession.find({ default: true });

        // Check if defaults exist
        if (!defaultSleepPlan || !defaultMealPlan || !defaultExercisePlan) {
            throw new Error('Default plans are not set up in the database.');
        }

        // Create the default calendar with the default plan IDs
        const defaultCalendar = new Calendar({
            userId,
            sleepId: defaultSleepPlan._id,
            mealPlanId: defaultMealPlan._id,
            exercisePlanId: defaultExercisePlan._id,
            //liveSessionList: defaultLiveSessions.map(session => session._id) 
        });

        // Save the default calendar to the database
        await defaultCalendar.save();
        console.log('Default calendar created successfully.');
    } catch (err) {
        console.error('Error creating default calendar:', err);
    }
};



const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = {
    Calendar,
    createDefaultCalendar
};


