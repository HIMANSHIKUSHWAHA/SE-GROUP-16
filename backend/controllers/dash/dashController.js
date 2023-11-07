const { Calendar, createDefaultCalendar } = require('../../models/Calendar')
const AppError = require('../../utils/AppError')
const User = require('../../models/User');
const { videoCards } = require("../../models/AsyncVideo")

// The data needs to go in the form of {monday:{sleep:seep_data, }}
/*
    returns response - {data -> calendar sleep meal and workout data, eventList -> list of events and sessions registered in}
*/

const calendarData = async (req, res, next) => {
    console.log("Calendar_data CONTROLLER CALLED");
    try {
        // console.log("COOKIE IS ", req.cookies);
        // const userId = req.cookies.userId; // Adjust based on how you have set the cookie
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        // Fetch the calendar data for the user from the database
        const userCalendarData = await Calendar.findOne({ userId: userId });

        if (!userCalendarData) {
            // Handle the case where no calendar data is found for the user
            // return res.status(404).send({ error: 'No calendar data found for the user' });
            createDefaultCalendar(userId);
        }

        //TODO add live session part -> Fetch live session part from user model
        const user = await User.findById(userId);
        const eventList = user.LiveSessionEnrolled;
        //TODO added test value to live session list
        test_live_session = {
            "_id": "1a2b3c4d5e6f",
            "title": "Morning Yoga Session",
            "description": "A refreshing yoga session to kickstart your day with positive energy.",
            "date": "2023-10-28",
            "startTime": "08:00 AM",
            "duration": "60 minutes"
        }
        eventList.push(test_live_session);
        console.log("CALENDAR DATA BACKEND DONE");
        res.status(201).json({
            data: userCalendarData,
            event_list: eventList
        });
    } catch (error) {

        return next(new AppError(error.message, error.statusCode || 500));
    }
};

const videoCardData = async (req, res, next) => {
    try {

        // const userId = req.query.userId; // Will use this in future for video recommendation
        // if (!userId) {
        //     return res.status(400).send({ error: 'User ID is required' });
        // }

        const allVids = await videoCards.find();
        
        res.status(200).json({
            data: allVids
        });

    }catch (error){

        return next(new AppError(error.message, error.statusCode || 500));

    }
};

module.exports = { calendarData, videoCardData};