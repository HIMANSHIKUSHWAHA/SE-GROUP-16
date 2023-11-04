const { Calendar } = require('../../models/Calendar')
const AppError = require('../../utils/AppError')
const User = require('../../models/User');

const calendarData = async (req, res, next) => {
    console.log("Calendar_data CONTROLLER CALLED");
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        // Fetch and populate the calendar data for the user
        const userCalendarData = await Calendar.findOne({ userId: userId })
            .populate({
                path: 'sleepId',
                model: 'Sleepplan'
            })
            .populate({
                path: 'mealPlanId',
                model: 'Mealplan'
            })
            .populate({
                path: 'exercisePlanId',
                model: 'Exerciseplan'
            })
            .populate({
                path: 'liveSessionList',
                model: 'LiveSession'
            });

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
            // liveSessions: userCalendarData.liveSessionList
        };

        // //TODO add live session part -> Fetch live session part from user model
        // const user = await User.findById(userId);
        // const eventList = user.LiveSessionEnrolled;

        console.log("CALENDAR DATA BACKEND DONE");
        res.status(201).json({
            data: formattedCalendarData,
            // event_list: eventList
        });
    } catch (error) {
        return next(new AppError(error.message, error.statusCode || 500));
    }
};

module.exports = { calendarData };