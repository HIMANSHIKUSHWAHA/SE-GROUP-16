import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './ExercisePlan.css';
import { Paper, Box, TextField, Button, List, ListItem, Typography, Grid, Card, CardContent } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

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
        <Box sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <FitnessCenterIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, marginRight: 1 }} />
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Search Workout Plans
                </Typography>
            </Box>
            <Box position="relative" display="flex" alignItems="center" gap={2} marginBottom={2} width="auto">
                <TextField
                    label="Search by plan name, difficulty level, etc..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleInputChange}
                    sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: '70%' } }}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
                {showSuggestions && suggestions.length > 0 && (
                    <Paper elevation={2} style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2 }}>
                        <List>
                            {suggestions.map((suggestion, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>

            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Grid container spacing={2}>
                {results.map((plan, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card sx={{ border: '1px solid #ddd', borderRadius: '4px', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {plan.title}
                                </Typography>
                                <Typography color="textSecondary">
                                    {plan.description}
                                </Typography>
                                {/* Add other details here if necessary */}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ExercisePlanSearch;