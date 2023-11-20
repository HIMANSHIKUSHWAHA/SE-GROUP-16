import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPreview from './../videoEmbeds';
import './videoSearchTab.css';
const VideoSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchAllVideos();
    }, []);

    useEffect(() => {
        loadSuggestions();
    }, [searchTerm]);

    const loadSuggestions = async () => {
        if (searchTerm.length > 0) {
            try {
                const response = await axios.get(`/api/v1/search/autocomplete/title?prefix=${searchTerm}`);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error loading title suggestions', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (title) => {
        setSearchTerm(title);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const fetchAllVideos = async () => {
        try {
            const response = await axios.get('/api/v1/search/allvideos');
            setResults(response.data);
        } catch (error) {
            setErrorMessage('An error occurred while fetching videos.');
            console.error('Fetch all videos error', error);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        setErrorMessage('');
        try {
            const response = await axios.get('/api/v1/search/videos', { params: { searchTerm } });
            setResults(response.data);
            if (response.data.length === 0) {
                setErrorMessage('No videos found.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while searching for videos.');
            console.error('Search error', error);
        }
    };
    return (
        <div>
            <h1>Search Videos</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="searchInput"
                    placeholder="Search by title, tags, description..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    autoComplete="off"
                />
                <button className="searchButton" onClick={handleSearch}>Search</button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-container">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)} className="suggestion-item">
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div>
                {results.map((result, index) => (
                    <div key={index} className="video-result-container">
                        <div className="video-title">{result.title}</div>
                        <div className="video-preview">
                            <VideoPreview link={result.link} />
                        </div>
                        <div className="video-description">{result.description}</div>
                        <div className="video-tags">Tags: {result.tags}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoSearch;