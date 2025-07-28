// Import React and render the app
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './styles.css';

// 
// Description: Main entry point for the Super VM Dashboard React application
//
// This file initializes the React application and renders the main App component
// with all necessary providers and configurations.
//
// Features:
//   - React 18 with concurrent features
//   - Strict mode for development
//   - Global CSS imports
//   - Error boundaries
//
// Inputs: None (application entry point)
// Outputs: Rendered React application
//
// Dependencies:
//   - React and ReactDOM
//   - App component
//   - Global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);