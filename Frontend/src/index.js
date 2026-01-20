import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Define the polyfill AFTER imports but BEFORE rendering
window.process = {
  env: {
    NODE_ENV: 'development',
    REACT_APP_BACKEND_URL: "http://localhost:4000" // Fallback
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>  
);

reportWebVitals();