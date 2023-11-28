const mongoose = require('mongoose');

const Tag = new mongoose.schema({
    tag: {
        type: String,
        required: true
    },
    family: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Tag', Tag);