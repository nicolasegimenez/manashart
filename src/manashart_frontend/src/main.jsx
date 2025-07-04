import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import App instead of ManashartApp
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);