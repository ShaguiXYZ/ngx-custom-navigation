import { COMPONENTS } from './component-catalog.js';
import { state } from './state.js';
import { byId } from './dom.js';
import { updateConfigurationEditor } from './configuration-editor.js';
import {
  renderHomePageOptions,
  renderPageIndex,
  renderPreview,
  renderSteps,
  refresh,
  updatePageToggleAllButton
} from './renderer.js';
import { downloadCatalogEntry, downloadJourney } from './file-operations.js';

const stepsList = byId('steps-list');

const updatePageField = (target, field) => {
  const page = state.pages[Number(target.dataset.pageIndex)];
  if (!page) return;
  const previousId = page.pageId;
  page[field] = target.value;
  const pageCard = target.closest('.page-card');
  if (field === 'pageId') {
    pageCard.querySelector('.page-summary-id').textContent = target.value || '(sin ID)';
  }
  if (field === 'component') {
    pageCard.querySelector('.page-summary-component').textContent =
      COMPONENTS.find(component => component.id === target.value)?.label ?? target.value;
    renderPageIndex();
  }
  if (field === 'pageId') {
    state.pages.forEach(item =>
      item.routes.forEach(route => {
        if (route.nextPageId === previousId) route.nextPageId = target.value;
      })
    );
    state.steps.forEach(step => {
      step.pages = step.pages.map(pageId => (pageId === previousId ? target.value : pageId));
    });
    if (state.homePageId === previousId) state.homePageId = target.value;
    renderHomePageOptions();
    renderSteps();
  }
  if (field === 'pageId') renderPageIndex();
};

export const handleEditorInput = event => {
  const target = event.target;
  if (
    target.matches(
      '#journey-key, #journey-id, #journey-name, #journey-version, #journey-title, #journey-breakingchange'
    )
  ) {
    if (target.id === 'journey-name') target.value = target.value.replace(/\.json$/i, '');
    renderPreview();
    return;
  }
  if (target.matches('#flow-extras')) {
    state.flowExtrasRaw = target.value;
    renderPreview();
    return;
  }
  if (target.matches('#journey-title-type')) {
    state.titleType = target.value;
    renderPreview();
    return;
  }
  if (target.matches('#home-page')) {
    state.homePageId = target.value;
    renderPageIndex();
    renderPreview();
    return;
  }
  if (target.matches('.page-id')) updatePageField(target, 'pageId');
  if (target.matches('.page-component')) updatePageField(target, 'component');
  if (target.matches('.page-configuration')) {
    updatePageField(target, 'configurationRaw');
    updateConfigurationEditor(target);
  }

  const pageIndex = Number(target.dataset.pageIndex);
  const routeIndex = Number(target.dataset.routeIndex);
  const route = state.pages[pageIndex]?.routes[routeIndex];
  if (route) {
    if (target.matches('.route-target')) route.nextPageId = target.value;
    const condition = route.conditions[Number(target.dataset.conditionIndex)];
    if (condition) {
      if (target.matches('.condition-union-input')) condition.union = target.value;
      if (target.matches('.condition-expression-input')) condition.expression = target.value;
      if (target.matches('.condition-operation-input')) condition.operation = target.value;
      if (target.matches('.condition-value-input')) condition.value = target.value;
      if (target.matches('.condition-type-input')) condition.valueType = target.value;
    }
  }
  const stepIndex = Number(target.dataset.stepIndex);
  const step = state.steps[stepIndex];
  if (step) {
    if (target.matches('.stepper-id')) step.id = target.value;
    if (target.matches('.step-label')) step.label = target.value;
    if (target.matches('.step-label-type')) step.labelType = target.value;
    if (target.matches('.step-inherited')) step.inherited = target.value;
    if (target.matches('.step-pages input')) {
      step.pages = [...stepsList.querySelectorAll(`.step-pages input[data-step-index="${stepIndex}"]:checked`)].map(input => input.value);
    }
  }
  renderPreview();
};

export const handleEditorClick = event => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.matches('.flow-index-link')) {
    const pageIndex = Number(button.dataset.pageIndex);
    const page = state.pages[pageIndex];
    const card = document.getElementById(`page-card-${pageIndex}`);
    if (!page || !card) return;
    if (page.collapsed) {
      page.collapsed = false;
      card.classList.remove('is-collapsed');
      card.querySelector('.page-content').hidden = false;
      const toggle = card.querySelector('.page-toggle');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', `Contraer ${page.pageId || `página ${pageIndex + 1}`}`);
      updatePageToggleAllButton();
    }
    card.querySelector('.page-toggle').focus({ preventScroll: true });
    card.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }

  if (button.matches('.page-toggle')) {
    const page = state.pages[Number(button.dataset.pageIndex)];
    if (!page) return;
    page.collapsed = !page.collapsed;
    const content = button.closest('.page-card').querySelector('.page-content');
    content.hidden = page.collapsed;
    button.setAttribute('aria-expanded', String(!page.collapsed));
    button.setAttribute('aria-label', `${page.collapsed ? 'Expandir' : 'Contraer'} ${page.pageId || 'página'}`);
    button.closest('.page-card').classList.toggle('is-collapsed', page.collapsed);
    updatePageToggleAllButton();
    return;
  }
  if (button.id === 'toggle-all-pages') {
    const collapse = state.pages.some(page => !page.collapsed);
    state.pages.forEach(page => {
      page.collapsed = collapse;
    });
    refresh();
    return;
  }
  if (button.id === 'add-page') {
    const component = COMPONENTS.find(item => item.id === 'is-client');
    const usedIds = new Set(state.pages.map(page => page.pageId));
    let pageId = component.id;
    let suffix = 2;
    while (usedIds.has(pageId)) pageId = `${component.id}-${suffix++}`;
    state.pages.push({ pageId, component: component.id, extras: {}, configurationRaw: '', routes: [], collapsed: false });
    refresh();
    return;
  }
  if (button.matches('.remove-page')) {
    const index = Number(button.dataset.pageIndex);
    const [removed] = state.pages.splice(index, 1);
    state.pages.forEach(page => {
      page.routes = page.routes.filter(route => route.nextPageId !== removed.pageId);
    });
    state.steps.forEach(step => {
      step.pages = step.pages.filter(pageId => pageId !== removed.pageId);
    });
    refresh();
    return;
  }
  if (button.matches('.add-route')) {
    state.pages[Number(button.dataset.pageIndex)]?.routes.push({
      nextPageId: '',
      extras: {},
      conditions: []
    });
    refresh();
    return;
  }
  if (button.matches('.remove-route')) {
    state.pages[Number(button.dataset.pageIndex)]?.routes.splice(Number(button.dataset.routeIndex), 1);
    refresh();
    return;
  }
  if (button.matches('.add-condition')) {
    state.pages[Number(button.dataset.pageIndex)]?.routes[Number(button.dataset.routeIndex)]?.conditions.push({
      union: '',
      expression: '',
      operation: '',
      value: '',
      valueType: 'string'
    });
    refresh();
    return;
  }
  if (button.matches('.remove-condition')) {
    state.pages[Number(button.dataset.pageIndex)]?.routes[Number(button.dataset.routeIndex)]?.conditions.splice(
      Number(button.dataset.conditionIndex),
      1
    );
    refresh();
    return;
  }
  if (button.matches('.move-route-up, .move-route-down')) {
    const page = state.pages[Number(button.dataset.pageIndex)];
    const index = Number(button.dataset.routeIndex);
    const destination = index + (button.matches('.move-route-up') ? -1 : 1);
    if (page && destination >= 0 && destination < page.routes.length) {
      [page.routes[index], page.routes[destination]] = [page.routes[destination], page.routes[index]];
    }
    refresh();
    return;
  }
  if (button.id === 'add-step') {
    state.steps.push({ id: 'main', inherited: '', extras: {}, label: '', labelType: 'translate', pages: [] });
    renderSteps();
    renderPreview();
    return;
  }
  if (button.matches('.remove-step')) {
    state.steps.splice(Number(button.dataset.stepIndex), 1);
    renderSteps();
    renderPreview();
    return;
  }
  if (button.id === 'import-journey-button') byId('import-journey-file').click();
  if (button.id === 'download-journey') downloadJourney();
  if (button.id === 'download-catalog') downloadCatalogEntry();
};
