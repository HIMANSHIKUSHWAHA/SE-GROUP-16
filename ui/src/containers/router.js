import React, { useEffect, useContext } from "react";

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
import SettingsPage from "./dashboard/settingsTab/accountSettingsPage";
import PDashboard from "./dashboard/pDashboard/pDashboard.js";
import LiveSessionForm from "./livestream/liveStream.js";
import JitsiMeetComponent from "./livestream/meetComponent.js";
import Recommendaton from "./dashboard/recommendation/Recommendation.js";
import VideoSearch from "./dashboard/VideoTab/videoSearchTab.js"

import { UserContext } from "../context.js";

// user profile 
export default function Router() {
    const user = useContext(UserContext);

    useEffect(() => {
        console.log("Router re-rendered with user context:", user);
    }, [user]);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/otp-verification" element={<OtpVerification />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/2fa-setup" element={<TwoFactorAuthSetup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />  {/* This will change */}
                <Route path="test" element={<Recommendaton />} />
                <Route path="/pdashboard" element={
                    <PrivateRoute>
                        <PDashboard />
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/meet" element={
                    <PrivateRoute>
                        <JitsiMeetComponent />
                    </PrivateRoute>
                } />
                <Route path="/2fa" element={
                    <PrivateRoute>
                        <TwoFactor />
                    </PrivateRoute>
                } />
                <Route path="/live-session" element={
                    <PrivateRoute>
                        <LiveSessionForm />
                    </PrivateRoute>
                } />

            </Routes>
        </BrowserRouter>
    )
}