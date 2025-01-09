const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status');
  ipcRenderer.on('update-status', (event, message) => {
    statusText.innerText = message;
  });
});