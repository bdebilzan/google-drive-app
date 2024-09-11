import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FileUpload from './FileUpload';

// Setup a mock adapter for axios
const mock = new MockAdapter(axios);


describe('FileUpload Component', () => {
    beforeEach(() => {
        localStorage.setItem('accessToken', 'test-token');
    });

    afterEach(() => {
        localStorage.removeItem('accessToken');
        mock.reset();
    });

    test('should render and display the Upload button', () => {
        render(<FileUpload onUploadSuccess={() => { }} />);
        expect(screen.getByText('Upload File')).toBeInTheDocument();
        expect(screen.getByText('Upload')).toBeInTheDocument();
    });


    test('should display error message when no file is selected', async () => {
        render(<FileUpload onUploadSuccess={() => { }} />);
        fireEvent.click(screen.getByText('Upload'));
        expect(await screen.findByText('No file selected')).toBeInTheDocument();
    });

    test('should handle successful upload', async () => {
        const onUploadSuccess = jest.fn();
        render(<FileUpload onUploadSuccess={onUploadSuccess} />);
        const fileInput = screen.getByLabelText('file-input');
        const file = new File(['file contents'], 'example.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Mock a successful upload response
        mock.onPost('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart').reply(200);

        fireEvent.click(screen.getByText('Upload'));

        await waitFor(() => {
            expect(onUploadSuccess).toHaveBeenCalled();
        });
    });
});
