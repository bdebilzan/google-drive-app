import React, { useState, useRef } from 'react';
import { Button, Typography, Box, LinearProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const accessToken = localStorage.getItem('accessToken');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null); // Clear the error message when a file is selected
    };

    const handleUpload = async () => {
        if (!file) {
            setError('No file selected');
            return;
        }

        if (!accessToken) {
            setError('No access token found');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify({
            name: file.name,
            mimeType: file.type
        })], { type: 'application/json' }));
        formData.append('file', file);

        try {
            await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/related',
                },
            });
            setError(null);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = null; // Clear file input value
            }
            onUploadSuccess();
        } catch (err) {
            setError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Upload File
            </Typography>
            <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef} // Reference to the file input
                style={{ display: 'block', marginBottom: '16px' }}
                aria-label="file-input"
            />
            <Button
                data-testid="upload-button"
                variant="contained"
                onClick={handleUpload}
                sx={{ marginTop: 2 }}
                disabled={uploading}
            >
                <div className="icon-with-text">
                    <span className="upload-text">Upload</span>
                    <FontAwesomeIcon icon={faUpload} className="icon" />
                </div>
            </Button>
            {uploading && <LinearProgress sx={{ marginTop: 2 }} />}
            {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
        </Box>
    );
};

export default FileUpload;