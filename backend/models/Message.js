const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['User', 'Professional']
    },
    recipient: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModelRecipient'
    },
    onModelRecipient: {
        type: String,
        required: true,
        enum: ['User', 'Professional']
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);