import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // You can add more logic here to handle user login, logout, etc.
    const login = (userData) => {
        setUser(userData);
        // Additional logic can be added here such as setting tokens in localStorage/sessionStorage
    };


    const logout = () => {
        setUser(null);
        // Here you can also handle the removal of tokens from storage and cleanup tasks
    };



    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};