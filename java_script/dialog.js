(() => {
  const dialog = document.getElementById('imprintDialog');
  const openButton = document.querySelector('[data-dialog-open="imprintDialog"]');
  const closeButton = dialog?.querySelector('[data-dialog-close]');

  openButton?.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }
  });

  openButton?.addEventListener('click', () => dialog?.showModal());
  closeButton?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    dialog.close();
  });
})();
