import { state } from './state.js';
import { byId } from './dom.js';
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
    throw new Error(`${label} no contiene JSON válido: ${error.message}`);
  }
};

export const importJourney = async file => {
  try {
    const flow = await readJsonFile(file, 'El archivo');
    if (
      !flow ||
      !Array.isArray(flow.pageMap) ||
      flow.pageMap.some(page => !page || typeof page !== 'object' || typeof page.pageId !== 'string') ||
      typeof flow.homePageId !== 'string' ||
      (flow.steppers !== undefined && !Array.isArray(flow.steppers))
    ) {
      throw new Error('El archivo debe ser un journey con homePageId y pageMap.');
    }

    const pages = flow.pageMap.map(page => {
      if (page.nextOptionList !== undefined && !Array.isArray(page.nextOptionList)) {
        throw new Error(`La lista de destinos de "${page.pageId}" no es válida.`);
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
            throw new Error(`Una ruta de "${pageId}" no tiene un formato válido.`);
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
      throw new Error('La lista de steppers no tiene un formato válido.');
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
          throw new Error(`Un paso del stepper "${stepperId}" no tiene un formato válido.`);
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
    state.pages = pages;
    state.steps = steps;
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
    const catalog = await readJsonFile(file, 'El catálogo');
    if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
      throw new Error('El catálogo debe ser un objeto JSON.');
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
      throw new Error('Cada entrada del catálogo necesita id, name y una lista versions válida.');
    }
    state.catalog = catalog;
    const count = Object.keys(catalog).length;
    status.textContent = `Catálogo cargado: ${count} ${count === 1 ? 'entrada' : 'entradas'}.`;
    status.className = 'catalog-status is-loaded';
    renderPreview();
  } catch (error) {
    state.catalog = undefined;
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
  byId('validation-badge').textContent = 'Error de importación';
  byId('validation-badge').className = 'status-badge status-invalid';
};
