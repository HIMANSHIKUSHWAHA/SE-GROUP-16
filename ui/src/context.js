import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Load the user from the JWT token in local storage on initial load
        const token = localStorage.getItem('token');
        console.log("Token: ", token);

        if (token && token.split('.').length === 3) { // Check if token has three parts
            try {
                const decoded = jwtDecode(token);
                setUser({ id: decoded.userId, role: decoded.role });
            } catch (error) {
                console.error("Error decoding token: ", error);
                // Handle token decode error (e.g., clear token, redirect to login)
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
