import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TitleAutocomplete = ({ searchParams, setSearchParams }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const loadSuggestions = async () => {
            if (searchParams.title.length > 0) {
                try {
                    const response = await axios.get(`/api/v1/search/autocomplete/title?prefix=${searchParams.title}`);
                    setSuggestions(response.data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error loading title suggestions', error);
                }
            }
        };

        loadSuggestions();
    }, [searchParams.title]);

    const handleSuggestionClick = (title) => {
        setSearchParams({ ...searchParams, title });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={searchParams.title}
                onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)} style={{ cursor: 'pointer' }}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TitleAutocomplete;