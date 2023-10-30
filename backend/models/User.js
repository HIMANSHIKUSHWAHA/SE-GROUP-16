const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//add role specific data points if required later
const userSchema = new mongoose.Schema({
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
    // TODO change the fields back to required
    height: {
        type: Number,
        // Required if role is 'customer'
        // required: function () { return this.role === 'client'; }
        required: false,
    },
    weight: {
        type: Number,
        // Required if role is 'customer'
        // required: function () { return this.role === 'client'; }
        required: false,
    },
    specialization: {
        type: String,
        // Required if role is 'professional'
        // required: function () { return this.role === 'professional'; }
        required: false,
    },
    //fields required for password reset.
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
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
    Subscribers: {
        type: Array, //array of user ids(email as id)
        default: []
    },
    Subscribing: {
        type: Array, //array of user ids(amail as id)
        default: []
    },
    ContentCreated: {
        type: Array, //array of content ids
        default: [],
        // Required if role is 'professional'
        required: function () { return this.role === 'professional'; }
    },
    ContentEnrolled: {
        type: Array, //array of {content ids,progress metrics}
        default: []
    },
    LiveSessionCreated: {
        type: Array, //array of session ids
        default: [],
        // Required if role is 'professional'
        required: function () { return this.role === 'professional'; }
    },
    LiveSessionEnrolled: {
        type: Array, //array of session ids
        default: []
    },
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