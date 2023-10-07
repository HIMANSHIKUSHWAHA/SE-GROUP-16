import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./dashboard.js"
import PrivateRoute from "./privateRoute"
import ClientLogin from "./auth/clientLogin.js";
import ClientSignup from "./auth/clientSignup.js";
import ResetPassword from "./auth/resetPassword";
import UpdatePassword from "./auth/updatePassword.js";
import TwoFactor from "./auth/twoFactor.js";

// user profile 
export default function Router () {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<ClientLogin />} />
            <Route path="/signup" element={<ClientSignup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />  {/* This will change */}
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