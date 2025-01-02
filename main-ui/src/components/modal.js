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
