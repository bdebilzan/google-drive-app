import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import Auth from './components/Auth';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import { listFiles } from './services/fileService';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [files, setFiles] = useState([]);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [error, setError] = useState(null);

  // Fetch files when accessToken changes
  useEffect(() => {
    const fetchFiles = async () => {
      if (accessToken) {
        try {
          // Fetch files from the server using the access token
          const data = await listFiles(accessToken);
          setFiles(data);
          setError(null); // Clear any previous errors
        } catch (err) {
          if (err.message.includes('Unauthorized')) {
            // Unauthorized error: Token might be expired or invalid
            setError('Session expired or unauthorized. Please log in again.');
            setAccessToken(null); // Clear the invalid token
            localStorage.removeItem('accessToken');
          } else {
            setError('An error occurred: ' + err.message);
          }
        }
      }
    };

    // Call fetchFiles function when component mounts or accessToken changes
    fetchFiles();
  }, [accessToken]);

  // Function to refresh the file list
  const refreshFileList = async () => {
    if (accessToken) {
      try {
        const data = await listFiles(accessToken);
        setFiles(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        if (err.message.includes('Unauthorized')) {
          setError('Session expired or unauthorized. Please log in again.');
          setAccessToken(null); // Clear the invalid token
          localStorage.removeItem('accessToken');
        } else {
          setError('An error occurred: ' + err.message);
        }
      }
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Remove token from local storage
    setAccessToken(null); // Clear the access token in state
  };

  return (
    <Container className="container">
      <Box className="logout-button-container">
        {/* Render logout button if accessToken is present */}
        {accessToken && (
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            className="logout-button"
            endIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
          >
            Logout
          </Button>
        )}
      </Box>
      <Box className="header-container">
        <img src="/images/logo_drive.png" alt="Google Drive Logo" className="header-logo" />
        <h1 className="header-text">
          Google Drive File Manager
        </h1>
      </Box>
      {/* Display error message if there is an error */}
      {error && (
        <Typography variant="body1" color="error" className="error-message">
          {error}
        </Typography>
      )}
      {/* Render authentication or file management components based on accessToken */}
      {!accessToken ? (
        <Auth onLogin={(token) => {
          localStorage.setItem('accessToken', token);
          setAccessToken(token);
        }} />
      ) : (
        <Box>
          <Paper elevation={3} className="paper">
            {/* Render file upload component */}
            <FileUpload onUploadSuccess={refreshFileList} />
          </Paper>
          <Paper elevation={3} className="paper file-list-paper">
            {/* Render file list component */}
            <FileList files={files} refreshFileList={refreshFileList} />
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default App;