import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import VideoPreview from './../videoEmbeds';
import { Box, TextField, Button, List, ListItem, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {UserContext} from "../../../context";
import RatingsComponent from "../RatingsButtons/RatingsComponent";

const VideoCard = (props) => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={props.index}>
            <Card sx={{ border: '1px solid #ddd', borderRadius: '4px', height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {props.result.title}
                    </Typography>
                    {/* Assuming VideoPreview is a React component */}
                    <Box className="video-preview" sx={{ mb: 2 }}>
                        <VideoPreview link={props.result.link} />
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        {/* By: {result.creator.firstName} {result.creator.lastName} */}
                        By: {result.creator?.firstName||'null'} {result.creator?.lastName||'null'}
                    </Typography>
                    <Typography variant="body2">
                        {props.result.description}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Tags: {props.result.tags.join(', ')}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                       {props.result.ratings !== undefined && <RatingsComponent ratings={props.result.ratings} />} 
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

const VideoSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { user } = useContext(UserContext);
    console.log('User ID: ',user?.id);
    useEffect(() => {
        fetchAllVideos();
    }, []);

    useEffect(() => {
        loadSuggestions();
    }, [searchTerm]);

    //test 
    
    const loadSuggestions = async () => {
        if (searchTerm.length > 0) {
            try {
                const response = await axios.get(`/api/v1/search/autocomplete/video?prefix=${searchTerm}`);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error loading title suggestions', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (title) => {
        setSearchTerm(title);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const fetchAllVideos = async () => {
        try {
            const response = await axios.get('/api/v1/search/allvideos');
            setResults(response.data);
            console.log("/api/v1/search/allvideos Results: ", response.data);
        } catch (error) {
            setErrorMessage('An error occurred while fetching videos.');
            console.error('Fetch all videos error', error);
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
            const response = await axios.get('/api/v1/search/videos', { params: { searchTerm } });
            setResults(response.data);
            if (response.data.length === 0) {
                setErrorMessage('No videos found.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while searching for videos.');
            console.error('Search error', error);
        }
    };
    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', mb: 4 }}>
                <PlayCircleOutlineIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mr: 1 }} />
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Search Videos
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} mb={4} position="relative">
                <TextField
                    type="text"
                    variant="outlined"
                    placeholder="Search by title, tags, description..."
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
                {results.map((result, index) => (
                    <VideoCard result={result} index={index}/>
                ))}
            </Grid>
        </Box>
    );
};

export {VideoSearch, VideoCard};