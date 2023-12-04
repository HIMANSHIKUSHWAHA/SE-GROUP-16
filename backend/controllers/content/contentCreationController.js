const AsyncVideo = require("../../models/AsyncVideo");
const Professional = require("../../models/Professional");
const Ratings= require("../../models/Ratings");
const User = require('../../models/User');
const ExercisePlan = require("../../models/ExercisePlan");
const MealPlan = require("../../models/MealPlan");
const Tags = require("../../models/Tags");
const mongoose = require("mongoose");

const createVideo = async (req, res, next) => {
    try {
        const { title, description, link, creatorId, tags } = req.body;
        const videoCreator = await Professional.findById(creatorId).select('+creator');
        if (!videoCreator) {
            return res.status(404).json({ message: "Professional not found" });
        }

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

        
        videoCreator.asyncVideosAssociated.push(savedVideo._id);
        await videoCreator.save();

        console.log(`Video created with parameters:\nTitle: ${title}\nDescription: ${description}\nLink: ${link}\nTags: ${tags.join(", ")}`);
        res.status(201).json(savedVideo);
    } catch (error) {
        next(error);
    }
};


const createExercisePlan = async (req, res, next) => {
    try {

        const { title, description, tags, difficulty_level, creatorId, cost, routine } = req.body;
        const planCreator = await Professional.findById(creatorId).select('+creator');
        if (!planCreator) {
            return res.status(404).json({ message: "Professional not found" });
        }

        const newRatings = new Ratings();
        const ratingsId = newRatings._id;
        
        let rout = {};
        for(let i=0;i<routine.length;i++){
            rout[routine[i]["day"]] = routine[i]["exercises"];
        }

        const newPlan = new ExercisePlan({
            title,
            description,
            tags,
            difficulty_level,
            creator: creatorId,
            cost,
            ratings: ratingsId,
            Monday: rout['Monday'],
            Tuesday: rout['Tuesday'],
            Wednesday: rout['Wednesday'],
            Thursday: rout['Thursday'],
            Friday: rout['Friday'],
            Saturday: rout['Saturday'],
            Sunday: rout['Sunday']
        });

        const savedPlan = await newPlan.save();
        await newRatings.save();
        
        planCreator.exercisePlanAssociated.push(savedPlan._id);
        await planCreator.save();

        console.log(`Plan created`);
        res.status(201).json(savedPlan);
    } catch (error) {
        next(error);
    }
};

const createMealPlan = async (req, res, next) => {
    try {

        const { title, description, tags, creatorId, cost, routine } = req.body;
        const planCreator = await Professional.findById(creatorId).select('+creator');
        if (!planCreator) {
            return res.status(404).json({ message: "Professional not found" });
        }

        const newRatings = new Ratings();
        const ratingsId = newRatings._id;
        
        let rout = {};
        for(let i=0;i<routine.length;i++){
            rout[routine[i]["day"]] = routine[i]["meals"];
        }

        const newPlan = new MealPlan({
            title,
            description,
            tags,
            creator: creatorId,
            cost,
            ratings: ratingsId,
            Monday: rout['Monday'],
            Tuesday: rout['Tuesday'],
            Wednesday: rout['Wednesday'],
            Thursday: rout['Thursday'],
            Friday: rout['Friday'],
            Saturday: rout['Saturday'],
            Sunday: rout['Sunday']
        });

        const savedPlan = await newPlan.save();
        await newRatings.save();
        
        planCreator.mealPlanAssociated.push(savedPlan._id);
        await planCreator.save();

        console.log(`Plan created`);
        res.status(201).json(savedPlan);
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

const recommend = (req,res,next) => {

    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }

    const { exe, meal, profesh } = User.find({ userId: userId }).select('exercisePlansOwned mealPlansOwned Subscribing');
    let recTags = exe['tags']+meal['tags'];

    const execTags = ExercisePlan.find({tags: {$in: recTags}}); 
    const execProfesh =  ExercisePlan.find({creator: {$in: profesh}});
    const recExecPlans = execTags.concat(execProfesh.filter(item => !execTags.includes(item)));

    const mealTags = MealPlan.find({tags: {$in: recTags}}); 
    const mealProfesh = MealPlan.find({creator: {$in: profesh}});
    const recMealPlans = mealTags.concat(mealProfesh.filter(item => !mealTags.includes(item)));
     
    const vidsTags = AsyncVideo.find({tags: {$in: recTags}});
    const vidsProfesh = AsyncVideo.find({creator: {$in: profesh}});
    const recVids = vidsTags.concat(vidsProfesh.filter(item => !vidsProfesh.includes(item)));
};

const wLoss = (quantity, days, tagFamilies) => {
    
    let pWeek = (7*quantity)/days;
    if(pWeek <= 2){
        tagFamilies.push('fastWeightLoss');
        tagFamilies.push('bigCalorieDeficit');
        tagFamilies.push('intenseCardio');
    }else{
        tagFamilies.push('weightLoss');
        tagFamilies.push('calorieDeficit');
        tagFamilies.push('cardio');
    }
    return tagFamilies;
};

const wGain = (quantity, days, tagFamilies) => {
    
    tagFamilies.push('weights');
    tagFamilies.push('muscleGain');
    let pWeek = (7*quantity)/days;
    if(pWeek <= 2){
        tagFamilies.push('calorieSurplus');
    }else{
        tagFamilies.push('bigCalorieSurplus')
    }

    return tagFamilies;
};
const goalRecommend = (req, res, next) => {
    const { goal, quantity, days, userId} = req.body;

    const {height, weight} = User.find({userId: userId}).select('height weight');
    let bmi = (weight/(height*height))*703;

    let tagFamilies = [];
    if(goal === 'Loose Weight'){
        tagFamilies = wLoss(quantity, days, tagFamilies);
    }else if(goal === 'Gain Muscle'){
        tagFamilies = wGain(quantity, days, tagFamilies);
    }else if(goal === 'Get Healthy'){
        if(bmi <= 18.5){
            tagFamilies = wGain(2,7,tagFamilies);
        }else if(bmi > 18.5 && bmi < 25){
            tagFamilies.push('cardio');
            tagFamilies.push('weights');
            tagFamilies.push('maintain');
        }else{
            tagFamilies = wLoss(2,7,tagFamilies);
        }
    }

    recTags = Tags.find({family: {$in: tagFamilies}});

    const recExecPlans = ExercisePlan.find({tags: {$in: recTags}});
    const recMealPlans = MealPlan.find({tags: {$in: recTags}});
    const recVids = AsyncVideo.find({tags: {$in: recTags}});
}

module.exports = {createVideo, createLiveSession, recommend, createExercisePlan, createMealPlan, goalRecommend};