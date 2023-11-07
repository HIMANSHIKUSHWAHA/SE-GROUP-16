const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const LiveSession = new Schema({
    // ID of the creator
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Professional',
        select: false
    },
    // IDs of those attending the live session
    enrolled: [{
        type: Schema.Types.ObjectId,
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

module.exports = mongoose.model('LiveSession', LiveSession);