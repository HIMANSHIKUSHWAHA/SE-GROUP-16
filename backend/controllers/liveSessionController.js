const LiveSession = require("../models/LiveSession");
const Professional = require("../models/Professional");
const User = require("../models/User");
const Calendar = require("../models/Calendar");
const jwt = require('jsonwebtoken');
const axios = require('axios');



const schedule = async (req, res) => {
    console.log("LIVE STREAM CONTROLLER CALLED");
    try {

        const { title, creatorId, description, startTime, tags } = req.body;
        const professional = await Professional.findById(creatorId).select('Subscribers').lean();

        if (!professional) {
            return res.status(404).json({ message: "Professional not found" });
        }

        const liveSession = new LiveSession({
            title: title,
            creator: creatorId,
            enrolled: professional.Subscribers,
            description: description,
            tags: tags,
            date: startTime,
        });

        await liveSession.save();

        await Professional.findByIdAndUpdate(creatorId, {
            $push: { LiveSessionCreated: liveSession._id }
        });

        await User.updateMany(
            { _id: { $in: liveSession.enrolled } },
            { $push: { LiveSessionEnrolled: liveSession._id } }
        );

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: true, message: "Error in scheduling controller" });
    }

};

const enroll = async (req, res) => {

    try {
        const { userId, eventId } = req.body;

        console.log("BACKENd EVENT ID ", eventId);
        const user = await User.findById(userId).select('+LiveSessionEnrolled');
        const session = await LiveSession.findById(eventId).select('+enrolled');

        user.LiveSessionEnrolled.push(eventId);
        session.enrolled.push(userId);

        // Save the changes
        await user.save();
        await session.save();
        res.json({ message: 'Successfully enrolled in the session' });
    } catch (error) {
        console.error('Error enrolling in session:', error);
        res.status(500).json({ message: 'Error enrolling in session' });
    }
};

module.exports = {
    schedule,
    enroll
}