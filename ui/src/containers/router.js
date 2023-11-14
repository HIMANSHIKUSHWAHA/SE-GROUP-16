import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./dashboard/dashboard.js"
import PrivateRoute from "./privateRoute"
import Login from "./auth/login.js";
import Signup from "./auth/signup/signup.js";
import ResetPassword from "./auth/resetPassword";
import OtpVerification from "./auth/otpVerification.js";
import UpdatePassword from "./auth/updatePassword.js";
import TwoFactor from "./auth/twoFactor.js";
import TwoFactorAuthSetup from "./auth/twoFactorAuthSetup.js";
import PDashboard from "./dashboard/pDashboard/pDashboard.js";

// user profile 
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/otp-verification" element={<OtpVerification />} />
                <Route path="/2fa-setup" element={<TwoFactorAuthSetup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />  {/* This will change */}
                <Route path="test" element={<PDashboard />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />

                <Route path="/2fa" element={
                    <PrivateRoute>
                        <TwoFactor />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}