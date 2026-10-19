import { state } from './state.js';
import { byId } from './dom.js';
import { confirmAction } from './confirmation.js';
import { buildOutput, setMetadataInputs } from './flow-model.js';
import { refresh, renderPreview, setValidationMessage } from './renderer.js';

const downloadFile = (fileName, content) => {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadJourney = () => {
  const output = renderPreview();
  if (output.errors.length) return;
  downloadFile(`${state.name}.json`, `${JSON.stringify(output.flow, null, 2)}\n`);
};

export const downloadCatalogEntry = () => {
  const output = renderPreview();
  if (output.errors.length) return;
  downloadFile(`${state.key}-catalog-entry.json`, `${JSON.stringify({ [state.key]: output.catalogEntry }, null, 2)}\n`);
};

const readJsonFile = async (file, label) => {
  if (!file) return undefined;
  try {
    return JSON.parse(await file.text());
  } catch (error) {
    throw new Error(`${label} does not contain valid JSON: ${error.message}`);
  }
};

export const importJourney = async file => {
  try {
    const flow = await readJsonFile(file, 'The file');
    if (
      !flow ||
      !Array.isArray(flow.pageMap) ||
      flow.pageMap.some(page => !page || typeof page !== 'object' || typeof page.pageId !== 'string') ||
      typeof flow.homePageId !== 'string' ||
      (flow.steppers !== undefined && !Array.isArray(flow.steppers))
    ) {
      throw new Error('The file must be a journey with homePageId and pageMap.');
    }

    const pages = flow.pageMap.map(page => {
      if (page.nextOptionList !== undefined && !Array.isArray(page.nextOptionList)) {
        throw new Error(`The destination list for "${page.pageId}" is invalid.`);
      }
      const { pageId, component, configuration, nextOptionList, ...extras } = page;
      return {
        pageId: pageId ?? '',
        component: component ?? pageId ?? '',
        collapsed: pageId !== flow.homePageId,
        extras,
        configurationRaw: configuration ? JSON.stringify(configuration, null, 2) : '',
        routes: (nextOptionList ?? []).map(option => {
          if (!option || typeof option !== 'object' || !Array.isArray(option.conditions ?? [])) {
            throw new Error(`A route on "${pageId}" has an invalid format.`);
          }
          const { nextPageId, conditions, ...routeExtras } = option;
          return {
            nextPageId: nextPageId ?? '',
            extras: routeExtras,
            conditions: (conditions ?? []).map(condition => ({
              union: condition.union ?? '',
              expression: condition.expression ?? '',
              operation: condition.operation ?? '',
              value:
                condition.value === null
                  ? ''
                  : typeof condition.value === 'object'
                    ? JSON.stringify(condition.value)
                    : String(condition.value ?? ''),
              valueType:
                condition.value === null
                  ? 'null'
                  : typeof condition.value === 'object'
                    ? 'json'
                    : typeof condition.value
            }))
          };
        })
      };
    });
    if (
      (flow.steppers ?? []).some(
        stepper => !stepper || typeof stepper !== 'object' || (stepper.steps !== undefined && !Array.isArray(stepper.steps))
      )
    ) {
      throw new Error('The stepper list has an invalid format.');
    }

    const { homePageId, title, pageMap, steppers, ...flowExtras } = flow;
    const stepperExtraById = {};
    const stepperStateInfo = {};
    const steps = (steppers ?? []).flatMap((stepper, stepperIndex) => {
      const { id, steps, stateInfo, ...extraProperties } = stepper;
      const stepperId = id ?? `stepper-${stepperIndex + 1}`;
      stepperExtraById[stepperId] = extraProperties;
      if (stateInfo !== undefined) stepperStateInfo[stepperId] = stateInfo;
      const inherited =
        typeof stateInfo === 'boolean'
          ? String(stateInfo)
          : stateInfo?.inherited === undefined
            ? ''
            : String(stateInfo.inherited);
      return (steps ?? []).map(step => {
        if (!step || typeof step !== 'object' || !Array.isArray(step.pages ?? [])) {
          throw new Error(`A step in stepper "${stepperId}" has an invalid format.`);
        }
        const { label, pages, ...stepExtras } = step;
        return {
          id: stepperId,
          inherited,
          extras: stepExtras,
          label: label?.value ?? String(label ?? ''),
          labelType: label?.type === 'literal' ? 'literal' : 'translate',
          pages: pages ?? []
        };
      });
    });
    if (
      !(await confirmAction({
        titleText: 'Replace the current journey?',
        messageText: `Import "${file.name}"? This replaces the current journey's pages, routes, conditions, steps, and metadata.`,
        confirmText: 'Replace journey',
        destructive: true
      }))
    ) {
      byId('import-journey-file').value = '';
      return;
    }
    state.pages = pages;
    state.steps = steps;
    state.collapsedSteppers = {};
    state.homePageId = homePageId;
    state.title = typeof title === 'object' && title !== null ? title.value ?? '' : String(title ?? '');
    state.titleType = title?.type === 'translate' ? 'translate' : 'literal';
    state.flowExtrasRaw = Object.keys(flowExtras).length ? JSON.stringify(flowExtras, null, 2) : '';
    state.stepperExtras = stepperExtraById;
    state.stepperStateInfo = stepperStateInfo;
    const importedName = file.name.replace(/\.json$/i, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const catalogMatch = Object.entries(state.catalog ?? {}).find(([, entry]) => entry.name === importedName);
    const catalogEntry = catalogMatch?.[1];
    state.name = importedName;
    state.key = catalogMatch?.[0] ?? importedName;
    state.id = catalogEntry?.id ?? importedName;
    const latestVersion = catalogEntry?.versions.at(-1);
    state.version = latestVersion?.value ?? 'v1.0.0';
    state.breakingchange = latestVersion?.breakingchange ?? '';
    byId('flow-extras').value = state.flowExtrasRaw;
    setMetadataInputs();
    refresh();
  } catch (error) {
    showImportError(error.message);
  }
  byId('import-journey-file').value = '';
};

export const importCatalog = async file => {
  const status = byId('catalog-status');
  try {
    const catalog = await readJsonFile(file, 'The catalog');
    if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
      throw new Error('The catalog must be a JSON object.');
    }
    if (
      Object.values(catalog).some(
        entry =>
          !entry ||
          typeof entry.id !== 'string' ||
          typeof entry.name !== 'string' ||
          !Array.isArray(entry.versions) ||
          entry.versions.some(version => !version || typeof version.value !== 'string')
      )
    ) {
      throw new Error('Each catalog entry needs an id, a name, and a valid versions array.');
    }
    if (
      state.catalog &&
      !(await confirmAction({
        titleText: 'Replace the current catalog?',
        messageText: 'This replaces the catalog currently loaded in the editor.',
        confirmText: 'Replace catalog',
        destructive: true
      }))
    ) {
      byId('import-catalog-file').value = '';
      return;
    }
    state.catalog = catalog;
    const count = Object.keys(catalog).length;
    status.textContent = `Catalog loaded: ${count} ${count === 1 ? 'entry' : 'entries'}.`;
    status.className = 'catalog-status is-loaded';
    renderPreview();
  } catch (error) {
    status.textContent = error.message;
    status.className = 'catalog-status';
    renderPreview();
  }
  byId('import-catalog-file').value = '';
};

const showImportError = message => {
  const messages = byId('validation-messages');
  messages.replaceChildren();
  setValidationMessage(messages, message, 'error');
  byId('validation-badge').textContent = 'Import error';
  byId('validation-badge').className = 'status-badge status-invalid';
};
