// This OtpVerification component works as follows:

// A user inputs an OTP into a text field.
// Upon form submission, the OTP is sent to the server (here I've assumed the endpoint is /auth/verify-otp) for verification.
// If the server responds that the OTP is verified, the user is redirected to the login page.
// If the OTP is incorrect, an error message is displayed to the user.
// Please note that you'll need to have the server-side logic in place to verify the OTP and respond accordingly. This component assumes such a setup.

// You can integrate this component into your application, and adjust as needed based on your specific requirements and styling.


// import React, { useState } from "react";
// import { postReq } from "../../services/api";
// import { Navigate, useLocation } from "react-router-dom";

// export default function OtpVerification() {

//     const location = useLocation();
//     const userId = location.state.userId;  // Retrieve userId
//     // console.log("USER ID IN OTP VERIFY JS -------", userId);

//     const [otp, setOtp] = useState("");
//     const [error, setError] = useState(null);
//     const [nav, setNav] = useState(null);

//     const handleInputChange = (event) => {
//         setOtp(event.target.value);
//         setError(null);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         const headers = {};
//         const response = await postReq("/auth/verify-otp", headers, { userId, otp });

//         if (response.message === "OTP verified") {
//             setNav({
//                 pathname: "/2fa-setup",
//                 state: { userId: response.userId }
//             });
//         } else {
//             setError("Invalid OTP. Please try again.");
//         }
//     };

//     if (nav == null) {
//         return (
//             <div className="Otp-form-container">
//                 <h2>Verify OTP</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Enter OTP"
//                             value={otp}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     {error && <span style={{ color: 'darkred' }}>{error}</span>}
//                     <div className="d-grid gap-2 mt-3">
//                         <button type="submit" className="btn btn-primary">
//                             Verify
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         );
//     } else {
//         return <Navigate to={nav.pathname} state={nav.state} />;
//     }
// }

import React, { useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postReq } from "../../services/api";
import { Navigate, useLocation } from "react-router-dom";
import Header from './../header'

const defaultTheme = createTheme();

export default function OtpVerification() {
    const location = useLocation();
    const userId = location.state.userId;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        setOtp(event.target.value);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const headers = {};
        const response = await postReq("/auth/verify-otp", headers, { userId, otp });

        if (response.message === "OTP verified") {
            setNav({
                pathname: "/2fa-setup",
                state: { userId: response.userId }
            });
        } else {
            setError("Invalid OTP. Please try again.");
        }
    };

    if (nav) {
        return <Navigate to={nav.pathname} state={nav.state} />;
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
                        Verify OTP
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '8px' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="otp"
                            label="Enter OTP"
                            name="otp"
                            autoFocus
                            value={otp}
                            onChange={handleInputChange}
                            error={Boolean(error)}
                            helperText={error}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ margin: '24px 0 16px' }}
                        >
                            Verify
                        </Button>
                    </form>
                </div>
            </Container>
        </ThemeProvider>
    );
}
