# Google Drive File Manager

## Overview

This application is designed to manage files in Google Drive. Users can view, upload, download, and delete files. The app integrates with the Google Drive API for file operations and uses OAuth 2.0 for user authentication. It is built with React and Material-UI for the user interface and Axios for API requests.

## Setup Instructions

### Prerequisites

Before setting up the development environment, ensure you have the following installed:
- **Node.js**
- **npm** or **yarn**

### Clone the Repository

[GitHub Cloning a Repository Documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#cloning-a-repository)

### Install Dependencies

Navigate to the project directory and install the dependencies:
```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:
```
REACT_APP_CLIENT_ID=your-client-id
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_SCOPES=https://www.googleapis.com/auth/drive
```

### Configure Google API

1. **Create a Google Cloud Project:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.

2. **Enable Google Drive API:**
   - Navigate to **APIs & Services > Library**.
   - Search for "Google Drive API" and enable it for your project.

3. **Set Up OAuth 2.0 Credentials:**
   - Go to **APIs & Services > Credentials**.
   - Click **Create Credentials** and select **OAuth 2.0 Client ID**.
   - Configure the consent screen if prompted.
   - Set the application type to **Web application** and configure the **Authorized redirect URIs** (e.g., http://localhost:3000).
   - Note the **Client ID** and **Client Secret** provided.

## Running the Application

1. Start the application:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Running Tests

To run the Jest unit and integration tests, execute:
```bash
npm test
```

## Assumptions

- **Google OAuth 2.0:** Assumes users authenticate using Google OAuth 2.0 with predefined CLIENT_ID, REDIRECT_URI, and SCOPES.
- **API Access:** Assumes proper configuration of API credentials and scopes in the Google Developer Console, and registration with the correct redirect URI.
- **Access Token Storage:** Assumes that the access token is stored in `localStorage` and may expire or become invalid.
- **Error Handling:** Basic error handling is implemented. Further error handling may be needed for production use.
- **File Types:** Assumes support for exporting Google Drive files to formats like Word, Excel, and PPT.

## Design Decisions

### Component Structure

- **Auth Component:** Handles user authentication and token retrieval. On successful login, it saves the access token in `localStorage` and redirects the user.
- **FileUpload Component:** Manages file uploads to Google Drive using multipart form data for file metadata and the file itself.
- **FileList Component:** Displays a list of files from Google Drive, including name, type, and last modified date. Provides options to download or delete files.

### API Integration

- **FileList Service (`listFiles`):** Fetches files from Google Drive using a GET request with Authorization headers. Handles unauthorized errors and token expiration.
- **FileUpload Service:** Uploads files to Google Drive using multipart/related content type, including metadata and the file.

### UI/UX Considerations

- **File Display:** Uses Material-UI’s List and ListItem components. Displays the last modified date using `Date.prototype.toLocaleString()` for better readability.
- **Error Handling:** Shows errors in a Typography component. Provides feedback for upload failures and session expiration.
- **Loading Indicators:** Uses LinearProgress to show file upload progress.

### Authentication Flow

- **OAuth URL Generation:** Constructs the OAuth URL with parameters for authentication and token retrieval.
- **Token Parsing:** Extracts the access token and token type from the URL hash after successful authentication.

### State Management

- **React State:** Utilizes React hooks (`useState`, `useEffect`) for managing state, including file list, authentication token, and error messages.
- **File Management:** Implements functions for handling file uploads, downloads, and deletions, updating the UI as needed.

### Code Comments and Documentation

- **Added Comments:** The code includes comments explaining complex logic, API request handling, and UI updates to aid understanding.

## Future Considerations

### Enhanced Error Handling

**Implement more comprehensive error handling and user feedback mechanisms:**

- **Retry Logic:** Implement retry logic for transient errors. For example, if a network request fails due to a temporary issue, automatically retry the request a few times before giving up.

- **Error Logging:** Incorporate error logging to capture and analyze errors that occur in production. Tools like Sentry or LogRocket can be used to track and report errors, making it easier to diagnose and fix issues.

- **Graceful Degradation:** Ensure that the application degrades gracefully in the event of an error. For instance, if file listing fails, provide a fallback mechanism that allows users to continue interacting with other parts of the application.

### Security Improvements

**Ensure secure storage of tokens:**

- **Use Secure Storage:** Store tokens securely in the browser. For example, use HTTP-only cookies for sensitive data to prevent access from JavaScript and reduce the risk of XSS attacks. Avoid storing tokens in localStorage or sessionStorage when possible.

- **Token Encryption:** Encrypt tokens before storing them. This adds an extra layer of security in case of a storage breach.

**Implement token refresh logic to handle token expiration:**

- **Automatic Token Refresh:** Implement a mechanism to automatically refresh tokens before they expire. This can be done by using refresh tokens or by requesting a new token from the OAuth server when the current token is close to expiring.

- **Secure Refresh Token Handling:** If using refresh tokens, ensure they are stored securely and are not exposed to potential attackers. Implement strict policies on how and when refresh tokens are used.

### Performance Optimization

**Optimize performance for handling large file lists and uploads:**

- **Pagination and Infinite Scrolling:** Implement pagination or infinite scrolling for displaying large file lists. This reduces the initial load time and improves the user experience by loading data in chunks.

- **Efficient Data Handling:** Use efficient data structures and algorithms to manage file lists and uploads. For example, use virtualization libraries to only render items that are currently visible in the viewport.

- **Lazy Loading:** Apply lazy loading techniques to load files or data only when needed. For example, load file previews or metadata on demand instead of fetching everything upfront.

- **Caching:** Implement caching strategies to reduce redundant network requests. For instance, cache previously fetched file lists or metadata to improve performance and reduce server load.

