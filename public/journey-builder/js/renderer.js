import { COMPONENTS } from './component-catalog.js';
import { state } from './state.js';
import { buildOutput } from './flow-model.js';
import { byId, cloneTemplate } from './dom.js';
import { updateConfigurationEditor } from './configuration-editor.js';

const pagesList = byId('pages-list');
const stepsList = byId('steps-list');
const flowIndexList = byId('flow-index-list');
let pageIndexObserver;
const intersectingPages = new Map();

const setActiveIndexPage = pageIndex => {
  flowIndexList.querySelectorAll('.flow-index-link').forEach(button => {
    if (Number(button.dataset.pageIndex) === pageIndex) {
      button.setAttribute('aria-current', 'location');
    } else {
      button.removeAttribute('aria-current');
    }
  });
};

export const setValidationMessage = (container, message, type) => {
  const item = document.createElement('div');
  item.className = `validation-message validation-${type}`;
  item.textContent = message;
  container.append(item);
};

export const renderPreview = () => {
  const { errors, warnings, flow, catalogEntry } = buildOutput();
  const messages = byId('validation-messages');
  messages.replaceChildren();

  errors.forEach(message => setValidationMessage(messages, message, 'error'));
  warnings.forEach(message => setValidationMessage(messages, message, 'warning'));
  if (!errors.length && !warnings.length) setValidationMessage(messages, 'Referencias y estructura correctas.', 'success');

  const badge = byId('validation-badge');
  badge.textContent = errors.length
    ? `${errors.length} error${errors.length === 1 ? '' : 'es'}`
    : warnings.length
      ? 'Válido con avisos'
      : 'Válido';
  badge.className = `status-badge ${errors.length ? 'status-invalid' : 'status-valid'}`;
  byId('json-preview').value = JSON.stringify(flow, null, 2);
  byId('catalog-preview').value = JSON.stringify({ [state.key]: catalogEntry }, null, 2);
  byId('download-journey').disabled = errors.length > 0;
  byId('download-catalog').disabled = errors.length > 0;
  return { errors, warnings, flow, catalogEntry };
};

export const renderHomePageOptions = () => {
  const select = byId('home-page');
  const current = state.homePageId;
  select.replaceChildren(...state.pages.map(page => new Option(page.pageId || '(sin ID)', page.pageId)));
  if (state.pages.some(page => page.pageId === current)) {
    select.value = current;
  } else {
    select.value = state.pages[0]?.pageId ?? '';
  }
  state.homePageId = select.value;
};

export const updatePageToggleAllButton = () => {
  const button = byId('toggle-all-pages');
  const hasPages = state.pages.length > 0;
  const allCollapsed = hasPages && state.pages.every(page => page.collapsed);
  button.disabled = !hasPages;
  button.textContent = allCollapsed ? 'Expandir todas' : 'Contraer todas';
  button.setAttribute('aria-expanded', String(hasPages && !allCollapsed));
};

export const renderPageIndex = () => {
  flowIndexList.replaceChildren();
  byId('flow-index-count').textContent = String(state.pages.length);
  state.pages.forEach((page, pageIndex) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const number = document.createElement('span');
    const details = document.createElement('span');
    const pageId = document.createElement('span');
    const component = document.createElement('span');
    const componentLabel = COMPONENTS.find(entry => entry.id === page.component)?.label ?? page.component;

    button.className = 'flow-index-link';
    button.type = 'button';
    button.dataset.pageIndex = pageIndex;
    button.setAttribute(
      'aria-label',
      `Ir a página ${pageIndex + 1}: ${page.pageId || 'sin ID'}, ${componentLabel}${page.pageId === state.homePageId ? ', página inicial' : ''}`
    );
    number.className = 'flow-index-number';
    number.textContent = String(pageIndex + 1);
    details.className = 'flow-index-details';
    pageId.className = 'flow-index-page-id';
    pageId.textContent = page.pageId || '(sin ID)';
    component.className = 'flow-index-component';
    component.textContent = componentLabel;
    details.append(pageId, component);
    button.append(number, details);
    item.append(button);
    flowIndexList.append(item);
  });

  pageIndexObserver?.disconnect();
  intersectingPages.clear();
  const homePageIndex = state.pages.findIndex(page => page.pageId === state.homePageId);
  setActiveIndexPage(homePageIndex >= 0 ? homePageIndex : 0);
  if ('IntersectionObserver' in window) {
    pageIndexObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const pageIndex = Number(entry.target.dataset.pageIndex);
        if (entry.isIntersecting) {
          intersectingPages.set(pageIndex, entry.boundingClientRect.top);
        } else {
          intersectingPages.delete(pageIndex);
        }
      });
      const active = [...intersectingPages].sort((first, second) => first[1] - second[1])[0];
      if (active) setActiveIndexPage(active[0]);
    }, { rootMargin: '-15% 0px -70% 0px' });
    pagesList.querySelectorAll('.page-card').forEach(card => pageIndexObserver.observe(card));
  }
};

export const renderPages = () => {
  pagesList.replaceChildren();
  state.pages.forEach((page, pageIndex) => {
    const card = cloneTemplate('page-template');
    card.id = `page-card-${pageIndex}`;
    card.dataset.pageIndex = pageIndex;
    const pageName = page.pageId || `página ${pageIndex + 1}`;
    const toggle = card.querySelector('.page-toggle');
    const content = card.querySelector('.page-content');
    card.classList.toggle('is-collapsed', Boolean(page.collapsed));
    toggle.dataset.pageIndex = pageIndex;
    toggle.setAttribute('aria-expanded', String(!page.collapsed));
    toggle.setAttribute('aria-label', `${page.collapsed ? 'Expandir' : 'Contraer'} ${pageName}`);
    content.id = `page-content-${pageIndex}`;
    content.hidden = Boolean(page.collapsed);
    toggle.setAttribute('aria-controls', content.id);
    card.querySelector('.page-number').textContent = `Página ${pageIndex + 1}`;
    card.querySelector('.page-id').value = page.pageId;
    card.querySelector('.page-id').dataset.pageIndex = pageIndex;
    card.querySelector('.page-summary-id').textContent = page.pageId || '(sin ID)';

    const componentSelect = card.querySelector('.page-component');
    componentSelect.dataset.pageIndex = pageIndex;
    COMPONENTS.forEach(component => componentSelect.add(new Option(component.label, component.id)));
    componentSelect.value = page.component;
    card.querySelector('.page-summary-component').textContent =
      COMPONENTS.find(component => component.id === page.component)?.label ?? page.component;

    const configuration = card.querySelector('.page-configuration');
    configuration.value = page.configurationRaw;
    configuration.dataset.pageIndex = pageIndex;
    const configurationStatus = card.querySelector('.configuration-status');
    configurationStatus.id = `page-configuration-status-${pageIndex}`;
    updateConfigurationEditor(configuration);
    card.querySelector('.remove-page').dataset.pageIndex = pageIndex;
    card.querySelector('.add-route').dataset.pageIndex = pageIndex;

    const routes = card.querySelector('.routes-list');
    page.routes.forEach((route, routeIndex) => {
      const routeCard = cloneTemplate('route-template');
      routeCard.querySelector('.route-title').textContent = `Ruta ${routeIndex + 1}`;
      const target = routeCard.querySelector('.route-target');
      target.dataset.pageIndex = pageIndex;
      target.dataset.routeIndex = routeIndex;
      target.add(new Option('Seleccionar destino…', ''), 0);
      state.pages.forEach(item => target.add(new Option(item.pageId || '(sin ID)', item.pageId)));
      target.value = route.nextPageId;
      routeCard.querySelector('.add-condition').dataset.pageIndex = pageIndex;
      routeCard.querySelector('.add-condition').dataset.routeIndex = routeIndex;
      const conditionsList = routeCard.querySelector('.conditions-list');
      route.conditions.forEach((condition, conditionIndex) => {
        const conditionRow = cloneTemplate('condition-template');
        const conditionControls = [
          ['.condition-union-input', 'union'],
          ['.condition-expression-input', 'expression'],
          ['.condition-operation-input', 'operation'],
          ['.condition-value-input', 'value'],
          ['.condition-type-input', 'valueType']
        ];
        conditionControls.forEach(([selector, field]) => {
          const control = conditionRow.querySelector(selector);
          control.dataset.pageIndex = pageIndex;
          control.dataset.routeIndex = routeIndex;
          control.dataset.conditionIndex = conditionIndex;
          control.value = condition[field] ?? '';
        });
        const removeCondition = conditionRow.querySelector('.remove-condition');
        removeCondition.dataset.pageIndex = pageIndex;
        removeCondition.dataset.routeIndex = routeIndex;
        removeCondition.dataset.conditionIndex = conditionIndex;
        conditionsList.append(conditionRow);
      });

      ['remove-route', 'move-route-up', 'move-route-down'].forEach(className => {
        routeCard.querySelector(`.${className}`).dataset.pageIndex = pageIndex;
        routeCard.querySelector(`.${className}`).dataset.routeIndex = routeIndex;
      });
      routeCard.querySelector('.move-route-up').disabled = routeIndex === 0;
      routeCard.querySelector('.move-route-down').disabled = routeIndex === page.routes.length - 1;
      routes.append(routeCard);
    });
    pagesList.append(card);
  });

  renderPageIndex();
  updatePageToggleAllButton();
  renderHomePageOptions();
  renderSteps();
};

export const renderSteps = () => {
  stepsList.replaceChildren();
  state.steps.forEach((step, stepIndex) => {
    const card = cloneTemplate('step-template');
    card.querySelector('.step-number').textContent = `Paso ${stepIndex + 1}`;
    card.querySelector('.remove-step').dataset.stepIndex = stepIndex;
    const stepperId = card.querySelector('.stepper-id');
    stepperId.value = step.id;
    stepperId.dataset.stepIndex = stepIndex;
    const label = card.querySelector('.step-label');
    label.value = step.label;
    label.dataset.stepIndex = stepIndex;
    const labelType = card.querySelector('.step-label-type');
    labelType.value = step.labelType;
    labelType.dataset.stepIndex = stepIndex;
    const inherited = card.querySelector('.step-inherited');
    inherited.value = step.inherited;
    inherited.dataset.stepIndex = stepIndex;
    const pages = card.querySelector('.step-pages');
    if (!state.pages.length) {
      pages.textContent = 'Añade páginas para asignarlas a este paso.';
    } else {
      state.pages.forEach(page => {
        const option = document.createElement('label');
        option.className = 'step-page-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = page.pageId;
        checkbox.checked = step.pages.includes(page.pageId);
        checkbox.dataset.stepIndex = stepIndex;
        option.append(checkbox, document.createTextNode(page.pageId || '(sin ID)'));
        pages.append(option);
      });
    }
    stepsList.append(card);
  });
  byId('empty-steps').hidden = state.steps.length > 0;
};

export const refresh = () => {
  renderPages();
  updateConfigurationEditor(byId('flow-extras'));
  renderPreview();
};
