import React from 'react';
import Auth from './Auth';
import { render, screen, fireEvent } from '@testing-library/react';
import { parseHash } from '../auth';

jest.mock('../auth', () => ({
    getAuthUrl: jest.fn().mockReturnValue('http://localhost/'),
    parseHash: jest.fn()
}));

describe('Auth Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should have a button that handles login', () => {
        render(<Auth />);
        fireEvent.click(screen.getByText('Sign in with Google'));
        expect(window.location.href).toBe('http://localhost/');
    });

    test('should parse hash and set access token', () => {
        const hash = '#access_token=some-token&token_type=bearer';
        parseHash.mockReturnValue({ accessToken: 'some-token', tokenType: 'bearer' });
        window.location.hash = hash;
        render(<Auth />);
        expect(localStorage.getItem('accessToken')).toBe('some-token');
    });
});