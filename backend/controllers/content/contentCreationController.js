const AsyncVideo = require("../../models/AsyncVideo");
const Professional = require("../../models/Professional");
const Ratings= require("../../models/Ratings");
const mongoose = require("mongoose");

const createVideo = async (req, res, next) => {
    try {
        const { title, description, link, creatorId, tags } = req.body;
        const newRatings = new Ratings();
        const ratingsId = newRatings._id;

        const newVideo = new AsyncVideo({
            title,
            description,
            link,
            creator: creatorId,
            ratings: ratingsId,
            viewCount: 0,
            tags
        });

        const savedVideo = await newVideo.save();

        // Save the new Ratings instance if you created one
        await newRatings.save();

        const videoCreator = await Professional.findById(creatorId).select('+creator');
        if (!videoCreator) {
            return res.status(404).json({ message: "Professional not found" });
        }
        videoCreator.asyncVideosAssociated.push(savedVideo._id);
        await videoCreator.save();

        console.log(`Video created with parameters:\nTitle: ${title}\nDescription: ${description}\nLink: ${link}\nTags: ${tags.join(", ")}`);
        res.status(201).json(savedVideo);
    } catch (error) {
        next(error);
    }
};




const createLiveSession = async (req, res, next) => {
    try {
        const { title, description, link, creatorId } = req.body;
        const newSession = new LiveSession({ title, description, link, creator: creatorId });
        const savedSession = await newSession.save();

        const sessionCreator = await Professional.findById(creatorId);
        if (!sessionCreator) {
            return res.status(404).json({ message: "Professional not found" });
        }

        sessionCreator.LiveSessionCreated.push(savedSession._id);
        await sessionCreator.save();

        console.log(`Live session created with parameters:\nTitle: ${title}\nDescription: ${description}\nLink: ${link}`);
        res.status(201).json(savedSession);
    } catch (error) {
        next(error);
    }
};

module.exports = {createVideo, createLiveSession};