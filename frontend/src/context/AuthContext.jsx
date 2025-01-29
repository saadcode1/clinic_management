import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Convert to seconds
                if (decoded.exp > currentTime) {
                    setUser(decoded);
                    scheduleLogout(decoded.exp - currentTime); // Schedule logout
                } else {
                    localStorage.removeItem('token'); // Token expired
                }
            } catch {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        const currentTime = Date.now() / 1000; // Convert to seconds
        scheduleLogout(decoded.exp - currentTime); // Schedule logout
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        alert('Your session has expired. Please log in again.');
    };

    const scheduleLogout = (seconds) => {
        console.log("--------run")
        setTimeout(() => {
            logout();
        }, seconds * 1000); // Convert seconds to milliseconds
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
