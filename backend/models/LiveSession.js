const mongoose = require('mongoose');
const { Schema } = mongoose;
const LiveSession = new Schema({
    // ID of the creator
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.types.objectId,
        ref: 'Professional',
        select: false
    },
    // IDs of those attending the live session
    enrolled: [{
        type: Schema.types.objectId,
        ref: 'User',
        select: false
    }],
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('LiveSession', liveSessionSchema);