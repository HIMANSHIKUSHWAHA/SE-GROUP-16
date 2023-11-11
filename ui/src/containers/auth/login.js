import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import validator from "validator";
import { postReq } from "../../services/api";
import { Navigate } from "react-router-dom";
import { setAuthenticationStat } from "../../services/auth";
import GoogleOAuth from "./oAuth";
import Paper from '@mui/material/Paper';
import { useUser, fetchAndSetUserDetails } from "../../context"
const defaultTheme = createTheme();

export default function Login(props) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [validEmail, setValidEmail] = useState(null);
    const [passErr, setPassErr] = useState(null);
    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value };
        });

        // Reset the validation states
        if (name === 'email') setValidEmail(null);
        if (name === 'password') setPassErr(null);
        setNav(null); // Reset navigation state
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        // Email validation
        if (!validator.isEmail(formData.email)) {
            setValidEmail("Not a valid email");
            return;
        }

        const headers = {};
        try {
            const response = await postReq("/auth/login", headers, formData);
            console.log("RESPONSESESESEE ", response);
            setFormData({
                email: "",
                password: ""
            });

            if (response.status === 200) { // Assuming 200 is the success code for authentication
                localStorage.setItem("token", response.data.tempToken);
                setAuthenticationStat(true);

                console.log('Redirecting to 2 Factor')
                setNav("/2fa");
            } else if (response.status === 401) { // Unauthorized or incorrect credentials
                console.log("Authentication failed!");
                setAuthenticationStat(false);
                setPassErr("Incorrect email or password");
            } else if (response.status === 404) { // User not found
                console.log("User not found!");
                setAuthenticationStat(false);
                setPassErr("User not found");
            } else {
                // Handle other statuses or general error message
                setAuthenticationStat(false);
                console.log("Unexpected status code: " + response.status);
                setPassErr("An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Login request failed:", error);
            setAuthenticationStat(false);
            setPassErr("Failed to connect. Please check your internet connection and try again.");
        }
    };

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
                        display: 'flex', // Added flex display to allow positioning of children
                        flexDirection: 'column', // Align children vertically
                        alignItems: 'center', // Center children horizontally
                        justifyContent: 'center', // Center children vertically
                    }}
                >
                    <Typography
                        variant="h1"
                        component="div"
                        sx={{
                            color: 'white',
                            fontSize: '4rem', // Adjust the font size as needed
                            fontWeight: 'bold', // Making the text bolder
                        }}
                    >
                        Welcome to FitFriend
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            color: 'white',
                            fontSize: '1.5rem', // Adjust the font size as needed
                            fontWeight: 'bold', // Making the text bolder
                        }}
                    >
                        Your Fitness Companion
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <FitnessCenterIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Login to FITFRIEND
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                                error={validEmail !== null}
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
                                error={passErr !== null}
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
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#"
                                        variant="body2"
                                        onClick={() => setNav("/reset-password")}
                                    >
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#"
                                        variant="body2"
                                        onClick={() => setNav("/signup")}
                                    >
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            {nav && <Navigate to={nav} />}
        </ThemeProvider>
    );
}