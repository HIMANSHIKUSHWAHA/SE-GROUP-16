import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [passErr, setPassErr] = useState(null);
    const [nav, setNav] = useState(null);

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'himanshi@iu.edu';
    const ADMIN_PASSWORD = 'himanshi';

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
        // Reset error when the user starts typing again
        setPassErr(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Check if entered credentials match the hardcoded admin credentials
        if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
            // Credentials are correct, redirect to admin dashboard
            setNav('/admin-dashboard');
        } else {
            // Credentials are incorrect, show error message
            setPassErr('Incorrect email or password.');
        }
    };

    if (nav) {
        return <Navigate to={nav} replace />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url("/images/venti-views-I1EWTM5mFEM-unsplash.jpg")',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Content on top of background image could go here */}
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <FitnessCenterIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Admin Login
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!passErr}
                                helperText={passErr && 'Incorrect email'}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={!!passErr}
                                helperText={passErr && 'Incorrect password'}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
