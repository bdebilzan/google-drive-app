const CLIENT_ID = '335747368405-efjatiulumbpmqhklnc90kolkp2f7d3v.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000';
const SCOPES = 'https://www.googleapis.com/auth/drive';

export const getAuthUrl = () => {
    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&prompt=consent`;
};


export const parseHash = (hash) => {
    const params = new URLSearchParams(hash.replace('#', ''));
    return {
        accessToken: params.get('access_token'),
        tokenType: params.get('token_type')
    };
};