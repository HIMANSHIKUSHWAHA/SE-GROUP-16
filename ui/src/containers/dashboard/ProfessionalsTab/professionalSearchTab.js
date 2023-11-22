import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './professionalSearchTab.css'

const ProfessionalSearch = () => { // Renamed
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchAllProfessionals(); // Renamed
    }, []);

    useEffect(() => {
        loadSuggestions();
    }, [searchTerm]);

    const loadSuggestions = async () => {
        if (searchTerm.length > 0) {
            try {
                const response = await axios.get(`/api/v1/search/autocomplete/professional?prefix=${searchTerm}`);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error loading name suggestions', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (name) => {
        setSearchTerm(name);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const fetchAllProfessionals = async () => {
        try {
            const response = await axios.get('/api/v1/search/allProfessionals');
            setResults(response.data);
        } catch (error) {
            setErrorMessage('An error occurred while fetching professionals.');
            console.error('Fetch all professionals error', error);
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
            const response = await axios.get('/api/v1/search/professionals', { params: { searchTerm } });
            setResults(response.data);
            if (response.data.length === 0) {
                setErrorMessage('No professionals found.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while searching for professionals.');
            console.error('Search error', error);
        }
    };
    return (
        <div>
            <h1>Search Professionals</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="searchInput"
                    placeholder="Search by name, specialization, etc..." // Updated placeholder
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
                    //we need to include a link to the professionals profile, quick message button.
                    <div key={index} className="professional-result-container">
                        <div className="professional-firstname">{result.firstName}</div>
                        <div className="professional-lastname">{result.lastName}</div>
                        <div className="professional-specialization">{result.specialization}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfessionalSearch;