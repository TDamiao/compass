const dialog = document.querySelector('.cc-dialog');
const trigger = document.querySelector('[data-open-dialog]');
const status = document.querySelector('[data-demo-status]');
trigger?.addEventListener('click', () => dialog?.showModal());
dialog?.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.classList.contains('cc-dialog__confirm')) {
      status.textContent = 'Demo only: connect this action to the project archive operation.';
    }
    dialog.close();
  });
});
dialog?.addEventListener('close', () => trigger?.focus());
