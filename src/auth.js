const CLIENT_ID = '335747368405-efjatiulumbpmqhklnc90kolkp2f7d3v.apps.googleusercontent.com'; // OAuth 2.0 Client ID
const REDIRECT_URI = 'http://localhost:3000'; // Redirect URI where Google will send the authentication response
const SCOPES = 'https://www.googleapis.com/auth/drive'; // Scopes for Google Drive API access

/**
 * Generates the URL for Google OAuth 2.0 authentication.
 * 
 * @returns {string} - The full authorization URL for Google OAuth 2.0.
 */
export const getAuthUrl = () => {
    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&prompt=consent`;
};

/**
 * Parses the hash fragment of the URL to extract OAuth 2.0 tokens.
 * 
 * @param {string} hash - The hash fragment from the URL (e.g., `#access_token=...&token_type=...`)
 * @returns {Object} - An object containing the access token and token type.
 */
export const parseHash = (hash) => {
    // Create a URLSearchParams object from the hash (removing the leading '#')
    const params = new URLSearchParams(hash.replace('#', ''));
    return {
        accessToken: params.get('access_token'), // Extract the access token
        tokenType: params.get('token_type') // Extract the token type (e.g., "Bearer")
    };
};