import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './professionalSearchTab.css';

const ProfessionalSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [quickMessages, setQuickMessages] = useState({});
    const currentUserId = localStorage.getItem('UserId');

    useEffect(() => {
        fetchAllProfessionals();
    }, []);

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
        loadSuggestions();
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

    const handleQuickMessageChange = (professionalId, message) => {
        setQuickMessages(prevMessages => ({
            ...prevMessages,
            [professionalId]: message
        }));
    };

    const handleQuickMessage = async (professionalId) => {
        const messageContent = quickMessages[professionalId];

        if (!messageContent || messageContent.trim() === '') {
            console.error('Error: Message content is empty');
            return;
        }

        try {
            const response = await axios.post('/api/v1/messages/sendMessage', {
                messagingSenderId: currentUserId,
                messagingRecipientId: professionalId,
                content: messageContent
            });
            console.log('Quick message sent:', response.data);
            handleQuickMessageChange(professionalId, ''); // Clear the message input after sending
        } catch (error) {
            console.error('Error sending quick message:', error);
        }
    };

    return (
        <div>
            <h1>Search Professionals</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="searchInput"
                    placeholder="Search by name, specialization, etc..."
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
            <div className="professional-results-container">
                {results.map((professional, index) => (
                    <div key={index} className="professional-result-container">
                        <div className="professional-firstname">{professional.firstName}</div>
                        <div className="professional-lastname">{professional.lastName}</div>
                        <div className="professional-specialization">{professional.specialization}</div>
                        <input
                            type="text"
                            value={quickMessages[professional._id] || ''}
                            onChange={(e) => handleQuickMessageChange(professional._id, e.target.value)}
                            placeholder="Type your quick message here"
                            className="quick-message-input"
                        />
                        <button onClick={() => handleQuickMessage(professional._id)} className="quick-message-button">
                            Quick Message
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfessionalSearch;