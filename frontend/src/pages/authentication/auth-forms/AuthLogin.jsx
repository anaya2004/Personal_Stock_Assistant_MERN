import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export default function AuthLogin({ onLogin }) {
  return (
    <GoogleOAuthProvider clientId="345535269501-scljiqium691v9b9kvs4tntr45boqts6.apps.googleusercontent.com">
      <ActualAuthLogin onLogin={onLogin} />
    </GoogleOAuthProvider>
  );
}

function ActualAuthLogin({ onLogin }) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    onSuccess: async (tokenResponse) => {
      console.log('✅ Access Token:', tokenResponse.access_token);
      localStorage.setItem('googleAuthToken', tokenResponse.access_token);

      try {
        // ✅ First: Fetch user's profile information (name, avatar, email)
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        });
        const userInfo = await userInfoResponse.json();
        console.log('✅ User Info:', userInfo);

        // Save user info (avatar, name, email) in localStorage
        localStorage.setItem('googleUser', JSON.stringify(userInfo));

        // ✅ Second: Call backend to copy Google Sheet
        const backendResponse = await fetch('http://localhost:5000/api/copy-google-sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token })
        });

        const result = await backendResponse.json();
        console.log('✅ Backend result:', result);

        if (result.id) {
          // Store sheet details in localStorage
          localStorage.setItem('userSheetId', result.id);
          localStorage.setItem('userSheetLink', result.webViewLink);

          alert('✅ Google Sheet copied successfully! Check your Google Drive.');
          navigate('/'); // Redirect to dashboard or home

          if (onLogin) onLogin(tokenResponse); // Optional callback if needed
        } else {
          alert('❌ Failed to copy Google Sheet. Please try again later.');
        }
      } catch (error) {
        console.error('❌ Error during login process:', error);
        alert('❌ An error occurred. Please try again.');
      }
    },
    onError: (error) => {
      console.error('❌ Login Failed:', error);
      alert('❌ Google login failed. Please try again.');
    }
  });

  return (
    <div className="auth-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login with Google</h2>
      <button onClick={() => login()}>Login with Google (Drive & Profile Access)</button>
    </div>
  );
}
