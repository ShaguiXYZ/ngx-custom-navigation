const loadFragment = async target => {
  const path = target.dataset.include;
  const response = await fetch(new URL(path, document.baseURI));

  if (!response.ok) {
    throw new Error(`Failed to load "${path}" (${response.status} ${response.statusText}).`);
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
  status.textContent = `Journey Builder could not start. ${error.message} Make sure the app is served over HTTP, then reload the page.`;
  console.error('Journey Builder could not start.', error);
});
