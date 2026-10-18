import { COMPONENTS } from './component-catalog.js';
import { state } from './state.js';
import { byId } from './dom.js';
import { validatePageConfiguration } from './configuration-editor.js';

const updateStateFromMetadata = () => {
  state.key = byId('journey-key').value.trim();
  state.id = byId('journey-id').value.trim();
  state.name = byId('journey-name').value.trim().replace(/\.json$/i, '');
  state.version = byId('journey-version').value.trim();
  state.breakingchange = byId('journey-breakingchange').value;
  state.title = byId('journey-title').value.trim();
  state.titleType = byId('journey-title-type').value;
  state.homePageId = byId('home-page').value;
};

const readFlowExtras = errors => {
  if (!state.flowExtrasRaw.trim()) return {};

  try {
    const extras = JSON.parse(state.flowExtrasRaw);
    if (!extras || Array.isArray(extras) || typeof extras !== 'object') {
      errors.push('La configuración avanzada debe ser un objeto JSON.');
      return {};
    }
    const unsupported = Object.keys(extras).filter(key => !['errorPageId', 'links', 'literals'].includes(key));
    if (unsupported.length) {
      errors.push(`La configuración avanzada no puede redefinir: ${unsupported.join(', ')}.`);
      return {};
    }
    return extras;
  } catch (error) {
    errors.push(`JSON inválido en la configuración avanzada: ${error.message}`);
    return {};
  }
};

export const setMetadataInputs = () => {
  byId('journey-key').value = state.key;
  byId('journey-id').value = state.id;
  byId('journey-name').value = state.name;
  byId('journey-version').value = state.version;
  byId('journey-breakingchange').value = state.breakingchange;
  byId('journey-title').value = state.title;
  byId('journey-title-type').value = state.titleType;
};

const literal = (value, type) => ({ value, type });

const readConfiguration = (page, index, errors) => {
  if (!page.configurationRaw.trim()) return undefined;

  try {
    const configuration = JSON.parse(page.configurationRaw);
    if (!configuration || Array.isArray(configuration) || typeof configuration !== 'object') {
      errors.push(`La configuración de la página ${index + 1} debe ser un objeto JSON.`);
      return undefined;
    }
    return configuration;
  } catch (error) {
    errors.push(`JSON inválido en la configuración de la página ${index + 1}: ${error.message}`);
    return undefined;
  }
};

const parseConditionValue = condition => {
  switch (condition.valueType) {
    case 'boolean':
      if (condition.value !== 'true' && condition.value !== 'false') throw new Error('El valor booleano debe ser true o false.');
      return condition.value === 'true';
    case 'number': {
      const value = Number(condition.value);
      if (!condition.value.trim() || !Number.isFinite(value)) throw new Error('El valor de la condición debe ser un número válido.');
      return value;
    }
    case 'null':
      return null;
    case 'json':
      return JSON.parse(condition.value);
    default:
      return condition.value;
  }
};

export const buildOutput = () => {
  updateStateFromMetadata();
  const errors = [];
  const warnings = [];
  const parsedConditionValues = new WeakMap();
  const pageIds = state.pages.map(page => page.pageId.trim());
  const pageIdSet = new Set(pageIds);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(state.key)) {
    errors.push('La clave debe usar minúsculas, números y guiones (sin guiones al principio ni al final).');
  }
  const registeredCurrentEntry = state.catalog?.[state.key];
  if (
    ['default', 'not-journey'].includes(state.key) &&
    (!registeredCurrentEntry || registeredCurrentEntry.id !== state.id || registeredCurrentEntry.name !== state.name)
  ) {
    errors.push(`La clave "${state.key}" está reservada para el journey existente.`);
  }
  if (!state.id) errors.push('El ID del journey es obligatorio.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(state.name)) {
    errors.push('El nombre de archivo debe usar minúsculas, números y guiones.');
  }
  if (!/^v\d+\.\d+(?:\.\d+)?$/.test(state.version)) errors.push('La versión debe tener el formato v1.2 o v1.2.3.');
  if (!state.title) errors.push('El título del journey es obligatorio.');
  if (state.pages.length === 0) errors.push('Añade al menos una página al journey.');
  if (!state.homePageId || !pageIdSet.has(state.homePageId)) errors.push('La página inicial debe existir en el flujo.');
  if (new Set(pageIds).size !== pageIds.length) errors.push('Cada ID de página debe ser único.');
  if (pageIds.some(pageId => !pageId)) errors.push('Todas las páginas necesitan un ID.');

  if (registeredCurrentEntry) {
    const previous = registeredCurrentEntry;
    if (previous.id !== state.id || previous.name !== state.name) {
      errors.push(`La clave "${state.key}" ya está registrada con otro ID o nombre de archivo.`);
    }
  }

  state.pages.forEach((page, pageIndex) => {
    if (!COMPONENTS.some(component => component.id === page.component)) {
      errors.push(`La página ${pageIndex + 1} no usa un componente registrado.`);
    }
    if (!page.configurationRaw.trim()) {
      warnings.push(`La página "${page.pageId}" no tiene configuration; revisa los literales y datos que requiera su componente.`);
    }
    const configurationResult = validatePageConfiguration(page.configurationRaw);
    configurationResult.errors.forEach(error => {
      errors.push(`Configuración de "${page.pageId}" no válida: ${error}`);
    });
    configurationResult.warnings.forEach(warning => {
      warnings.push(`Configuración de "${page.pageId}": ${warning}`);
    });

    page.routes.forEach((route, routeIndex) => {
      if (!route.nextPageId) {
        errors.push(`La ruta ${routeIndex + 1} de "${page.pageId || `página ${pageIndex + 1}`}" necesita un destino.`);
      } else if (!pageIdSet.has(route.nextPageId)) {
        errors.push(`El destino "${route.nextPageId}" no existe en el journey.`);
      }

      route.conditions.forEach((condition, conditionIndex) => {
        const hasExpression = Boolean(condition.expression?.trim());
        const hasConditionValue = condition.valueType === 'null' || condition.value !== '';
        if (condition.operation && !['===', '!==', '>', '>=', '<', '<='].includes(condition.operation)) {
          errors.push(`Operador no válido en la condición ${conditionIndex + 1} de la ruta ${routeIndex + 1}.`);
        }
        if (condition.union && !['AND', 'OR', 'XOR', 'NOR', 'NAND', 'XNOR'].includes(condition.union)) {
          errors.push(`Unión no válida en la condición ${conditionIndex + 1} de la ruta ${routeIndex + 1}.`);
        }
        if (hasExpression !== hasConditionValue) {
          errors.push(
            `Completa expresión y valor de la condición ${conditionIndex + 1} de la ruta ${routeIndex + 1} de "${page.pageId}".`
          );
        }
        if (hasExpression && hasConditionValue) {
          try {
            parsedConditionValues.set(condition, parseConditionValue(condition));
          } catch (error) {
            errors.push(`${error.message} Ruta de "${page.pageId}".`);
          }
        }
      });
    });
  });

  const stepperInherited = new Map();
  state.steps.forEach((step, index) => {
    if (!step.id.trim()) errors.push(`El paso ${index + 1} necesita un ID de stepper.`);
    if (!step.label.trim()) errors.push(`El paso ${index + 1} necesita una etiqueta.`);
    if (!step.pages.length) errors.push(`El paso ${index + 1} debe incluir al menos una página.`);
    const inherited = step.inherited;
    if (stepperInherited.has(step.id) && stepperInherited.get(step.id) !== inherited) {
      errors.push(`Todos los pasos del stepper "${step.id}" deben usar la misma herencia del contexto.`);
    }
    stepperInherited.set(step.id, inherited);
    if (step.pages.some(pageId => !pageIdSet.has(pageId))) {
      errors.push(`El paso ${index + 1} incluye una página que no existe.`);
    }
    if (new Set(step.pages).size !== step.pages.length) errors.push(`El paso ${index + 1} tiene páginas repetidas.`);
  });

  const flowExtras = readFlowExtras(errors);
  if (state.pages.length > 0 && pageIdSet.has(state.homePageId)) {
    const visited = new Set();
    const visit = pageId => {
      if (visited.has(pageId)) return;
      visited.add(pageId);
      const page = state.pages.find(item => item.pageId.trim() === pageId);
      page?.routes.forEach(route => {
        if (route.nextPageId && pageIdSet.has(route.nextPageId)) visit(route.nextPageId);
      });
      const linkedPageId = flowExtras.links?.[pageId];
      if (typeof linkedPageId === 'string' && pageIdSet.has(linkedPageId)) visit(linkedPageId);
    };
    visit(state.homePageId);
    const unreachable = pageIds.filter(pageId => pageId && !visited.has(pageId));
    if (unreachable.length) warnings.push(`Páginas no alcanzables desde el inicio: ${unreachable.join(', ')}.`);
  }

  if (state.catalog) {
    const conflicts = Object.entries(state.catalog).filter(
      ([key, item]) =>
        (key !== state.key && item.id === state.id) ||
        (key !== state.key && item.name === state.name)
    );
    if (conflicts.length) errors.push('El ID o el nombre de archivo ya se utiliza en otra entrada del catálogo.');
  }

  const pageMap = state.pages.map((page, pageIndex) => {
    const output = { ...page.extras, pageId: page.pageId.trim() };
    if (page.component !== page.pageId.trim()) output.component = page.component;

    const routes = page.routes
      .filter(route => route.nextPageId)
      .map(route => {
        const next = { ...route.extras, nextPageId: route.nextPageId };
        const conditions = route.conditions
          .filter(condition => condition.expression.trim() && (condition.valueType === 'null' || condition.value !== ''))
          .map(condition => {
            const result = { expression: condition.expression.trim() };
            if (condition.operation) result.operation = condition.operation;
            if (condition.union) result.union = condition.union;
            if (parsedConditionValues.has(condition)) result.value = parsedConditionValues.get(condition);
            return result;
          });
        if (conditions.length) next.conditions = conditions;
        return next;
      });
    if (routes.length) output.nextOptionList = routes;

    const configuration = readConfiguration(page, pageIndex, []);
    if (configuration) output.configuration = configuration;
    return output;
  });

  const flow = {
    ...flowExtras,
    homePageId: state.homePageId,
    title: literal(state.title, state.titleType),
    pageMap
  };

  if (state.steps.length) {
    const steppers = new Map();
    state.steps.forEach(step => {
      if (!steppers.has(step.id)) steppers.set(step.id, []);
      steppers.get(step.id).push({
        extras: step.extras,
        inherited: step.inherited,
        label: literal(step.label, step.labelType),
        pages: step.pages
      });
    });
    flow.steppers = [...steppers].map(([id, steps]) => {
      const stepper = {
        ...(state.stepperExtras[id] ?? {}),
        id,
        steps: steps.map(({ extras, inherited, ...step }) => ({ ...extras, ...step }))
      };
      const inherited = steps[0].inherited;
      if (inherited) {
        const previousInfo = state.stepperStateInfo[id];
        stepper.stateInfo =
          typeof previousInfo === 'object'
            ? { ...previousInfo, inherited: inherited === 'true' }
            : inherited === 'true';
      } else if (state.stepperStateInfo[id] !== undefined) {
        stepper.stateInfo = state.stepperStateInfo[id];
      }
      return stepper;
    });
  }

  const previousEntry = state.catalog?.[state.key];
  const previousVersions = previousEntry?.versions ?? [];
  const currentVersion = previousVersions.find(version => version.value === state.version);
  const newVersion = { ...(currentVersion ?? {}), value: state.version };
  if (state.breakingchange) newVersion.breakingchange = state.breakingchange;
  const versions = currentVersion
    ? previousVersions.map(version => (version.value === state.version ? newVersion : version))
    : [...previousVersions, newVersion];
  const catalogEntry = {
    ...(previousEntry ?? {}),
    id: state.id,
    name: state.name,
    versions
  };

  return { errors, warnings, flow, catalogEntry };
};
