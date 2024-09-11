## Overview of the application

The application is designed to manage files in Google Drive, allowing users to view, upload, download, and delete files. It uses Google Drive API for file operations and OAuth 2.0 for authentication. The application is built with React and Material-UI for the user interface, and Axios for API requests.

## Instructions on setting up the development environment

### Prerequisites

Before setting up the development environment, ensure you have the following installed on your system:

Node.js: The application uses Node.js for managing dependencies and running the development server. Download Node.js (LTS version is recommended).

npm or yarn: Package managers for managing JavaScript dependencies. npm is installed with Node.js; you can also use yarn. Install yarn.

Install the dependencies by running `npm install`.

### Clone the Repository

Clone the repository from GitHub

###  Install Dependencies

Navigate to the project directory and install the necessary dependencies using npm or yarn

### Set Up Environment Variables

Create a .env file in the root directory of the project (if not already present) and add the required environment variables. For example:

REACT_APP_CLIENT_ID=your-client-id
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_SCOPES=https://www.googleapis.com/auth/drive

### Configure Google API

Create a Google Cloud Project:

Go to the Google Cloud Console.
Create a new project or select an existing one.

Enable Google Drive API:

Navigate to APIs & Services > Library.
Search for "Google Drive API" and enable it for your project.

Set Up OAuth 2.0 Credentials:

Go to APIs & Services > Credentials.
Click Create Credentials and select OAuth 2.0 Client ID.
Configure the consent screen if prompted.
Set the application type to Web application and configure the Authorized redirect URIs (e.g., http://localhost:3000).
Note the Client ID and Client Secret provided.

## Steps to run the application

Run `npm start`.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Instructions on how to run the tests

Run `npm test` to run the Jest unit and integration tests.

## Assumptions

Google OAuth 2.0: The application assumes that users will authenticate using Google OAuth 2.0. The CLIENT_ID, REDIRECT_URI, and SCOPES are pre-defined for accessing Google Drive API.

API Access: It assumes that the API credentials and scopes are correctly configured in the Google Developer Console, and that the application is registered with the proper redirect URI.

Access Token Storage: The application assumes that the access token is stored in localStorage for subsequent API requests. It also assumes that the token may expire or become invalid.

Error Handling: Basic error handling is implemented for unauthorized access and other API errors, but more detailed error handling may be required for production use.

File Types: It assumes that files can be exported from Google Drive in supported formats like Google Docs to Word, Google Sheets to Excel, and Google Slides to PPT.

## Design decisions 

### Component Structure:

Auth Component: Handles user authentication and token retrieval. On successful login, it saves the access token in localStorage and redirects the user.

FileUpload Component: Manages file uploads to Google Drive. It uses multipart form data to send both file metadata and the file itself.

FileList Component: Displays a list of files fetched from Google Drive. Each file’s name, type, and last modified date are shown. Provides options to download or delete files.

### API Integration:

FileList Service (listFiles): Fetches files from Google Drive using the GET request with Authorization headers. It handles unauthorized errors and token expiration.

FileUpload Service: Uses multipart/related content type to upload files to Google Drive. Metadata is included in a separate part of the multipart request.

### UI/UX Considerations:

File Display: Uses Material-UI’s List and ListItem components for displaying files. Last modified date is shown using Date.prototype.toLocaleString() for better readability.
Error Handling: Displays errors to the user in a Typography component. Provides feedback for both upload failures and session expiration.
Loading Indicators: Uses LinearProgress to indicate file upload progress.

### Authentication Flow:

OAuth URL Generation: Constructs the OAuth URL with required parameters (response_type, client_id, redirect_uri, scope, prompt) to handle user authentication and token retrieval.

Token Parsing: Extracts access token and token type from the URL hash after successful authentication.

### State Management:

React State: Utilizes React hooks (useState, useEffect) for managing state such as file list, authentication token, and error messages.

File Management: Implements functions for handling file uploads, downloads, and deletions, updating the UI accordingly.

### Code Comments and Documentation:

Added Comments: Code includes comments explaining complex logic, API request handling, and UI updates. This helps in understanding the purpose and functionality of different code sections.

## Future considerations

Enhanced Error Handling: Implement more comprehensive error handling and user feedback mechanisms.

Security Improvements: Ensure secure storage of tokens.

Performance Optimization: Optimize performance for handling large file lists and uploads.