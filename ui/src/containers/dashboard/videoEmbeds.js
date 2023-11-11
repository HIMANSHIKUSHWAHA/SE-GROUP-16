import React from 'react';
import PropTypes from 'prop-types';
import './videoEmbeds.css';

const VideoPreview = ({ link }) => {
    const videoIdMatch = link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
    const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';

    return (
        <div className="video-preview">
            {videoId ? (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <img
                        className="thumbnail"
                        src={thumbnailUrl}
                        alt="Video Thumbnail"
                    />
                </a>
            ) : (
                <p>Video link is not valid or video ID could not be extracted.</p>
            )}
        </div>
    );
};

VideoPreview.propTypes = {
    link: PropTypes.string.isRequired
};

export default VideoPreview;