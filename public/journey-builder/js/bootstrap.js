const loadFragment = async target => {
  const path = target.dataset.include;
  const response = await fetch(new URL(path, document.baseURI));

  if (!response.ok) {
    throw new Error(`No se pudo cargar "${path}" (${response.status} ${response.statusText}).`);
  }

  target.innerHTML = await response.text();
};

const start = async () => {
  const targets = [...document.querySelectorAll('[data-include]')];

  await Promise.all(targets.map(loadFragment));
  await import('./app.js');
};

start().catch(error => {
  const status = document.querySelector('[data-app-status]');

  status.hidden = false;
  status.textContent = `No se pudo iniciar Journey Builder. ${error.message} Comprueba que la aplicación se sirve por HTTP y vuelve a cargar la página.`;
  console.error('No se pudo iniciar Journey Builder.', error);
});
