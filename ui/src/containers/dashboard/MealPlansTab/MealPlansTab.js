import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Grid, Paper, Box, TextField, Collapse, Button, List, ListItem, Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
// import './MealPlansSearch.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TodayIcon from '@mui/icons-material/Today';
import RatingsComponent from "../RatingsButtons/RatingsComponent";

const ExpandableMealCard = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [openDay, setOpenDay] = useState(null);
    const { mealPlan } = props;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDayClick = (day) => {
        setOpenDay(openDay === day ? null : day);
    };

    const renderMeal = (meal, mealName) => (
        <div key={mealName}>
            <Typography variant="subtitle2">{mealName.toUpperCase()}</Typography>
            <Typography variant="body2">Calories: {meal.calories}</Typography>
            <Typography variant="body2">Carbs: {meal.carbs}g</Typography>
            <Typography variant="body2">Fats: {meal.fats}g</Typography>
            <Typography variant="body2">Proteins: {meal.proteins}g</Typography>
            <Typography variant="body2">Items: {meal.mealItems.join(', ')}</Typography>
        </div>
    );

    const renderDaySummary = (dayData) => {
        return (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Calories: {dayData.calories} kcal, Proteins: {dayData.proteins}g, Carbs: {dayData.carbs}g, Fats: {dayData.fats}g
            </Typography>
        );
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Accordion expanded={expanded} onChange={handleExpandClick} sx={{ border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    <CardContent sx={{ height: '150px', overflow: 'hidden' }}>
                        <Typography variant="h5" component="h2" noWrap>
                            {mealPlan.title}
                        </Typography>
                        <Typography color="textSecondary" sx={{ overflow: 'auto' }}>
                            {mealPlan.description}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {mealPlan.ratings && <RatingsComponent ratings={mealPlan.ratings} />}
                        </Typography>
                    </CardContent>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                    <Typography variant="body1">Cost: {mealPlan.cost}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Tags: {mealPlan.tags.join(', ')}
                    </Typography>
                    {Object.entries(mealPlan).filter(([key, _]) => key.includes('day')).map(([day, data]) => (
                        <div key={day}>
                            <Button
                                startIcon={<TodayIcon />}
                                onClick={() => handleDayClick(day)}
                                sx={{ mt: 2, mb: 1, justifyContent: 'flex-start', textTransform: 'none' }}
                                fullWidth
                            >
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                    {day}
                                </Typography>
                            </Button>
                            {renderDaySummary(data)}
                            <Collapse in={openDay === day}>
                                {renderMeal(data.breakfast, 'Breakfast')}
                                {renderMeal(data.lunch, 'Lunch')}
                                {renderMeal(data.dinner, 'Dinner')}
                            </Collapse>
                        </div>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};

const MealCard = (props) => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={props.index}>
            <Card sx={{ border: '1px solid #ddd', borderRadius: '4px', height: '100%' }}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {props.mealPlan.title}
                    </Typography>
                    <Typography color="textSecondary">
                        {props.mealPlan.description}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.mealPlan.cost}
                    </Typography>
                    <Typography color="textSecondary">
                        {/* By: {mealPlan.creator.firstName} {mealPlan.creator.lastName} */}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Tags: {props.mealPlan.tags.join(', ')}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        <RatingsComponent ratings={props.mealPlan.ratings} />
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
};

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
                    <ExpandableMealCard mealPlan={mealPlan} index={index} />
                ))}
            </Grid>
        </div>
    );
};
export { MealPlansSearch, MealCard, ExpandableMealCard };