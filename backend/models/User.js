const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

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
    height: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
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
        ref: 'Professional',
    }],
    mealPlansOwned: [{
        type: Schema.Types.ObjectId,
        ref: 'Mealplan',
        select: false
    }],
    exercisePlansOwned: [{
        type: Schema.Types.ObjectId,
        ref: 'Exerciseplan',
        select: false
    }],
    currentMealPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Mealplan',
        select: false,
    },
    currentExercisePlan: {
        type: Schema.Types.ObjectId,
        ref: 'ExercisePlan',
        required: false
    },
    currentSleepPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Sleepplan',
        required: false
    },
    LiveSessionEnrolled: [{
        type: Schema.Types.ObjectId,
        ref: 'LiveSession',
        select: false
    }],
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        bcrypt.hash(this.password, 12, (err, hash) => {
            if (err) {
                return next(err);
            }
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);