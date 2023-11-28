const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    ratings: {
        type: Map,
        of: Number,
        keyType: String,
        default: {}
    }
});

// Add an instance method to compute the average rating
ratingSchema.methods.getAverageRating = function() {
    let total = 0;
    let count = 0;

    // Iterate over each rating in the map and sum them up
    for (let value of this.ratings.values()) {
        total += value;
        count++;
    }

    // Return the average or 0 if there are no ratings
    return count === 0 ? 0 : total / count;
};

const Ratings = mongoose.model('Ratings', ratingSchema);

module.exports = Ratings;