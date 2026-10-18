import { byId } from './dom.js';

const dialog = byId('confirmation-dialog');
const title = byId('confirmation-title');
const message = byId('confirmation-message');
const cancelButton = byId('confirmation-cancel');
const acceptButton = byId('confirmation-accept');

let resolveConfirmation;

const finishConfirmation = confirmed => {
  if (!resolveConfirmation) return;
  const resolve = resolveConfirmation;
  resolveConfirmation = undefined;
  dialog.close();
  resolve(confirmed);
};

cancelButton.addEventListener('click', () => finishConfirmation(false));
acceptButton.addEventListener('click', () => finishConfirmation(true));
dialog.addEventListener('click', event => {
  if (event.target === dialog) finishConfirmation(false);
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    finishConfirmation(false);
  }
});
dialog.addEventListener('close', () => {
  if (resolveConfirmation) finishConfirmation(false);
});

export const confirmAction = ({ titleText, messageText, confirmText = 'Continue', destructive = false }) => {
  if (resolveConfirmation) {
    throw new Error('A confirmation dialog is already open.');
  }

  title.textContent = titleText;
  message.textContent = messageText;
  acceptButton.textContent = confirmText;
  acceptButton.classList.toggle('button-danger', destructive);
  dialog.classList.toggle('is-destructive', destructive);

  return new Promise(resolve => {
    resolveConfirmation = resolve;
    dialog.showModal();
    cancelButton.focus();
  });
};
