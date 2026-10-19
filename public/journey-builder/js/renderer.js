import { COMPONENTS } from './component-catalog.js';
import { state } from './state.js';
import { buildOutput } from './flow-model.js';
import { byId, cloneTemplate } from './dom.js';
import { updateConfigurationEditor } from './configuration-editor.js';
import { renderFlowDiagram } from './flow-diagram.js';

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
  if (!errors.length && !warnings.length) setValidationMessage(messages, 'References and structure are valid.', 'success');

  const badge = byId('validation-badge');
  badge.textContent = errors.length
    ? `${errors.length} error${errors.length === 1 ? '' : 's'}`
    : warnings.length
      ? 'Valid with warnings'
      : 'Valid';
  badge.className = `status-badge ${errors.length ? 'status-invalid' : 'status-valid'}`;
  byId('json-preview').value = JSON.stringify(flow, null, 2);
  byId('catalog-preview').value = JSON.stringify({ [state.key]: catalogEntry }, null, 2);
  renderFlowDiagram(flow);
  byId('download-journey').disabled = errors.length > 0;
  byId('download-catalog').disabled = errors.length > 0;
  return { errors, warnings, flow, catalogEntry };
};

export const renderHomePageOptions = () => {
  const select = byId('home-page');
  const current = state.homePageId;
  select.replaceChildren(...state.pages.map(page => new Option(page.pageId || '(no ID)', page.pageId)));
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
  button.textContent = allCollapsed ? 'Expand all' : 'Collapse all';
  button.setAttribute('aria-expanded', String(hasPages && !allCollapsed));
};

export const updateStepperToggleAllButton = () => {
  const button = byId('toggle-all-steppers');
  const ids = [...new Set(state.steps.map(step => step.id))];
  const hasSteppers = ids.length > 0;
  const allCollapsed = hasSteppers && ids.every(id => state.collapsedSteppers[id]);
  button.disabled = !hasSteppers;
  button.textContent = allCollapsed ? 'Expand all' : 'Collapse all';
  button.setAttribute('aria-expanded', String(hasSteppers && !allCollapsed));
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
      `Go to page ${pageIndex + 1}: ${page.pageId || 'no ID'}, ${componentLabel}${page.pageId === state.homePageId ? ', home page' : ''}`
    );
    number.className = 'flow-index-number';
    number.textContent = String(pageIndex + 1);
    details.className = 'flow-index-details';
    pageId.className = 'flow-index-page-id';
    pageId.textContent = page.pageId || '(no ID)';
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
    const pageName = page.pageId || `page ${pageIndex + 1}`;
    const toggle = card.querySelector('.page-toggle');
    const content = card.querySelector('.page-content');
    card.classList.toggle('is-collapsed', Boolean(page.collapsed));
    toggle.dataset.pageIndex = pageIndex;
    toggle.setAttribute('aria-expanded', String(!page.collapsed));
    toggle.setAttribute('aria-label', `${page.collapsed ? 'Expand' : 'Collapse'} ${pageName}`);
    content.id = `page-content-${pageIndex}`;
    content.hidden = Boolean(page.collapsed);
    toggle.setAttribute('aria-controls', content.id);
    card.querySelector('.page-number').textContent = `Page ${pageIndex + 1}`;
    card.querySelector('.page-id').value = page.pageId;
    card.querySelector('.page-id').dataset.pageIndex = pageIndex;
    card.querySelector('.page-summary-id').textContent = page.pageId || '(no ID)';

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
      routeCard.querySelector('.route-title').textContent = `Route ${routeIndex + 1}`;
      const target = routeCard.querySelector('.route-target');
      target.dataset.pageIndex = pageIndex;
      target.dataset.routeIndex = routeIndex;
      target.add(new Option('Select destination…', ''), 0);
      state.pages.forEach(item => target.add(new Option(item.pageId || '(no ID)', item.pageId)));
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
  const groups = new Map();
  state.steps.forEach((step, stepIndex) => {
    if (!groups.has(step.id)) groups.set(step.id, []);
    groups.get(step.id).push({ step, stepIndex });
  });
  Object.keys(state.collapsedSteppers).forEach(id => {
    if (!groups.has(id)) delete state.collapsedSteppers[id];
  });

  groups.forEach((group, id) => {
    const stepper = cloneTemplate('stepper-template');
    const stepIndices = group.map(({ stepIndex }) => stepIndex).join(',');
    const collapsed = Boolean(state.collapsedSteppers[id]);
    const content = stepper.querySelector('.stepper-content');
    const toggle = stepper.querySelector('.stepper-toggle');
    const stepList = stepper.querySelector('.stepper-steps-list');
    const stepperName = id || '(no ID)';
    stepper.classList.toggle('is-collapsed', collapsed);
    content.hidden = collapsed;
    content.id = `stepper-content-${encodeURIComponent(id || 'empty')}`;
    toggle.dataset.stepperId = id;
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-controls', content.id);
    toggle.setAttribute('aria-label', `${collapsed ? 'Expand' : 'Collapse'} stepper ${stepperName}`);
    stepper.querySelector('.stepper-summary').textContent = `${stepperName} · ${group.length} ${group.length === 1 ? 'step' : 'steps'}`;
    const stepperId = stepper.querySelector('.stepper-id');
    stepperId.value = id;
    stepperId.dataset.stepIndices = stepIndices;
    const inherited = stepper.querySelector('.step-inherited');
    inherited.value = group[0].step.inherited;
    inherited.dataset.stepIndices = stepIndices;
    stepper.querySelector('.add-step').dataset.stepperId = id;

    group.forEach(({ step, stepIndex }, groupStepIndex) => {
      const card = cloneTemplate('step-template');
      card.querySelector('.step-number').textContent = `Step ${groupStepIndex + 1}`;
      card.querySelector('.remove-step').dataset.stepIndex = stepIndex;
      const label = card.querySelector('.step-label');
      label.value = step.label;
      label.dataset.stepIndex = stepIndex;
      const labelType = card.querySelector('.step-label-type');
      labelType.value = step.labelType;
      labelType.dataset.stepIndex = stepIndex;
      const pages = card.querySelector('.step-pages');
      if (!state.pages.length) {
        pages.textContent = 'Add pages to assign them to this step.';
      } else {
        state.pages.forEach(page => {
          const option = document.createElement('label');
          option.className = 'step-page-option';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = page.pageId;
          checkbox.checked = step.pages.includes(page.pageId);
          checkbox.dataset.stepIndex = stepIndex;
          option.append(checkbox, document.createTextNode(page.pageId || '(no ID)'));
          pages.append(option);
        });
      }
      stepList.append(card);
    });

    stepsList.append(stepper);
  });
  byId('empty-steps').hidden = state.steps.length > 0;
  updateStepperToggleAllButton();
};

export const refresh = () => {
  renderPages();
  updateConfigurationEditor(byId('flow-extras'));
  renderPreview();
};
