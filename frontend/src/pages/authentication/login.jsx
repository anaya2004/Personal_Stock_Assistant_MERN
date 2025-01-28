import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

// export default function Login() {
//   return (
//     <AuthWrapper>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
//             <Typography variant="h3">Login</Typography>
//             <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
//               Don&apos;t have an account?
//             </Typography>
//           </Stack>
//         </Grid>
//         <Grid item xs={12}>
//           <AuthLogin />
//         </Grid>
//       </Grid>
//     </AuthWrapper>
//   );
// }
import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function GoogleLoginComponent({ onLogin }) {
  const navigate = useNavigate(); // Initialize the navigate function from React Router

  useEffect(() => {
    // Initialize the Google API client only once when the component is mounted
    const loadGAPI = () => {
      if (window.gapi) {
        gapi.load('client:auth2', () => {
          gapi.client
            .init({
              apiKey: 'AIzaSyBunXc90zSwakNePdcaJk37HyeKUN4mBZY', // Your Google API Key
              clientId:
                '429483677672-3cuhk7ek9gsps5sv60i5ohr66gmg6app.apps.googleusercontent.com', // Your Google Client ID
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                'https://sheets.googleapis.com/$discovery/rest?version=v4',
              ],
              scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly',
            })
            .then(() => {
              console.log('Google API client initialized.');
            })
            .catch((error) => {
              console.error('Google API client initialization failed:', error);
            });
        });
      } else {
        console.error('gapi is not available.');
      }
    };

    loadGAPI(); // Initialize Google API client when the component is mounted

    // Additional code for handling sign-in status and client load
    const CLIENT_ID = '429483677672-3cuhk7ek9gsps5sv60i5ohr66gmg6app.apps.googleusercontent.com'; // Replace with your client ID
    const API_KEY = 'AIzaSyBunXc90zSwakNePdcaJk37HyeKUN4mBZY'; // Replace with your API key (you can find this in the Google Cloud Console)
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    
    // Include all necessary scopes
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readwrite"; // Required for Google Sheets API

    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(() => {
        // Handle the case where the user is already authenticated
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }

    function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        console.log("User is signed in!");
      } else {
        console.log("User is not signed in.");
        gapi.auth2.getAuthInstance().signIn();
      }
    }

    function handleClientLoad() {
      gapi.load("client:auth2", initClient);
    }

    handleClientLoad(); // Call the client load function after initialization
  }, []); // Empty dependency array ensures this effect only runs once

  const onSuccess = (response) => {
    console.log('Login Success:', response);

    // Get the auth token from the response
    const authToken = response.credential;
    console.log('Auth Token:', authToken);
    localStorage.setItem('googleAuthToken', authToken);
    
    // Redirect to Strategies.js after successful login
    navigate('/dashboard/index.jsx'); // This will navigate the user to the /strategies route

    if (onLogin) {
      onLogin(response); // Pass the response to the parent component
    }
  };

  const onFailure = (response) => {
    console.error('Login Failed:', response);
  };

  return (
    <GoogleOAuthProvider clientId="429483677672-3cuhk7ek9gsps5sv60i5ohr66gmg6app.apps.googleusercontent.com">
      <div>
        <h1>Login with Google</h1>
        <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginComponent;