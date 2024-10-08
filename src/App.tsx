import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';

function App() {
  const navigate = useNavigate();

  // Function to extract query parameters from the URL
  const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Function to fetch access token using the authorization code
  const fetchAccessToken = async (code: string) => {
    try {
      console.log('Fetching access token');
      const response = await fetch(
        'https://api.instagram.com/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: '1231880454905209',
            client_secret: 'fda41c71b14e73a2ca880b7c2038f6c4', // Replace with your Instagram app's client secret
            grant_type: 'authorization_code',
            redirect_uri: 'https://meta-api-poc.vercel.app/',
            code: code,
          }),
        }
      );

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('instagram_access_token', data.access_token);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  useEffect(() => {
    console.log('Use effect');
    const accessToken = localStorage.getItem('instagram_access_token');
    const code = getQueryParam('code');

    // Redirect to Home if access token is already present
    if (accessToken) {
      navigate('/home');
    }

    // If the code is present in the URL, fetch access token
    if (code) {
      fetchAccessToken(code);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '100vh',
              alignItems: 'center',
            }}
          >
            <a href="https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1231880454905209&redirect_uri=https://meta-api-poc.vercel.app/&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish">
              <button
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Login with Instagram
              </button>
            </a>
          </div>
        }
      />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
