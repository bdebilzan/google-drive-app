import axios from 'axios';
import { listFiles } from './fileService';

// Mock axios
jest.mock('axios');

describe('listFiles', () => {
    const mockAccessToken = 'mock-access-token';

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return files data on successful request', async () => {
        // Mock successful API response
        const mockFiles = [{ id: '1', name: 'file1' }, { id: '2', name: 'file2' }];
        axios.get.mockResolvedValue({ data: { files: mockFiles } });

        const files = await listFiles(mockAccessToken);

        expect(files).toEqual(mockFiles);
        expect(axios.get).toHaveBeenCalledWith('https://www.googleapis.com/drive/v3/files', {
            headers: { Authorization: `Bearer ${mockAccessToken}` },
            params: {
                fields: "files(id,name,mimeType,modifiedTime)",
            },
        });
    });

    test('should throw an error if unauthorized', async () => {
        // Mock unauthorized response
        axios.get.mockRejectedValue({
            response: { status: 401 },
        });

        await expect(listFiles(mockAccessToken)).rejects.toThrow('Unauthorized: Access token might be expired or invalid.');
    });

    test('should throw an error for other API errors', async () => {
        // Mock other API error
        axios.get.mockRejectedValue(new Error('Network Error'));

        await expect(listFiles(mockAccessToken)).rejects.toThrow('Network Error');
    });
});