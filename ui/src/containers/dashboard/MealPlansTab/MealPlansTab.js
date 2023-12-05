import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Grid, Paper, Box, TextField, Button, List, ListItem, Card, CardContent, Typography } from '@mui/material';
// import './MealPlansSearch.css';
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
            <Box display="flex" alignItems="center" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', mb: 4 }}>
                <RestaurantMenuIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, marginRight: 1 }} />
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Search Meal Plans
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} marginBottom={2} position="relative">
                <TextField
                    label="Search meal plans..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleInputChange}
                    sx={{ flexGrow: 1, maxWidth: '70%' }} // Adjust width as needed
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
            {error && <Typography color="error">{error}</Typography>}
            <Grid container spacing={2}>
                {mealPlans.map((mealPlan, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card sx={{ border: '1px solid #ddd', borderRadius: '4px', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {mealPlan.title}
                                </Typography>
                                <Typography color="textSecondary">
                                    {mealPlan.description}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {mealPlan.cost}
                                </Typography>
                                <Typography color="textSecondary">
                                    {/* By: {mealPlan.creator.firstName} {mealPlan.creator.lastName} */}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};
export default MealPlansSearch;