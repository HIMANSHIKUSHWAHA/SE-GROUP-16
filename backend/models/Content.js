const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description : {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrollers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    calories: {
        type: Number,
        required: true
    },
    contentType: {
        type: String,
        required: true,
        enum: ['video', 'liveSession', 'plan']
    },
    videoLink: {
        type: String,
        // Required if contentType is 'video'
        required: function() { return this.contentType === 'video'; }
    },
    liveSession: {
        startTime: {
            type: Date,
            // Required if contentType is 'liveSession'
            required: function() { return this.contentType === 'liveSession'; }
        },
        endTime: {
            type: Date,
            // Required if contentType is 'liveSession'
            required: function() { return this.contentType === 'liveSession'; }
        }
    },
    plan: {
        sets: [{
            type: String
        }]
    },
    
    reviews: [{
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Content', contentSchema);
