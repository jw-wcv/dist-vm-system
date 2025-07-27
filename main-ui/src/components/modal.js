// modal.js
// 
// Description: Modal dialog component for user interface feedback
// 
// This module provides modal dialog functionality for the main UI application,
// creating and managing popup dialogs for user interactions, status updates,
// and loading indicators during asynchronous operations.
// 
// Functions:
//   - createModal({ title, body, showSpinner }): Creates and displays a modal dialog
//     Inputs: 
//       - title: String for modal header
//       - body: HTML content for modal body
//       - showSpinner: Boolean to show loading spinner (default: false)
//     Outputs: Modal DOM element for later removal
// 
//   - removeModal(modal): Removes a modal dialog from the DOM
//     Inputs: Modal DOM element to remove
//     Outputs: None (removes element from page)
// 
// Features:
//   - Dynamic modal creation with custom content
//   - Optional loading spinner for async operations
//   - Close button for user dismissal
//   - Backdrop styling for focus
//   - Safe removal with parent node checking
// 
// Usage: Used throughout the application for user feedback during VM operations

export function createModal({ title, body, showSpinner = false }) {
    const modal = document.createElement('div');
    modal.classList.add('modal-backdrop');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;
    modalContent.appendChild(modalTitle);

    const modalBody = document.createElement('div');
    modalBody.innerHTML = body;
    modalContent.appendChild(modalBody);

    if (showSpinner) {
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        modalBody.appendChild(spinner);
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => document.body.removeChild(modal));
    modalContent.appendChild(closeButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    return modal;
}

export function removeModal(modal) {
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
}
