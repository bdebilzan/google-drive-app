import React from 'react';
import { getAuthUrl, parseHash } from './auth';

describe('Auth Utility Functions', () => {
    const CLIENT_ID = '335747368405-efjatiulumbpmqhklnc90kolkp2f7d3v.apps.googleusercontent.com';
    const REDIRECT_URI = 'http://localhost:3000';
    const SCOPES = 'https://www.googleapis.com/auth/drive';

    test('getAuthUrl generates correct authorization URL', () => {
        const expectedUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&prompt=consent`;

        expect(getAuthUrl()).toBe(expectedUrl);
    });

    test('parseHash correctly parses access token and token type from hash', () => {
        const hash = '#access_token=mock-access-token&token_type=bearer';
        const expectedResult = {
            accessToken: 'mock-access-token',
            tokenType: 'bearer'
        };

        expect(parseHash(hash)).toEqual(expectedResult);
    });

    test('parseHash returns null values if no hash parameters are present', () => {
        const hash = '#';
        const expectedResult = {
            accessToken: null,
            tokenType: null
        };

        expect(parseHash(hash)).toEqual(expectedResult);
    });

    test('parseHash returns null values if hash is empty', () => {
        const hash = '';
        const expectedResult = {
            accessToken: null,
            tokenType: null
        };

        expect(parseHash(hash)).toEqual(expectedResult);
    });
});
