const AsyncVideo = require("../../models/AsyncVideo");
const Professional = require("../../models/Professional");
const Ratings= require("../../models/Ratings");
const mongoose = require("mongoose");
const ExercisePlan = require("../../models/ExercisePlan");
const MealPlan = require("../../models/MealPlan");

const findContent = async (id) => {
    console.log("SEARCHING DATABASE WITH CONTENTID: " + id);
    try {
        let content = await AsyncVideo.findById(id);
        let contentType = "AsyncVideo";
        if (!content) {
            content = await ExercisePlan.findById(id);
            contentType = "ExercisePlan";
        }
        if (!content) {
            content = await MealPlan.findById(id);
            contentType = "MealPlan";
        }
        if (!content) {
            content = await Professional.findById(id);
            contentType = "Professional";
        }
        if (!content) {
            content = await Ratings.findById(id);
            contentType = "Ratings";
        }
        if (!content) {
            return { status: 404, json: { message: "Content not found" } };
        }
        return { status: 200, json: { data: content, type: contentType } };
    } catch (error) {
        return { status: 500, json: { message: "Internal server error" } };
    }
}
module.exports = {
    findContent,
};