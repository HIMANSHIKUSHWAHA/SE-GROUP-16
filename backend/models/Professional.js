const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

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
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['client', 'professional', 'admin']
    },
    // TODO change the fields back to required
    specialization: {
        type: String,
        // Required if role is 'professional'
        required: false,
        select: false,
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
        default: false,
        select: false
    },
    otp: {
        type: String,
        select: false,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    Subscribers: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming the subscribers are users
        select: false
    }],
    asyncVideosAssociated: [{
        type: Schema.Types.ObjectId,
        // TODO update ref
        ref: 'AsyncVideo', // Name of your AsyncVideo model
        select: false
    }],
    LiveSessionCreated: [{
        // TODO update ref
        type: Schema.Types.ObjectId,
        ref: 'LiveSession', // Name of your LiveSession model
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