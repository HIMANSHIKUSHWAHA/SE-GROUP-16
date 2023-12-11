const AsyncVideo = require("../../models/AsyncVideo");
const Professional = require("../../models/Professional");
const Ratings= require("../../models/Ratings");
const mongoose = require("mongoose");
const ExercisePlan = require("../../models/ExercisePlan");
const MealPlan = require("../../models/MealPlan");
const User = require("../../models/User");

const findObject = async (id) => {
    console.log('PROFILE CONTROLLER CALLED');
    console.log("SEARCHING DATABASE WITH OBJECT ID: " + id);
    try {
        let object = await User.findById(id).select("-password -token +firstName +lastName");
        let objectType = "User";
        if (!object) {
            object = await Professional.findById(id);
            objectType = "Professional";
        }
        if (!object) {
            object = await AsyncVideo.findById(id);
            objectType = "AsyncVideo";
        }
        if (!object) {
            object = await ExercisePlan.findById(id);
            objectType = "ExercisePlan";
        }
        if (!object) {
            object = await MealPlan.findById(id);
            objectType = "MealPlan";
        }
        if (!object) {
            object = await Professional.findById(id);
            objectType = "Professional";
        }
        if (!object) {
            object = await Ratings.findById(id);
            objectType = "Ratings";
        }
        if (!object) {
            return { status: 404, json: { message: "Object not found" } };
        }
        console.log("OBJECT FOUND!");
        return { status: 200, json: { data: object, type: objectType } };
    } catch (error) {
        return { status: 500, json: { message: "Internal server error" } };
    }
}

module.exports = {
    findObject
};