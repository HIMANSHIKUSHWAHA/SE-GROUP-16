import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, TextField, Button, List, ListItem, Typography, Grid, Card, CardContent, Paper } from '@mui/material';
import { UserContext } from '../../../context';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { postReq } from '../../../services/api';

const LiveSessionSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { user } = useContext(UserContext);

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
            const userId = user.id; // Assuming 'user.id' contains the current user's ID
            const params = { userId };
            const response = await axios.get('/api/v1/search/allLiveSessions', { params });
            setResults(response.data);
        } catch (error) {
            setErrorMessage('An error occurred while fetching live sessions.');
            console.error('Fetch all live sessions error', error);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEnroll = async (sessionId) => {
        try {
            console.log("FRONTEND SEsSION ID IS ", sessionId)
            const headers = {};
            const postData = {
                userId: user.id,
                eventId: sessionId
            };

            const response = await postReq('/live-session/enroll', headers, postData);

            if (response.status === 200) {
                // Enrollment was successful
                console.log('Successfully enrolled in the session');

                // Re-fetch live sessions to update the UI
                await fetchAllLiveSessions();
            } else {
                // Handle other statuses or errors
                console.error('Failed to enroll in session:', response.status);
            }
        } catch (error) {
            console.error('Error during enrollment:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        setErrorMessage('');
        try {
            const response = await axios.get('/api/v1/search/livesessions', { params: { searchTerm } });
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
        <Box sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', mb: 4 }}>
                <EventAvailableIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mr: 1 }} />
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Search Live Sessions
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} mb={4} position="relative">
                <TextField
                    type="text"
                    variant="outlined"
                    placeholder="Search by session name, topic, etc..."
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

            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Grid container spacing={2}>
                {results.map((session, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card sx={{ border: '1px solid #ddd', borderRadius: '4px', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    {session.title}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    By: {session.creator.firstName} {session.creator.lastName}
                                </Typography>
                                <Typography variant="body2">
                                    {session.description}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                    {session.date}
                                </Typography>
                                {session.isEnrolled ? (
                                    <Typography color="success" sx={{ mt: 2 }}>
                                        Enrolled
                                    </Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => handleEnroll(session._id)}
                                    >
                                        Enroll
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default LiveSessionSearch;