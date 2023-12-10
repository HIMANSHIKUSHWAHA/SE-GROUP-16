import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Box, TextField, Button, List, ListItem, Typography, Collapse, Grid, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import RatingsComponent from "../RatingsButtons/RatingsComponent";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TodayIcon from '@mui/icons-material/Today';


const ExpandableExerciseCard = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [openDay, setOpenDay] = useState(null);
    const { plan } = props;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDayClick = (day) => {
        setOpenDay(openDay === day ? null : day);
    };

    const renderExerciseSummary = (exercises) => (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Total Exercises: {exercises.length}
        </Typography>
    );

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Accordion expanded={expanded} onChange={handleExpandClick} sx={{ border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    <CardContent sx={{ height: '150px', overflow: 'hidden' }}> {/* Fixed height and overflow handling */}
                        <Typography variant="h5" component="h2" noWrap>
                            {props.plan.title}
                        </Typography>
                        <Typography color="textSecondary" sx={{ overflow: 'auto' }}>
                            {props.plan.description}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {plan.ratings && <RatingsComponent ratings={plan.ratings} />}
                        </Typography>
                    </CardContent>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                    <Typography variant="body1">Difficulty Level: {plan.difficulty_level}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Tags: {plan.tags.join(', ')}
                    </Typography>
                    {Object.entries(plan).filter(([key, _]) => key.includes('day')).map(([day, data]) => (
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
                            {renderExerciseSummary(data.exercises)}
                            <Collapse in={openDay === day}>
                                {data.exercises.map((exercise, index) => (
                                    <div key={index}>
                                        <Typography variant="body2">Title: {exercise.title}</Typography>
                                        <Typography variant="body2">Reps: {exercise.reps}</Typography>
                                        <Typography variant="body2">Sets: {exercise.sets}</Typography>
                                        {/* Add more details as needed */}
                                    </div>
                                ))}
                            </Collapse>
                        </div>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};


const ExerciseCard = (props) => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={props.index}>
            <Card sx={{ border: '1px solid #ddd', borderRadius: '4px', height: '100%' }}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {props.plan.title}
                    </Typography>
                    <Typography color="textSecondary">
                        {props.plan.description}
                    </Typography>
                    {/* Add other details here if necessary */}
                </CardContent>
            </Card>
        </Grid>
    )
};

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
        <div className="exercise-plan-search-wrapper"> {/* Ensuring outer wrapper consistency */}
            <Box display="flex" alignItems="center" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', mb: 4 }}>
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
            <Box display="flex" alignItems="center" gap={2} marginBottom={2} position="relative">
                <TextField
                    label="Search by plan name, difficulty level, etc..."
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
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Grid container spacing={2} alignItems="stretch"> {/* This will ensure that all items stretch to fill the container */}
                {results.map((plan, index) => (
                    <ExpandableExerciseCard plan={plan} key={index} />
                ))}
            </Grid>
        </div>
    );
};

export { ExercisePlanSearch, ExerciseCard, ExpandableExerciseCard };