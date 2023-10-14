import React, { useState, useEffect } from "react";
import { postReq } from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function TwoFactorAuthSetup() {
    const navigate = useNavigate();
    const location = useLocation();
    // console.log("LOCATION IN 2FA IS :", location.state.userId);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [error, setError] = useState(null);


    const userId = location.state.userId;

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const headers = {}
                const response = await postReq("/auth/2fa/setup", headers, { userId: userId });
                setQrCodeUrl(response.qrCodeUrl);
            } catch (error) {
                setError("Failed to fetch QR code.");
            }
        };

        fetchQrCode();
    }, []);

    const handleVerification = async () => {
        // Add logic for verifying 2FA setup here, and navigate to the next page if verification is successful
        navigate("/login");
    };

    return (
        <div>
            <h1>Two-Factor Authentication Setup</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {qrCodeUrl && (
                <div>
                    <p>Scan the QR code with your authentication app:</p>
                    <img src={qrCodeUrl} alt="QR Code" />
                    <button onClick={handleVerification}>Verify Setup</button>
                </div>
            )}
        </div>
    );
}
