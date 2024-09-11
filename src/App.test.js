import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { listFiles } from './services/fileService';

jest.mock('./services/fileService');
jest.mock('./components/Auth', () => ({ onLogin }) => (
  <button onClick={() => onLogin('mock-access-token')}>Login</button>
));
jest.mock('./components/FileUpload', () => ({ onUploadSuccess }) => (
  <button onClick={onUploadSuccess}>Upload File</button>
));
jest.mock('./components/FileList', () => () => (
  <div>File List</div>
));

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders login button if no access token', () => {
    render(<App />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('logs in and fetches files', async () => {
    const mockFiles = [{ id: '1', name: 'file1' }];
    listFiles.mockResolvedValue(mockFiles);

    render(<App />);

    // Simulate login
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(listFiles).toHaveBeenCalledWith('mock-access-token');
      expect(screen.getByText('Google Drive File Manager')).toBeInTheDocument();
    });
  });

  test('shows error message on unauthorized access', async () => {
    listFiles.mockRejectedValueOnce(new Error('Unauthorized: Access token might be expired or invalid.'));

    render(<App />);

    // Simulate login
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Session expired or unauthorized. Please log in again.')).toBeInTheDocument();
    });
  });

  test('handles file upload and list refresh', async () => {
    const mockFiles = [{ id: '1', name: 'file1' }];
    listFiles.mockResolvedValue(mockFiles);

    render(<App />);

    // Simulate login
    fireEvent.click(screen.getByText('Login'));

    // Simulate file upload
    fireEvent.click(screen.getByText('Upload File'));

    await waitFor(() => {
      expect(listFiles).toHaveBeenCalled();
      expect(screen.getByText('File List')).toBeInTheDocument();
    });
  });

  test('handles logout', async () => {
    const mockFiles = [{ id: '1', name: 'file1' }];
    listFiles.mockResolvedValue(mockFiles);

    render(<App />);

    // Simulate login
    fireEvent.click(screen.getByText('Login'));

    // Simulate logout
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
});
