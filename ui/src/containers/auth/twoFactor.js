import React, { useState, useContext } from "react";
import Header from "../header";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postReq } from "../../services/api";
import { Navigate } from "react-router-dom";
import { UserContext } from '../../context'; // Adjust the path as necessary
import { jwtDecode } from 'jwt-decode';

const defaultTheme = createTheme();

export default function TwoFactor(props) {
    const [code, setCode] = useState(null);
    const [nav, setNav] = useState(null);
    const { setUser } = useContext(UserContext);

    const handleInputChange = (event) => {
        setCode(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            token: localStorage.getItem("token"),
            code: code
        }

        const headers = {};
        const response = await postReq("/auth/2fa/verify", headers, data);

        if (response.status === 200) {
            console.log("Token decoded successfully");
            localStorage.removeItem("token");
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("UserId", response.data.userId);
            const decodedToken = jwtDecode(response.data.token);

            setUser({ id: decodedToken.userId, role: decodedToken.role });

            let navigation_string = "/dashboard"
            if (decodedToken.role === "professional") {
                navigation_string = "/pdashboard"
            }


            setNav(navigation_string);
        } else {
            console.log("Error");
        }

        console.log(response)
    }

    if (nav) {
        return <Navigate to={nav} />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Header />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div
                    style={{
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Enter the 2FA Code
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '8px' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="code"
                            label="2FA Code"
                            name="code"
                            autoFocus
                            type="number"
                            value={code}
                            onChange={handleInputChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ margin: '24px 0 16px' }}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </Container>
        </ThemeProvider>
    );
}