const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    ratings: {
        type: Map,
        of: String, // Store 'like' or 'dislike'
        keyType: String, // Assuming you're using strings for user reference
        default: {}
    },
    likesCount: {
        type: Number,
        default: 0
    },
    dislikesCount: {
        type: Number,
        default: 0
    }
});

// Add an instance method to update likes and dislikes count
ratingSchema.methods.updateLikesDislikesCount = function() {
    let likes = 0;
    let dislikes = 0;

    // Iterate over each rating in the map
    for (let value of this.ratings.values()) {
        if (value === 'like') {
            likes++;
        } else if (value === 'dislike') {
            dislikes++;
        }
    }

    // Update likes and dislikes count
    this.likesCount = likes;
    this.dislikesCount = dislikes;
};

const Ratings = mongoose.model('Ratings', ratingSchema);

module.exports = Ratings;