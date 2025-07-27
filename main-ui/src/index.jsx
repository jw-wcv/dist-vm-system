// index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
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

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);