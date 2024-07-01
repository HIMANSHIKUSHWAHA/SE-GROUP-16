import React, {useState} from "react";
import Header from "../header";
import validator from "validator";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { postReq } from "../../services/api";
import { useSearchParams, Navigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { Box, Container, CssBaseline, Typography, createTheme } from "@mui/material";

const defaultTheme = createTheme()

export default function UpdatePassword (props) {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [formData, setFormData]  = useState({
        newPassword: "",
        confirmPassword: "",
        token: searchParams.get("__upt")
    });

    const [err, setErr] = useState({
        passStrengthErr: null,
        samePassErr: null
    });

    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return {...prevFormData, [name]: value};
        });
        setErr({
            passStrengthErr: null,
            samePassErr: null
        });
    }

    const handleSubmit = async (event) => {
        
        event.preventDefault();
        console.log(formData);
        if(validator.isStrongPassword(formData.newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })){
            if(formData.newPassword === formData.confirmPassword){

                const headers = {};
                const response = await postReq("/auth/updatePassword", headers, formData);

                console.log(response)

                setNav("/login");
            }else{
                setErr((prevErr) => {
                    return { ...prevErr, "samePassErr": "The passwords does not match" };
                });
            }
        }else{
            setErr((prevErr) => {
                return { ...prevErr, "passStrengthErr": "Password should contain atleast 8 characters \n 1 lowercase letter \n 1 uppercase letter \n 1 numeric value and 1 symbol" };
            });
        }
    }

    if (nav) {
        return <Navigate to={nav} />
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Header />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Update Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="newPassword"
                            label="New Password"
                            name="newPassword"
                            autoComplete="newPassword"
                            type="password"
                            autoFocus
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            error={err.passStrengthErr !== null}
                            helperText={err.passStrengthErr}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            name="confirmPassword"
                            autoComplete="confirmPassword"
                            type="password"
                            autoFocus
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={err.samePassErr !== null}
                            helperText={err.samePassErr}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}