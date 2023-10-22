// import React, { useState, useEffect } from "react";
// import { postReq } from "../../services/api";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function TwoFactorAuthSetup() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     // console.log("LOCATION IN 2FA IS :", location.state.userId);
//     const [qrCodeUrl, setQrCodeUrl] = useState("");
//     const [error, setError] = useState(null);


//     const userId = location.state.userId;

//     useEffect(() => {
//         const fetchQrCode = async () => {
//             try {
//                 const headers = {}
//                 const response = await postReq("/auth/2fa/setup", headers, { userId: userId });
//                 setQrCodeUrl(response.qrCodeUrl);
//             } catch (error) {
//                 setError("Failed to fetch QR code.");
//             }
//         };

//         fetchQrCode();
//     }, []);

//     const handleVerification = async () => {
//         // Add logic for verifying 2FA setup here, and navigate to the next page if verification is successful
//         navigate("/login");
//     };

//     return (
//         <div>
//             <h1>Two-Factor Authentication Setup</h1>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {qrCodeUrl && (
//                 <div>
//                     <p>Scan the QR code with your authentication app:</p>
//                     <img src={qrCodeUrl} alt="QR Code" />
//                     <button onClick={handleVerification}>Verify Setup</button>
//                 </div>
//             )}
//         </div>
//     );
// }
import React, { useState, useEffect } from "react";
import Header from "../header";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postReq } from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";

const defaultTheme = createTheme();

export default function TwoFactorAuthSetup() {
    const navigate = useNavigate();
    const location = useLocation();
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [error, setError] = useState(null);

    const userId = location.state.userId;

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const headers = {};
                const response = await postReq("/auth/2fa/setup", headers, { userId: userId });
                setQrCodeUrl(response.qrCodeUrl);
            } catch (error) {
                setError("Failed to fetch QR code.");
            }
        };

        fetchQrCode();
    }, []);

    const handleVerification = async () => {
        navigate("/login");
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Header />
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h4" gutterBottom style={{ marginBottom: '20px' }}>
                        Two-Factor Authentication Setup
                    </Typography>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {qrCodeUrl && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Typography variant="body1" gutterBottom style={{ marginBottom: '20px' }}>
                                Scan the QR code with your authentication app:
                            </Typography>
                            <img src={qrCodeUrl} alt="QR Code" style={{ width: '200px', height: '200px', marginBottom: '20px' }} />
                            <div style={{ marginTop: '20px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleVerification}
                                >
                                    Verify Setup
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </ThemeProvider>
    );
}
