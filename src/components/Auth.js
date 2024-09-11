import React, { useEffect } from 'react';
import { getAuthUrl, parseHash } from '../auth';
import './Auth.css';

const Auth = () => {
    useEffect(() => {
        // Extract the hash from the URL, which contains the OAuth token
        const hash = window.location.hash;
        if (hash) {
            // Parse the hash to extract the access token
            const { accessToken } = parseHash(hash);

            if (accessToken) {

                // If access token is found, store it in local storage
                localStorage.setItem('accessToken', accessToken);

                // Clear the hash from the URL to avoid reprocessing
                window.location.hash = '';
                // Redirect the user to the main page after successful authentication
                window.location.href = '/';
            }
        } else if (localStorage.getItem('accessToken')) {
            // If no hash is present but an access token is already stored,
            // redirect the user to the main page (they are already authenticated)
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