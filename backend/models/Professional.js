const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const professionalSchema = new Schema({
    firstName: {
        type: String,
        select: true,
        required: true,
    },
    lastName: {
        type: String,
        select: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: true,
    },
    specialization: {
        type: String,
        required: true,
        select: true,
    },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetPasswordExpires: {
        type: Date,
        select: false,
    },
    twoFASecret: {
        type: String,
        select: false
    },
    twoFAEnabled: {
        type: Boolean,
        default: false,
        select: false
    },
    otp: {
        type: String,
        select: true
    },
    otpExpires: {
        type: Date,
        select: true
    },
    Subscribers: [{
        type: Schema.Types.ObjectId,
        select: true,
        ref: 'User'
    }],
    Subscribing: [{
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        select: true
    }],
    asyncVideosAssociated: [{
        type: Schema.Types.ObjectId,
        ref: 'AsyncVideo',
        select: false
    }],
    LiveSessionCreated: [{
        type: Schema.Types.ObjectId,
        ref: 'LiveSession',
        select: false
    }],
    mealPlansOwned: [{
        type: Schema.Types.ObjectId,
        ref: 'MealPlan', // Linking to the MealPlan model
        select: false
    }],
    exercisePlansOwned: [{
        type: Schema.Types.ObjectId,
        ref: 'ExercisePlan', // Linking to the ExercisePlan model
        select: false
    }],
    currentMealPlan: {
        type: Schema.Types.ObjectId,
        ref: 'MealPlan',
        select: false,
    },
    currentExercisePlan: {
        type: Schema.Types.ObjectId,
        ref: 'ExercisePlan',
        required: false
    },
    currentSleepPlan: {
        type: Schema.Types.ObjectId,
        ref: 'SleepPlan',
        required: false
    },
    LiveSessionEnrolled: [{
        type: Schema.Types.ObjectId,
        ref: 'LiveSession',
        select: false
    }],
});

professionalSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

professionalSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Professional', professionalSchema);