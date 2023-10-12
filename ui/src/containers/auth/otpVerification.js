import React, { useState } from "react";
import { postReq } from "../../services/api";  // Assuming you have an API utility
import { Navigate } from "react-router-dom";

export default function OtpVerification() {

    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        setOtp(event.target.value);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Here, you'd typically send the OTP to your server for verification
        const response = await postReq("/auth/verify-otp", { user });

        if (response.message === "OTP verified") {
            setNav("/login");
        } else {
            setError("Invalid OTP. Please try again.");
        }
    };

    if (nav) {
        return <Navigate to={nav} />;
    } else {
        return (
            <div className="Otp-form-container">
                <h2>Verify OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {error && <span style={{ color: 'darkred' }}>{error}</span>}
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
// This OtpVerification component works as follows:

// A user inputs an OTP into a text field.
// Upon form submission, the OTP is sent to the server (here I've assumed the endpoint is /auth/verify-otp) for verification.
// If the server responds that the OTP is verified, the user is redirected to the login page.
// If the OTP is incorrect, an error message is displayed to the user.
// Please note that you'll need to have the server-side logic in place to verify the OTP and respond accordingly. This component assumes such a setup.

// You can integrate this component into your application, and adjust as needed based on your specific requirements and styling.





