import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../../../context";
import ThumbUpIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDownAlt';

const RatingsComponent = ({ ratings }) => {
    console.log('RatingsComponent Ratings:', ratings);
    const [currentRating, setCurrentRating] = useState(null);
    const [likesCount, setLikesCount] = useState(ratings.likesCount);
    const [dislikesCount, setDislikesCount] = useState(ratings.dislikesCount);
    const { user } = useContext(UserContext);

    const handleRating = async (newRating) => {
        if (!user || !user.id) {
            return; // Exit if user ID is missing
        }

        try {
            await axios.post('/api/v1/ratings/updateRating', {
                ratingsId: ratings._id,
                rating: newRating,
                userId: user.id
            });

            // Fetch updated counts
            const updatedRatings = await axios.get(`/api/v1/ratings/${ratings._id}`, {
               headers: {
                   'userId': user.id
               }
            });
            setCurrentRating(updatedRatings.data.currentRating);
            setLikesCount(updatedRatings.data.likesCount);
            setDislikesCount(updatedRatings.data.dislikesCount);
        } catch (error) {
            console.error('Error updating and fetching rating:', error);
        }
    };

    return (
        <div>
            <button
                onClick={() => handleRating('like')}
                style={{ color: currentRating === 'like' ? 'green' : 'grey' }}>
                <ThumbUpIcon />
            </button>
            <span>{likesCount}</span>
            <button
                onClick={() => handleRating('dislike')}
                style={{ color: currentRating === 'dislike' ? 'red' : 'grey' }}>
                <ThumbDownIcon />
            </button>
            <span>{dislikesCount}</span>
        </div>
    );
};

export default RatingsComponent;