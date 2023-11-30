import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExercisePlan.css';

const ExercisePlanSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchAllExercisePlans();
    }, []);

    useEffect(() => {
        loadSuggestions();
    }, [searchTerm]);

    const loadSuggestions = async () => {
        if (searchTerm.length > 0) {
            try {
                const response = await axios.get(`/api/v1/search/autocomplete/exerciseplans?prefix=${searchTerm}`);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error loading exercise plan suggestions', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (planName) => {
        setSearchTerm(planName);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const fetchAllExercisePlans = async () => {
        try {
            const response = await axios.get('/api/v1/search/allExercisePlans');
            setResults(response.data);
        } catch (error) {
            setErrorMessage('An error occurred while fetching exercise plans.');
            console.error('Fetch all exercise plans error', error);
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
            const response = await axios.get('/api/v1/search/exercisePlans', { params: { searchTerm } });
            setResults(response.data);
            if (response.data.length === 0) {
                setErrorMessage('No exercise plans found.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while searching for exercise plans.');
            console.error('Search error', error);
        }
    };

    return (
        <div>
            <h1>Search Workout Plans</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="searchInput"
                    placeholder="Search by plan name, difficulty level, etc..."
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
            <div className="exercise-plan-results-container">
                {results.map((plan, index) => (
                    <div key={index} className="exercise-plan-result-container">
                        <div className="exercise-plan-title">{plan.title}</div>
                        <div className="exercise-plan-description">{plan.description}</div>
                        {/* Add other details here if necessary */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExercisePlanSearch;