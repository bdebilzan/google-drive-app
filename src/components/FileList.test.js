import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import FileList from './FileList'; // Adjust path as needed


jest.mock('axios');


const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value; },
        removeItem: (key) => { delete store[key]; }
    };
})();
global.localStorage = mockLocalStorage;

describe('FileList Component', () => {
    const mockFiles = [
        { id: '1', name: 'file1.txt', mimeType: 'text/plain' },
        { id: '2', name: 'file2.docx', mimeType: 'application/vnd.google-apps.document' }
    ];
    const mockRefreshFileList = jest.fn();

    beforeEach(() => {
        localStorage.setItem('accessToken', 'mock-access-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders file list correctly', () => {
        render(<FileList files={mockFiles} refreshFileList={mockRefreshFileList} />);

        expect(screen.getByText('file1.txt')).toBeInTheDocument();
        expect(screen.getByText('file2.docx')).toBeInTheDocument();
    });

    test('handles file download', async () => {
        axios.get.mockResolvedValue({
            data: new Blob(),
            headers: { 'content-disposition': 'filename="file1.txt"' }
        });

        render(<FileList files={mockFiles} refreshFileList={mockRefreshFileList} />);

        fireEvent.click(screen.getAllByRole('button')[0]); // Assuming download button is the first button

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                'https://www.googleapis.com/drive/v3/files/1?alt=media',
                { headers: { Authorization: 'Bearer mock-access-token' }, responseType: 'blob' }
            );
        });
    });

    test('handles download failure', async () => {
        global.alert = jest.fn();
        axios.get.mockRejectedValue(new Error('Download failed'));

        render(<FileList files={mockFiles} refreshFileList={mockRefreshFileList} />);

        fireEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Download failed: Download failed");
        });
    });

    test('handles file deletion', async () => {
        axios.delete.mockResolvedValue({});

        render(<FileList files={mockFiles} refreshFileList={mockRefreshFileList} />);

        fireEvent.click(screen.getAllByRole('button')[1]);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                'https://www.googleapis.com/drive/v3/files/1',
                { headers: { Authorization: 'Bearer mock-access-token' } }
            );
            expect(mockRefreshFileList).toHaveBeenCalled();
        });
    });

    test('handles deletion failure', async () => {
        axios.delete.mockRejectedValue(new Error('Delete failed'));

        render(<FileList files={mockFiles} refreshFileList={mockRefreshFileList} />);

        fireEvent.click(screen.getAllByRole('button')[1]);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Delete failed: Delete failed');
        });
    });
});