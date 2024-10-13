import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RecoilRoot } from 'recoil';

const google_client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <GoogleOAuthProvider clientId={google_client_id}>
        <App />
      </GoogleOAuthProvider>;
    </RecoilRoot>
  </React.StrictMode>,
)
