import axios from 'axios';

// Base URL for Google Drive API files endpoint
const API_URL = 'https://www.googleapis.com/drive/v3/files';

/**
 * Fetches a list of files from Google Drive.
 *
 * @param {string} accessToken - The OAuth 2.0 access token for authorization.
 * @returns {Promise<Array>} - A promise that resolves to an array of files.
 * @throws {Error} - Throws an error if the API request fails or if the access token is invalid.
 */
export const listFiles = async (accessToken) => {
    try {
        // Make GET request to Google Drive API to list files
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                // Specify the fields to return in the response
                fields: 'files(id,name,mimeType,modifiedTime)',
            },
        });
        return response.data.files;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Unauthorized: Access token might be expired or invalid.');
        } else {
            throw error;
        }
    }
};