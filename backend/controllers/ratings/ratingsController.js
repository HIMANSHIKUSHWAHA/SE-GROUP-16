const Ratings = require('../../models/Ratings');

// Function to update or replace the rating
exports.updateRating = async (req, res) => {
    try {
        const { ratingsId, rating } = req.body;
        const { userId } = req.body;

        // Validate the rating
        if (!['like', 'dislike'].includes(rating)) {
            return res.status(400).send('Invalid rating value. Must be "like" or "dislike".');
        }

        // Find the Ratings document by its ID
        console.log('searching for ratings id: ' + ratingsId + ' with rating ' + rating);
        let ratingsDoc = await Ratings.findById(ratingsId);
        if (!ratingsDoc) {
            return res.status(404).send('Ratings document not found.');
        }

        // Update or replace the rating
        ratingsDoc.ratings.set(userId.toString(), rating);

        // Update likes and dislikes count
        ratingsDoc.updateLikesDislikesCount();

        // Save the updated document
        await ratingsDoc.save();

        res.status(200).send('Rating updated successfully.');
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getRating = async (req, res) => {
    try {
        const { ratingsId } = req.params; // Assuming you're passing the ratingsId as a URL parameter
        const userId = req.headers.userid;
        console.log('Received ratingsId:', ratingsId); // Log the received ratingsId

        const ratingsDoc = await Ratings.findById(ratingsId);
        console.log('Fetched Ratings Document:', ratingsDoc); // Log the fetched document

        if (!ratingsDoc) {
            console.log('No ratings document found for ID:', ratingsId);
            return res.status(404).send('Ratings document not found.');
        }

        // Extract likes and dislikes count
        const likesCount = ratingsDoc.likesCount;
        const dislikesCount = ratingsDoc.dislikesCount;
        console.log('Likes Count:', likesCount, 'Dislikes Count:', dislikesCount); // Log the counts

        // Check if userId is available and log it
        let currentRating = null;
        if (userId) {
            console.log('User ID from request:', userId);
            currentRating = ratingsDoc.ratings.get(userId.toString());
            console.log('Current Rating for User:', currentRating); // Log the current rating for the user
        } else {
            console.log('No User ID provided in request');
        }

        res.status(200).json({
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            currentRating: currentRating
        });
    } catch (error) {
        console.error('Error fetching rating:', error);
        res.status(500).send('Internal Server Error');
    }
};