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
import validator from 'validator';
import { Navigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [validEmail, setValidEmail] = useState(null);
    const [passErr, setPassErr] = useState(null);
    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'email') setValidEmail(null);
        if (name === 'password') setPassErr(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validator.isEmail(formData.email)) {
            setValidEmail('Not a valid email');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch('http://localhost:3000/auth/admin-login', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                setNav('/admin-dashboard');
            } else {
                setPassErr(data.message || 'Incorrect email or password');
            }
        } catch (error) {
            console.error('Login request failed:', error);
            setPassErr('Failed to connect. Please check your internet connection and try again.');
        }
    };

    if (nav) {
        return <Navigate to={nav} replace />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                error={!!validEmail}
                                helperText={validEmail}
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
                                helperText={passErr}
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
