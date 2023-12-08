const { Calendar, createDefaultCalendar } = require('../../models/Calendar')
const AppError = require('../../utils/AppError')
const User = require('../../models/User');
const LiveSession = require('../../models/LiveSession');
const Professional = require('../../models/Professional');

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
            }


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