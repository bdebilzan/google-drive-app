import React, { useEffect } from 'react';
import { getAuthUrl, parseHash } from '../auth';
import './Auth.css';

const Auth = () => {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const { accessToken } = parseHash(hash);
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                window.location.hash = ''; // Clear hash to prevent reprocessing
                window.location.href = '/'; // Redirect to main page
            }
        } else if (localStorage.getItem('accessToken')) {
            // If token exists, redirect to the main page
            window.location.href = '/';
        }
    }, []);

    const handleLogin = () => {
        window.location.href = getAuthUrl();
    };

    return (
        <div className="auth-container">
            <button type="button" className="login-with-google-btn" onClick={handleLogin}>
                Sign in with Google
            </button>
        </div>
    );
};

export default Auth;