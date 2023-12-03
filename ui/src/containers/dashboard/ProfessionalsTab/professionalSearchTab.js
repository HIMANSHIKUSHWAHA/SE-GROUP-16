import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './professionalSearchTab.css';
import { Grid, Card, CardContent, Box, TextField, Button, List, ListItem, Typography, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
        <Box sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', mb: 4 }}>
                <SearchIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mr: 1 }} />
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Search Professionals
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} mb={4} position="relative">
                <TextField
                    type="text"
                    variant="outlined"
                    placeholder="Search by name, specialization, etc..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    autoComplete="off"
                    fullWidth
                    sx={{ flexGrow: 1, maxWidth: '70%' }}
                />
                <Button variant="contained" onClick={handleSearch}>Search</Button>
                {showSuggestions && suggestions.length > 0 && (
                    <Paper elevation={2} style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2 }}>
                        <List>
                            {suggestions.map((suggestion, index) => (
                                <ListItem key={index} button onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion}
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>

            {errorMessage && <Typography color="error">{errorMessage}}</Typography>}
            <Grid container spacing={2}>
                {results.map((professional, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card sx={{ border: '1px solid #ddd', borderRadius: '4px', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    {`${professional.firstName} ${professional.lastName}`}
                                </Typography>
                                <Typography sx={{ mb: 2 }}>{professional.specialization}</Typography>
                                <TextField
                                    type="text"
                                    value={quickMessages[professional._id] || ''}
                                    onChange={(e) => handleQuickMessageChange(professional._id, e.target.value)}
                                    placeholder="Type your quick message here"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }} // Added margin-bottom
                                />
                                <Box textAlign="center"> {/* Center the button */}
                                    <Button variant="contained" onClick={() => handleQuickMessage(professional._id)}>
                                        Quick Message
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProfessionalSearch;