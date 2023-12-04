import React, { useState, useContext } from 'react';
import {
    Avatar, Button, CssBaseline, TextField, Link, Grid, Box,
    Typography, Container, Paper, createTheme, ThemeProvider, Alert
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import Header from '../header';
import { postReq } from '../../services/api';
import { UserContext } from '../../context';

const defaultTheme = createTheme();

export default function ScheduleSessionForm() {
    const [sessionDetails, setSessionDetails] = useState({
        topic: "",
        startTime: "",
        agenda: "",
        tags: ""
    });

    const [notification, setNotification] = useState({ show: false, message: "" });

    const { user } = useContext(UserContext);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSessionDetails({ ...sessionDetails, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const postData = {
            title: sessionDetails.topic,
            creatorId: user.id,
            description: sessionDetails.agenda,
            startTime: sessionDetails.startTime,
            tags: sessionDetails.tags.split(',')
        }

        const headers = {};
        try {
            const response = await postReq('/live-session/schedule', headers, postData);

            if (response.status === 201) {
                setNotification({ show: true, message: 'Live session scheduled successfully!' });
                setSessionDetails({ topic: "", startTime: "", agenda: "", tags: "" }); // Reset form
            } else {
                // Handle non-successful responses
                setNotification({ show: true, message: 'Failed to schedule the session.' });
            }
        } catch (error) {
            console.error("Error in post req to schedule live session ", error);
            setNotification({ show: true, message: 'Error scheduling the session.' });
        }
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Alert notification */}
                    {notification.show && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{notification.message}</Alert>}

                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <EventIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Schedule Live Session
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="topic"
                            label="Session Topic"
                            name="topic"
                            autoFocus
                            value={sessionDetails.topic}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="startTime"
                            label="Start Time"
                            type="datetime-local"
                            id="startTime"
                            value={sessionDetails.startTime}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="agenda"
                            label="Session Description"
                            multiline
                            rows={4}
                            id="agenda"
                            value={sessionDetails.agenda}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="tags"
                            label="Tags (comma-separated)"
                            id="tags"
                            value={sessionDetails.tags}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Schedule Session
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}


