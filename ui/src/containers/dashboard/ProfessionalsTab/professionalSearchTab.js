import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './professionalSearchTab.css';
import { TextField, Button, List, ListItem, Typography, Box } from '@mui/material';

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
        <Box>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>Search Professionals</Typography>
            <Box className="search-container">
                <TextField
                    type="text"
                    variant="outlined"
                    placeholder="Search by name, specialization, etc..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    autoComplete="off"
                    fullWidth
                />
                <Button variant="contained" onClick={handleSearch}>Search</Button>
            </Box>
            {showSuggestions && suggestions.length > 0 && (
                <List className="suggestions-container">
                    {suggestions.map((suggestion, index) => (
                        <ListItem key={index} button onClick={() => handleSuggestionClick(suggestion)} className="suggestion-item">
                            {suggestion}
                        </ListItem>
                    ))}
                </List>
            )}

            {errorMessage && <Typography className="error-message">{errorMessage}</Typography>}
            <Box className="professional-results-container">
                {results.map((professional, index) => (
                    <Box key={index} className="professional-result-container">
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body1">
                                {`${professional.firstName} ${professional.lastName}`}
                            </Typography>
                        </Box>
                        <Typography className="professional-specialization">{professional.specialization}</Typography>
                        <TextField
                            type="text"
                            value={quickMessages[professional._id] || ''}
                            onChange={(e) => handleQuickMessageChange(professional._id, e.target.value)}
                            placeholder="Type your quick message here"
                            variant="outlined"
                            fullWidth
                        />
                        <Button variant="contained" onClick={() => handleQuickMessage(professional._id)}>
                            Quick Message
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ProfessionalSearch;