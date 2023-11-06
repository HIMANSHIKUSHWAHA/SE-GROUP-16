import React from 'react';
import PropTypes from 'prop-types';

const VideoPreview = ({ link }) => {
    // Ensure that you use an embeddable video URL
    const embeddableLink = link;

    return (
        <div className="video-preview">
            <iframe
                width="560" // You can use any width and height
                height="315"
                src={embeddableLink}
                title="Video Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

VideoPreview.propTypes = {
    link: PropTypes.string.isRequired
};

export default VideoPreview;