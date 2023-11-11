const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

//TODO update
//add role specific data points if required later
const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['client', 'professional', 'admin']
    },
    height: {
        type: Number,
        // Required if role is 'customer'
        required: false,
    },
    weight: {
        type: Number,
        // Required if role is 'customer'
        required: false,
    },
    //fields required for password reset.
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetPasswordExpires: {
        type: Date,
        select: false,
    },
    // key should not be sent with every response
    twoFASecret: {
        type: String,
        select: false
    },
    // Set to false initially, and update it to true once the user sets up 2FA
    twoFAEnabled: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    Subscribing: [{
        type: Schema.Types.ObjectId,
        ref: 'Professional', // Linking to the Professional model
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
        ref: 'LiveSession', // Linking to the LiveSession model
        select: false
    }],
});

//hashing and salting function using middleware
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//used in login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);