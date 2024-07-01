import React, { useState } from 'react';
import { Button, Container, Grid, Paper, Typography, Snackbar } from '@mui/material';
import Header from "./header";

export default function AdminPage() {
    // List of YouTube video IDs
    const videoIDs = ["04kAfDdqEfg", "p-8WBLBrG4k", "3PMrt-1WDaI", "EKUNGQ4LmH8"];

    // State to track the current video index and notification
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [notification, setNotification] = useState('');

    // Function to go to the next video with a 2-second delay
    const goToNextVideo = () => {
        if (currentVideoIndex < videoIDs.length - 1) {
            setTimeout(() => {
                setCurrentVideoIndex(currentVideoIndex + 1);
                setNotification('');
            }, 1000); // 1 second delay
        } else {
            console.log('End of video list');
            // Handle end of list scenario
        }
    };

    // Function to handle 'Approve' and 'Cancel' button clicks
    const handleButtonClick = (action) => {
        console.log(`${action}:`, videoIDs[currentVideoIndex]);
        setNotification(`Video ${action}`);
        goToNextVideo();
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ height: '100vh', paddingTop: 8 }}>
            <Header auth={false} />
            <Grid container justifyContent="center" style={{ height: '100%' }}>
                <Grid item xs={12} lg={10}>
                    <Paper elevation={6} sx={{ padding: 4 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Admin Video Approval
                        </Typography>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            {notification ? (
                                <Typography variant="h6">Loading Next Video...</Typography>
                            ) : (
                                <iframe
                                    width="560"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${videoIDs[currentVideoIndex]}?autoplay=0&enablejsapi=1`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    title="Video for Approval"
                                ></iframe>
                            )}
                        </div>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={() => handleButtonClick('Approved')}>
                                    Approve
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="secondary" onClick={() => handleButtonClick('Cancelled')}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                open={!!notification}
                message={notification}
                autoHideDuration={2000}
                sx={{
                    // Centering the snackbar
                    bottom: { md: '50%' },
                    left: { md: '50%' },
                    transform: { md: 'translate(-50%, 50%)' },
                    // Adjusting the size
                    '& .MuiSnackbarContent-root': {
                        fontSize: '1.25rem', // larger font size
                        padding: 2, // larger padding
                    },
                }}
            />
        </Container>
    );
}
