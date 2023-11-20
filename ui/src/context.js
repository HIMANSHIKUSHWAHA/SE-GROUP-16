// import React, { createContext, useState, useContext } from 'react';
//
// const UserContext = createContext(null);
//
// export const useUser = () => useContext(UserContext);
//
// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//
//     const fetchAndSetUserDetails = async (userId) => {
//         try {
//             // Replace with your API call to fetch user details
//             const response = await fetch(`/api/user/${userId}`);
//             const userDetails = await response.json();
//             setUser(userDetails);
//         } catch (error) {
//             console.error('Failed to fetch user details:', error);
//         }
//     };
//
//     const logout = () => {
//         setUser(null);
//         //handle the removal of tokens from storage and cleanup tasks
//         //will figure out later.
//     };
//
//     return (
//         <UserContext.Provider value={{ user, login, logout }}>
//             {children}
//         </UserContext.Provider>
//     );
// };