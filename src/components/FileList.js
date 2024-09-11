import React from 'react';
import { List, ListItem, ListItemText, IconButton, Box, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './FileList.css';

const FileList = ({ files, refreshFileList }) => {
    const accessToken = localStorage.getItem('accessToken');

    const downloadFile = async (fileId, fileName, mimeType) => {
        try {
            let response;
            let finalFileName = fileName;


            if (mimeType.startsWith('application/vnd.google-apps.')) {
                // Map Google Drive MIME types to export formats
                const exportMimeTypeMap = {
                    'application/vnd.google-apps.document': 'application/msword', // Google Docs to Word
                    'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Google Sheets to Excel
                    'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // Google Slides to PPT
                };

                const exportMimeType = exportMimeTypeMap[mimeType];

                if (!exportMimeType) {
                    throw new Error('Unsupported file type for export.');
                }

                // Fetch the file in the desired format
                response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${exportMimeType}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    responseType: 'blob',
                });

                // Use appropriate extension based on MIME type
                finalFileName = fileName.endsWith('.docx') || fileName.endsWith('.xlsx') || fileName.endsWith('.pptx') ? fileName : fileName + (exportMimeType === 'application/msword' ? '.docx' : exportMimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? '.xlsx' : '.pptx');
            } else {
                // Direct download for binary files
                response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    responseType: 'blob',
                });

                // Use Content-Disposition header if available
                const contentDisposition = response.headers['content-disposition'];
                if (contentDisposition) {
                    const matches = /filename="([^"]+)"/.exec(contentDisposition);
                    if (matches && matches[1]) {
                        finalFileName = matches[1];
                    }
                }
            }

            // Create a URL for the file blob and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', finalFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Download failed: ' + (err.response?.data?.error?.message || err.message));
        }
    };

    const deleteFile = async (fileId) => {
        try {
            await axios.delete(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Refresh the file list after deletion
            refreshFileList();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.error?.message || err.message));
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                File List
            </Typography>
            <Box className="file-list-container">
                <List>
                    {files.map((file) => (
                        <ListItem key={file.id} className="list-item">
                            <ListItemText
                                primary={file.name}
                                secondary={
                                    <>
                                        <div>Type: {file.mimeType}</div>
                                        <div>Last Modified: {new Date(file.modifiedTime).toLocaleString()}</div>
                                    </>
                                }
                                className="list-item-text"
                            />
                            <IconButton
                                color="primary"
                                onClick={() => downloadFile(file.id, file.name, file.mimeType)}
                                className="file-list-button"
                            >
                                <FontAwesomeIcon icon={faDownload} />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => deleteFile(file.id)}
                                className="file-list-button"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default FileList;