import axios from 'axios';

const API_URL = 'https://www.googleapis.com/drive/v3/files';

export const listFiles = async (accessToken) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
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