// index.js
// 
// Description: Electron main process for the distributed VM system UI
// 
// This file is the main entry point for the Electron application that provides
// the desktop interface for the distributed VM system. It creates the main
// browser window and loads the HTML interface.
// 
// Configuration:
//   - Window size: 1200x800 pixels
//   - Node integration enabled for backend access
//   - Loads local HTML file as the interface
// 
// Inputs: None (starts automatically when app is ready)
// Outputs: 
//   - Main application window
//   - Desktop UI for VM management
//   - Integration with Node.js backend
// 
// Dependencies:
//   - electron (desktop app framework)
//   - index.html (user interface)

const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
});