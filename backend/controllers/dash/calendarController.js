const { Calendar, createDefaultCalendar } = require('../../models/Calendar')
const AppError = require('../../utils/AppError')
const User = require('../../models/User');
const LiveSession = require('../../models/LiveSession');
const Professional = require('../../models/Professional');
const MealPlan = require('../../models/MealPlan');
const ExercisePlan = require('../../models/ExercisePlan');


const getDefaultMealPlanId = async () => {
    const defaultMealPlan = await MealPlan.findOne({ isDefault: true });
    return defaultMealPlan ? defaultMealPlan._id : null;
};

const validateAndAssignDefaultMealPlan = async (userCalendarData) => {
    if (userCalendarData.mealPlanId) {
        // Check if the current mealPlanId corresponds to a valid meal plan
        const existingMealPlan = await MealPlan.findById(userCalendarData.mealPlanId);
        if (!existingMealPlan) {
            // If not valid, assign the default meal plan ID
            const defaultMealPlanId = await getDefaultMealPlanId();
            if (defaultMealPlanId) {
                userCalendarData.mealPlanId = defaultMealPlanId;
                await userCalendarData.save(); // Save the updated calendar data
            } else {
                // Handle the case where there is no default meal plan
                console.log("NO DEFAULT MEAL PLAN")
            }
        }
    } else {
        // If mealPlanId is null, also assign the default meal plan ID
        const defaultMealPlanId = await getDefaultMealPlanId();
        if (defaultMealPlanId) {
            userCalendarData.mealPlanId = defaultMealPlanId;
            await userCalendarData.save();
        } else {
            console.log("NO DEFAULT MEAL PLAN")
        }
    }
};

const getDefaultExercisePlanId = async () => {
    const defaultExercisePlan = await ExercisePlan.findOne({ isDefault: true });
    return defaultExercisePlan ? defaultExercisePlan._id : null;
};

const validateAndAssignDefaultExercisePlan = async (userCalendarData) => {
    if (userCalendarData.exercisePlanId) {
        // Check if the current exercisePlanId corresponds to a valid exercise plan
        const existingExercisePlan = await ExercisePlan.findById(userCalendarData.exercisePlanId);
        if (!existingExercisePlan) {
            // If not valid, assign the default exercise plan ID
            const defaultExercisePlanId = await getDefaultExercisePlanId();
            if (defaultExercisePlanId) {
                userCalendarData.exercisePlanId = defaultExercisePlanId;
                await userCalendarData.save(); // Save the updated calendar data
            } else {
                console.log("NO DEFAULT EXERCISE PLAN EXISTS");
            }
        }
    } else {
        // If exercisePlanId is null, also assign the default exercise plan ID
        const defaultExercisePlanId = await getDefaultExercisePlanId();
        if (defaultExercisePlanId) {
            userCalendarData.exercisePlanId = defaultExercisePlanId;
            await userCalendarData.save();
        } else {
            console.log("NO DEFAULT EXERCISE PLAN EXISTS");
        }
    }
};

const calendarData = async (req, res, next) => {
    console.log("Calendar_data CONTROLLER CALLED");
    try {
        const { userId, role } = req.query;
        const currentDate = new Date();

        await LiveSession.deleteMany({
            $expr: {
                $lt: [
                    { $add: ["$date", { $multiply: ["$duration", 60000] }] }, // Calculating end time
                    currentDate
                ]
            }
        });

        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        if (role === 'professional') {
            const professional = await Professional.findById(userId).populate({
                path: 'LiveSessionCreated',
                model: 'LiveSession'
            });


            if (!professional) {
                return res.status(404).send({ error: 'Professional not found' });
            }

            const liveSessions = professional.LiveSessionCreated.map(session => ({
                title: session.title,
                description: session.description,
                tags: session.tags,
                date: session.date,
                duration: session.duration
            }));

            console.log("CALENDAR DATA BACKEND DONE");
            return res.status(200).json({ events: liveSessions });
        }

        else {

            const user = await User.findById(userId).populate('LiveSessionEnrolled');
            let userCalendarData = await Calendar.findOne({ userId: userId })

            if (!userCalendarData) {
                createDefaultCalendar(userId);
                userCalendarData = await Calendar.findOne({ userId: userId });
            }

            await validateAndAssignDefaultMealPlan(userCalendarData);

            await validateAndAssignDefaultExercisePlan(userCalendarData);



            userCalendarData = await Calendar.findOne({ userId: userId }).populate({
                path: 'sleepId',
                model: 'SleepPlan'
            })
                .populate({
                    path: 'mealPlanId',
                    model: 'MealPlan'
                })
                .populate({
                    path: 'exercisePlanId',
                    model: 'ExercisePlan'
                })

            if (!userCalendarData) {
                return res.status(404).send({ error: 'No calendar data found for the user' });
            }

            // Extract the plan data for each day
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const planData = {};
            const sleepData = {
                startTime: userCalendarData.sleepId.startTime,
                endTime: userCalendarData.sleepId.endTime,
                totalHours: userCalendarData.sleepId.totalHours
            };

            daysOfWeek.forEach(day => {

                planData[day] = {
                    sleep: sleepData,
                    meals: userCalendarData.mealPlanId[day],
                    exercises: userCalendarData.exercisePlanId[day]
                };


            });
            // Format the data for the response
            const formattedCalendarData = {
                ...planData,
            };

            const liveSessions = user.LiveSessionEnrolled?.map(session => ({
                title: session.title,
                description: session.description,
                tags: session.tags,
                date: session.date,
                duration: session.duration
            }));

            console.log("CALENDAR DATA BACKEND DONE");
            res.status(201).json({
                data: formattedCalendarData,
                events: liveSessions
            });
        }
    } catch (error) {
        console.log(error);
        return next(new AppError(error.message, error.statusCode || 500));
    }

};

module.exports = { calendarData };