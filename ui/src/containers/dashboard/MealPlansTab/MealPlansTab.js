import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MealPlansSearch.css';
import RatingsComponent from "../RatingsButtons/RatingsComponent"
const MealPlansSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mealPlans, setMealPlans] = useState([]);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchAllMealPlans();
    }, []);

    const fetchAllMealPlans = async () => {
        try {
            const response = await axios.get('/api/v1/search/allMealPlans');
            setMealPlans(response.data);
        } catch (error) {
            console.error('Error fetching meal plans', error);
            setError('Error Fetching Meal Plans!');
        }
    };

    const loadSuggestions = async () => {
        if (searchTerm.length > 0) {
            try {
                const response = await axios.get(`/api/v1/search/autocomplete/mealplans?prefix=${searchTerm}`);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error loading meal plan suggestions', error);
                setError('Error loading suggestions.');
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        loadSuggestions();
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        setError('');
        try {
            const response = await axios.get(`/api/v1/search/mealPlans?searchTerm=${searchTerm}`);
            setMealPlans(response.data);
            if (response.data.length === 0) {
                setError('No meal plans found.');
            }
        } catch (error) {
            console.error('Error searching for meal plans', error);
            setError('Error Searching for Meal Plans!');
        }
    };

    return (
        <div className="mealPlans-search-wrapper">
            <h1>Search Meal Plans</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="searchInput"
                    placeholder="Search meal plans..."
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
            {error && <div className="error-message">{error}</div>}
            <div className="mealPlans-container">
                {mealPlans.map((mealPlan, index) => (
                    <div key={index} className="mealPlan-card">
                        <p className="mealPlan-title">{mealPlan.title}</p>
                        <p className="mealPlan-creator">By: {mealPlan.creator.firstName} {mealPlan.creator.lastName}</p>
                        <p className="mealPlan-description">{mealPlan.description}</p>
                        <p className="mealPlan-cost">${mealPlan.cost}</p>
                        <div className="Ratings"><RatingsComponent ratings={mealPlan.ratings}/></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MealPlansSearch;