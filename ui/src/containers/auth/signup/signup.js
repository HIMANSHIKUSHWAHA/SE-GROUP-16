import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserSignup from './userSignup';
import ProfessionalSignup from './professionalSignup';
import Header from "../../header";
import validator from "validator";
import { postReq } from "../../../services/api";
import { Navigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Signup() {
    const [formData, setFormData] = useState({
        role: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [err, setErr] = useState({
        role: null,
        firstName: null,
        lastName: null,
        email: null,
        password: null
    });

    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value };
        });
        setErr({
            roleErr: null,
            validEmailErr: null,
            passStrengthErr: null,
            samePassErr: null
        });
        setNav(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.role === "") {
            setErr(prevErr => ({ ...prevErr, roleErr: "Please select a role" }));
            return;
        }

        if (!validator.isEmail(formData.email)) {
            setErr(prevErr => ({ ...prevErr, validEmailErr: "Not a valid email" }));
            return;
        }

        if (!validator.isStrongPassword(formData.password, {
            minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setErr(prevErr => ({
                ...prevErr,
                passStrengthErr: "Password should contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 numeric value, and 1 symbol"
            }));
            return;
        }

        if (formData.password !== formData.rePassword) {
            setErr(prevErr => ({ ...prevErr, samePassErr: "The passwords do not match" }));
            return;
        }

        // TODO: work on backend data models
        const headers = {};
        const response = await postReq("/auth/signup", headers, formData);
        console.log("RESPONSE IS FROM SIGNUP API- ", response);

        if (response.message === "User registered successfully") {
            setNav({
                pathname: "/otp-verification",
                state: { userId: response.userId }
            });
        } else if (response.message === "Email already in use") {
            setErr(prev => ({ ...prev, validEmailErr: "Email already in use" }));
        }
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Header />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5"> Sign Up </Typography>

                    {nav ? <Navigate to={nav.pathname} state={nav.state} /> :

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                {/* Role Selection */}
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        SelectProps={{ native: true, }}
                                        variant="outlined"
                                        error={!!err.roleErr}
                                        helperText={err.roleErr}
                                    >
                                        <option value="" disabled></option>
                                        <option value="client">Client</option>
                                        <option value="professional">Professional</option>
                                    </TextField>
                                </Grid>

                                {/* First Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        error={!!err.firstName}
                                        helperText={err.firstName}
                                    />
                                </Grid>

                                {/* Last Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        error={!!err.lastName}
                                        helperText={err.lastName}
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!err.validEmailErr}
                                        helperText={err.validEmailErr}
                                    />
                                </Grid>

                                {/* Password */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={!!err.passStrengthErr || !!err.samePassErr}
                                        helperText={err.passStrengthErr || err.samePassErr}
                                    />
                                </Grid>

                                {/* Confirm Password */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="rePassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="rePassword"
                                        value={formData.rePassword}
                                        onChange={handleInputChange}
                                        error={!!err.samePassErr}
                                        helperText={err.samePassErr}
                                    />
                                </Grid>

                                {/* Dynamic Fields based on Role */}
                                {formData.role === "client" &&
                                    <UserSignup formData={formData} setFormData={setFormData} />}
                                {formData.role === "professional" &&
                                    <ProfessionalSignup formData={formData} setFormData={setFormData} />}

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                        Sign Up
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    }
                </Box>
            </Container>
        </ThemeProvider>
    );

}