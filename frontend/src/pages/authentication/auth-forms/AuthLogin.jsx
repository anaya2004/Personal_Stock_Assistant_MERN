import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const discoveryDocs = [process.env.REACT_APP_GOOGLE_DISCOVERY_DOCS];
const scope = process.env.REACT_APP_GOOGLE_SCOPE;

function AuthLogin({ onLogin }) {
  const navigate = useNavigate();

  const loadGAPI = () => {
    if (window.gapi) {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey,
            clientId,
            discoveryDocs,
            scope,
          })
          .then(() => console.log("Google API initialized"))
          .catch((error) => console.error("Google API initialization failed:", error));
      });
    } else {
      console.error("gapi is not available.");
    }
  };
  
  useEffect(() => {
    loadGAPI();
  }, []);

  const onSuccess = (response) => {
    console.log('Login Success:', response);
    const authToken = response.credential;
    localStorage.setItem('googleAuthToken', authToken);
  
    // Decode the Google token to get user info
    const userInfo = JSON.parse(atob(authToken.split('.')[1])); // Decoding JWT payload
    localStorage.setItem('googleUser', JSON.stringify(userInfo));
  
    navigate('/'); // Redirect user after login
    if (onLogin) onLogin(response);
  };
  

  const onFailure = (response) => {
    console.error('Login Failed:', response);
  };

 

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="auth-container">
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onFailure}
          useOneTap // Enables popup-based login instead of a new tab
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default AuthLogin;