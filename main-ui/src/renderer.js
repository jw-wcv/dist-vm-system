// renderer.js
// 
// Description: Electron renderer process for UI interactions
// 
// This file handles the renderer process side of the Electron application,
// managing UI interactions and communication with the main process through
// IPC (Inter-Process Communication).
// 
// Functionality:
//   - Listens for DOM content loaded event
//   - Sets up IPC communication with main process
//   - Updates status text based on messages from main process
//   - Provides real-time status updates to the user interface
// 
// Inputs: 
//   - IPC messages from main process
//   - DOM events (DOMContentLoaded)
// Outputs: 
//   - Updated status text in the UI
//   - Real-time status display
// 
// Dependencies:
//   - electron (ipcRenderer)
//   - HTML elements with id 'status'

const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status');
  ipcRenderer.on('update-status', (event, message) => {
    statusText.innerText = message;
  });
});