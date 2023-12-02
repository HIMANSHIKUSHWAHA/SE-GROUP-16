import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LiveSessions.css'
const LiveSessionSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchAllLiveSessions();
    }, []);

    useEffect(() => {
        loadSuggestions();
    }, [searchTerm]);

    const loadSuggestions = async () => {
        if (searchTerm.length > 0) {
            try {
                const response = await axios.get(`/api/v1/search/autocomplete/livesessions?prefix=${searchTerm}`);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error loading live session suggestions', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (sessionName) => {
        setSearchTerm(sessionName);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const fetchAllLiveSessions = async () => {
        try {
            const response = await axios.get('/api/v1/search/allLiveSessions');
            setResults(response.data);
        } catch (error) {
            setErrorMessage('An error occurred while fetching live sessions.');
            console.error('Fetch all live sessions error', error);
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
            const response = await axios.get('/api/v1/search/livesessions', {params: {searchTerm}});
            setResults(response.data);
            if (response.data.length === 0) {
                setErrorMessage('No live sessions found.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while searching for live sessions.');
            console.error('Search error', error);
        }
    };

    return (
        <div>
            <h1>Search Live Sessions</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="searchInput"
                    placeholder="Search by session name, topic, etc..."
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
            <div className="results-container"> {/* This div wraps the session results in a flex container */}
                {results.map((session, index) => (
                    <div key={index} className="session-result-container">
                        <div className="session-title">{session.title}</div>
                        <div className="creator">By: {session.creator.firstName} {session.creator.lastName}</div>
                        {/* Use session-title for title */}
                        <div className="session-description">{session.description}</div>
                        {/* Use session-description for description */}
                        <div className="session-date">{session.date}</div>
                        {/* Add any other session details here */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveSessionSearch;