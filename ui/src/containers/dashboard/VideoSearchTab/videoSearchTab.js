import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPreview from '../../../../../../SE-GROUP-16/ui/src/containers/dashboard/videoEmbeds';

const VideoSearch = () => {
    const [searchParams, setSearchParams] = useState({
        title: '',
        tags: '',
        description: '',
    });
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchAllVideos();
    }, []);

    const fetchAllVideos = async () => {
        try {
            const response = await axios.get('/search/allvideos');
            setResults(response.data);
            console.log(response);
        } catch (error) {
            setErrorMessage('An error occurred while fetching videos.');
            console.error('Fetch all videos error', error);
        }
    };

    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await axios.get('/search/searchvideos', { params: searchParams });
            if (response.data.length === 0) {
                setErrorMessage('No videos found.');
            } else {
                setResults(response.data);
            }
        } catch (error) {
            setErrorMessage('An error occurred while searching for videos.');
            console.error('Search error', error);
        }
    };

    return (
        <div>
            <h1>Video Search</h1>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={searchParams.title}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="tags"
                placeholder="Tags (comma-separated)"
                value={searchParams.tags} // This is where the error was, it should be {searchParams.tags}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={searchParams.description} // Ensure this is also within curly braces
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Search</button>

            {errorMessage && <div>{errorMessage}</div>}

            {results.map((result, index) => (
                <div key={index}>
                    <div>{result.title}</div>
                    <div>{result.description}</div>
                    <VideoPreview link={result.link} />
                    <button onClick={() => window.open(result.link, '_blank')}>Watch Video</button>
                </div>
            ))}
        </div>
    );
};

export default VideoSearch;