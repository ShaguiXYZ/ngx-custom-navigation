import { COMPONENTS } from './component-catalog.js';
import { updateConfigurationEditor } from './configuration-editor.js';
import { byId } from './dom.js';
import { downloadCatalogEntry, downloadJourney } from './file-operations.js';
import { confirmAction } from './confirmation.js';
import {
  refresh,
  renderHomePageOptions,
  renderPageIndex,
  renderPreview,
  renderSteps,
  updatePageToggleAllButton,
  updateStepperToggleAllButton
} from './renderer.js';
import { state } from './state.js';

const stepsList = byId('steps-list');

const updatePageField = (target, field) => {
  const page = state.pages[Number(target.dataset.pageIndex)];
  if (!page) return;
  const previousId = page.pageId;
  page[field] = target.value;
  const pageCard = target.closest('.page-card');
  if (field === 'pageId') {
    pageCard.querySelector('.page-summary-id').textContent = target.value || '(no ID)';
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
  if (field === 'pageId') {
    renderPageIndex();
    updateConfigurationEditor(byId('flow-extras'));
  }
};

export const handleEditorInput = async event => {
  const target = event.target;
  if (target.matches('#journey-key, #journey-id, #journey-name, #journey-version, #journey-title, #journey-breakingchange')) {
    if (target.id === 'journey-name') target.value = target.value.replace(/\.json$/i, '');
    renderPreview();
    return;
  }
  if (target.matches('#flow-extras')) {
    state.flowExtrasRaw = target.value;
    updateConfigurationEditor(target);
    renderPreview();
    return;
  }
  if (target.matches('#journey-title-type')) {
    state.titleType = target.value;
    renderPreview();
    return;
  }
  if (target.matches('#home-page')) {
    if (event.type === 'input') return;
    if (
      target.value !== state.homePageId &&
      !(await confirmAction({
        titleText: 'Change home page?',
        messageText: `Change the home page from "${state.homePageId}" to "${target.value}"? This changes where the journey starts.`,
        confirmText: 'Change home page'
      }))
    ) {
      target.value = state.homePageId;
      return;
    }
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
    if (target.matches('.route-target')) {
      if (event.type === 'input') return;
      if (
        target.value !== route.nextPageId &&
        !(await confirmAction({
          titleText: 'Change route destination?',
          messageText: `Change the destination of this route from "${route.nextPageId || '(none)'}" to "${target.value || '(none)'}"? This changes the journey flow.`,
          confirmText: 'Change destination'
        }))
      ) {
        target.value = route.nextPageId;
        return;
      }
      route.nextPageId = target.value;
    }
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
    if (target.matches('.step-label')) step.label = target.value;
    if (target.matches('.step-label-type')) step.labelType = target.value;
    if (target.matches('.step-pages input')) {
      step.pages = [...stepsList.querySelectorAll(`.step-pages input[data-step-index="${stepIndex}"]:checked`)].map(input => input.value);
    }
  }
  if (target.matches('.stepper-id, .step-inherited')) {
    const stepIndices = target.dataset.stepIndices.split(',').map(Number);
    const previousId = state.steps[stepIndices[0]]?.id;
    stepIndices.forEach(index => {
      const groupedStep = state.steps[index];
      if (!groupedStep) return;
      if (target.matches('.stepper-id')) groupedStep.id = target.value;
      else groupedStep.inherited = target.value;
    });
    if (event.type === 'change' && target.matches('.stepper-id')) {
      if (
        previousId !== target.value &&
        state.collapsedSteppers[previousId] !== undefined &&
        state.collapsedSteppers[target.value] === undefined
      ) {
        state.collapsedSteppers[target.value] = state.collapsedSteppers[previousId];
      }
      if (previousId !== target.value && !state.steps.some(item => item.id === previousId)) {
        delete state.collapsedSteppers[previousId];
      }
      renderSteps();
    }
  }
  renderPreview();
};

export const handleEditorClick = async event => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.matches('.flow-index-link, .flow-diagram-node')) {
    const pageIndex = Number(button.dataset.pageIndex);
    const page = state.pages[pageIndex];
    const card = document.getElementById(`page-card-${pageIndex}`);
    if (!page || !card) return;
    if (button.matches('.flow-diagram-node')) button.closest('dialog')?.close();
    if (page.collapsed) {
      page.collapsed = false;
      card.classList.remove('is-collapsed');
      card.querySelector('.page-content').hidden = false;
      const toggle = card.querySelector('.page-toggle');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', `Collapse ${page.pageId || `page ${pageIndex + 1}`}`);
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
    button.setAttribute('aria-label', `${page.collapsed ? 'Expand' : 'Collapse'} ${page.pageId || 'page'}`);
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
  if (button.id === 'toggle-all-steppers') {
    const ids = [...new Set(state.steps.map(step => step.id))];
    const collapse = ids.some(id => !state.collapsedSteppers[id]);
    ids.forEach(id => {
      state.collapsedSteppers[id] = collapse;
    });
    renderSteps();
    return;
  }
  if (button.matches('.stepper-toggle')) {
    const id = button.dataset.stepperId;
    state.collapsedSteppers[id] = !state.collapsedSteppers[id];
    renderSteps();
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
    const page = state.pages[index];
    const homePageWarning = page?.pageId === state.homePageId ? ' You will need to choose a new home page.' : '';
    if (
      !page ||
      !(await confirmAction({
        titleText: `Delete "${page?.pageId ?? 'page'}"?`,
        messageText: `This deletes its configuration and routes. Routes leading to it and its step assignments will also be removed.${homePageWarning} This cannot be undone.`,
        confirmText: 'Delete page',
        destructive: true
      }))
    ) {
      return;
    }
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
    const page = state.pages[Number(button.dataset.pageIndex)];
    const route = page?.routes[Number(button.dataset.routeIndex)];
    if (
      !route ||
      !(await confirmAction({
        titleText: 'Delete route?',
        messageText: `Delete this route${route.nextPageId ? ` from "${page.pageId}" to "${route.nextPageId}"` : ` from "${page.pageId}"`} and its conditions? This changes the journey flow.`,
        confirmText: 'Delete route',
        destructive: true
      }))
    ) {
      return;
    }
    page.routes.splice(Number(button.dataset.routeIndex), 1);
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
    const conditions =
      state.pages[Number(button.dataset.pageIndex)]?.routes[Number(button.dataset.routeIndex)]?.conditions;
    if (
      !conditions?.[Number(button.dataset.conditionIndex)] ||
      !(await confirmAction({
        titleText: 'Delete route condition?',
        messageText: 'This may change which destination is selected.',
        confirmText: 'Delete condition',
        destructive: true
      }))
    ) {
      return;
    }
    conditions.splice(Number(button.dataset.conditionIndex), 1);
    refresh();
    return;
  }
  if (button.matches('.move-route-up, .move-route-down')) {
    const page = state.pages[Number(button.dataset.pageIndex)];
    const index = Number(button.dataset.routeIndex);
    const destination = index + (button.matches('.move-route-up') ? -1 : 1);
    if (page && destination >= 0 && destination < page.routes.length) {
      if (
        !(await confirmAction({
          titleText: 'Reorder routes?',
          messageText: 'Route order can affect which branch of the journey is taken.',
          confirmText: 'Reorder routes'
        }))
      ) {
        return;
      }
      [page.routes[index], page.routes[destination]] = [page.routes[destination], page.routes[index]];
    }
    refresh();
    return;
  }
  if (button.id === 'add-stepper') {
    const usedIds = new Set(state.steps.map(step => step.id));
    let id = 'stepper';
    let suffix = 2;
    while (usedIds.has(id)) id = `stepper-${suffix++}`;
    state.steps.push({ id, inherited: '', extras: {}, label: '', labelType: 'translate', pages: [] });
    renderSteps();
    renderPreview();
    return;
  }
  if (button.matches('.add-step')) {
    const id = button.dataset.stepperId;
    const group = state.steps.filter(step => step.id === id);
    const lastIndex = state.steps.reduce((last, step, index) => step.id === id ? index : last, -1);
    if (!group.length) return;
    state.collapsedSteppers[id] = false;
    state.steps.splice(lastIndex + 1, 0, {
      id,
      inherited: group[0]?.inherited ?? '',
      extras: {},
      label: '',
      labelType: 'translate',
      pages: []
    });
    renderSteps();
    renderPreview();
    return;
  }
  if (button.matches('.remove-step')) {
    const index = Number(button.dataset.stepIndex);
    const step = state.steps[index];
    if (
      !step ||
      !(await confirmAction({
        titleText: `Delete "${step?.label || step?.id || 'step'}"?`,
        messageText: 'Its step configuration will be removed.',
        confirmText: 'Delete step',
        destructive: true
      }))
    ) {
      return;
    }
    state.steps.splice(index, 1);
    renderSteps();
    renderPreview();
    return;
  }
  if (button.id === 'import-journey-button') byId('import-journey-file').click();
  if (button.id === 'download-journey') downloadJourney();
  if (button.id === 'download-catalog') downloadCatalogEntry();
};
