import { state } from './state.js';

const literalTypes = new Set(['value', 'literal', 'data', 'translate']);
const unions = new Set(['AND', 'OR', 'XOR', 'NOR', 'NAND', 'XNOR']);
const pageConfigurationKeys = new Set(['literals', 'data', 'validationSettings', 'serviceActivators', 'zones']);
const flowConfigurationKeys = new Set(['errorPageId', 'links', 'literals']);

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const jsonParseError = (source, error) => {
  const message = error.message ?? 'Invalid JSON.';
  const position = message.match(/position\s+(\d+)/i);
  const lineColumn = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  let line = lineColumn ? Number(lineColumn[1]) : null;
  let column = lineColumn ? Number(lineColumn[2]) : null;
  if (position) {
    const beforeError = source.slice(0, Number(position[1]));
    line = (beforeError.match(/\n/g) ?? []).length + 1;
    column = Number(position[1]) - beforeError.lastIndexOf('\n');
  }
  return { errors: [message], warnings: [], line, column };
};

const escapeHtml = value =>
  value.replace(/[&<>"']/g, character => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return entities[character];
  });

const highlightToken = (token, next) => {
  let type = '';
  if (token.startsWith('"')) type = /^\s*:/.test(next) ? 'json-key' : 'json-string';
  else if (/^(?:true|false|null)$/.test(token)) type = 'json-literal';
  else if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(token)) type = 'json-number';
  else if (/^[{}\[\],:]$/.test(token)) type = 'json-punctuation';
  if (!type) return escapeHtml(token);
  return `<span class="${type}">${escapeHtml(token)}</span>`;
};

const highlightJson = source => {
  const tokens = /"(?:\\.|[^"\\])*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}\[\],:]|\s+|./gs;
  const output = [];
  for (const match of source.matchAll(tokens)) {
    const token = match[0];
    if (/^\s+$/.test(token)) {
      output.push(escapeHtml(token));
      continue;
    }
    const next = source.slice(match.index + token.length);
    output.push(highlightToken(token, next));
  }
  return output.join('') || ' ';
};

const validateConditions = (conditions, path, errors) => {
  if (!Array.isArray(conditions)) {
    errors.push(`${path} must be an array.`);
    return;
  }
  conditions.forEach((condition, index) => {
    const conditionPath = `${path}[${index}]`;
    if (!isObject(condition)) {
      errors.push(`${conditionPath} must be an object.`);
      return;
    }
    if (typeof condition.expression !== 'string' || !condition.expression.trim()) {
      errors.push(`${conditionPath}.expression must be a non-empty string.`);
    }
    if (!Object.prototype.hasOwnProperty.call(condition, 'value')) {
      errors.push(`${conditionPath}.value is required.`);
    }
    if (condition.operation !== undefined && typeof condition.operation !== 'string') {
      errors.push(`${conditionPath}.operation must be a string.`);
    }
    if (condition.union !== undefined && !unions.has(condition.union)) {
      errors.push(`${conditionPath}.union must be a supported logical operator.`);
    }
  });
};

const validateLiterals = (literals, errors) => {
  if (!isObject(literals)) {
    errors.push('literals must be an object.');
    return;
  }
  Object.entries(literals).forEach(([key, literal]) => {
    const path = `literals.${key}`;
    if (typeof literal === 'string' || typeof literal === 'number') return;
    if (!isObject(literal)) {
      errors.push(`${path} must be a string, number, or literal object.`);
      return;
    }
    if (typeof literal.value !== 'string' && typeof literal.value !== 'number') {
      errors.push(`${path}.value must be a string or number.`);
    }
    if (literal.type !== undefined && !literalTypes.has(literal.type)) {
      errors.push(`${path}.type is not a supported literal type.`);
    }
    if (literal.params !== undefined && !isObject(literal.params)) {
      errors.push(`${path}.params must be an object.`);
    }
    if (literal.conditions !== undefined) validateConditions(literal.conditions, `${path}.conditions`, errors);
  });
};

const validateBooleanProperties = (value, properties, path, errors) => {
  properties.forEach(property => {
    if (value[property] !== undefined && typeof value[property] !== 'boolean') {
      errors.push(`${path}.${property} must be a boolean.`);
    }
  });
};

const validatePageData = (data, errors) => {
  if (!isObject(data)) {
    errors.push('data must be an object.');
    return;
  }
  if (data.contextData !== undefined && !isObject(data.contextData)) {
    errors.push('data.contextData must be an object.');
  }
  if (data.headerConfig !== undefined) {
    if (!isObject(data.headerConfig)) errors.push('data.headerConfig must be an object.');
    else validateBooleanProperties(data.headerConfig, ['showBack', 'showContactUs', 'showLanguages'], 'data.headerConfig', errors);
  }
  if (data.footerConfig !== undefined) {
    if (!isObject(data.footerConfig)) {
      errors.push('data.footerConfig must be an object.');
    } else {
      validateBooleanProperties(
        data.footerConfig,
        ['disableBack', 'disableNext', 'showBack', 'showNext', 'ignoreQuoteConfig'],
        'data.footerConfig',
        errors
      );
      if (data.footerConfig.info !== undefined) {
        if (!isObject(data.footerConfig.info)) errors.push('data.footerConfig.info must be an object.');
        else if (typeof data.footerConfig.info.literal !== 'string') {
          errors.push('data.footerConfig.info.literal must be a string.');
        }
      }
    }
  }
  if (data.stepperConfig !== undefined) {
    if (!isObject(data.stepperConfig)) {
      errors.push('data.stepperConfig must be an object.');
    } else {
      validateBooleanProperties(data.stepperConfig, ['visible', 'showLabel', 'showSteps'], 'data.stepperConfig', errors);
    }
  }
};

const validateConditionsProperty = (value, path, errors) => {
  if (value.conditions !== undefined) validateConditions(value.conditions, `${path}.conditions`, errors);
};

export const validatePageConfiguration = source => {
  if (!source.trim()) return { errors: [], warnings: [], line: null, column: null };

  let configuration;
  try {
    configuration = JSON.parse(source);
  } catch (error) {
    return jsonParseError(source, error);
  }

  const errors = [];
  const warnings = [];
  if (!isObject(configuration)) {
    return {
      errors: ['Configuration must be a JSON object, not an array or primitive value.'],
      warnings,
      line: null,
      column: null
    };
  }

  Object.keys(configuration).forEach(key => {
    if (!pageConfigurationKeys.has(key)) warnings.push(`Unrecognized property in page configuration: ${key}.`);
  });
  if (configuration.literals !== undefined) validateLiterals(configuration.literals, errors);
  if (configuration.data !== undefined) validatePageData(configuration.data, errors);
  if (configuration.validationSettings !== undefined && !isObject(configuration.validationSettings)) {
    errors.push('validationSettings must be an object.');
  }
  if (configuration.validationSettings !== undefined && isObject(configuration.validationSettings)) {
    Object.entries(configuration.validationSettings).forEach(([control, rules]) => {
      if (!isObject(rules)) errors.push(`validationSettings.${control} must be an object.`);
      else {
        Object.entries(rules).forEach(([rule, settings]) => {
          if (!isObject(settings)) errors.push(`validationSettings.${control}.${rule} must be an object.`);
          else if (settings.disabled !== undefined && typeof settings.disabled !== 'boolean') {
            errors.push(`validationSettings.${control}.${rule}.disabled must be a boolean.`);
          }
        });
      }
    });
  }
  if (configuration.serviceActivators !== undefined && !Array.isArray(configuration.serviceActivators)) {
    errors.push('serviceActivators must be an array.');
  }
  if (Array.isArray(configuration.serviceActivators)) {
    configuration.serviceActivators.forEach((activator, index) => {
      const path = `serviceActivators[${index}]`;
      if (!isObject(activator)) {
        errors.push(`${path} must be an object.`);
        return;
      }
      if (typeof activator.entryPoint !== 'string' || !activator.entryPoint) {
        errors.push(`${path}.entryPoint must be a non-empty string.`);
      }
      if (typeof activator.activator !== 'string' || !activator.activator) {
        errors.push(`${path}.activator must be a non-empty string.`);
      }
      validateConditionsProperty(activator, path, errors);
    });
  }
  if (configuration.zones !== undefined && !isObject(configuration.zones)) errors.push('zones must be an object.');
  if (isObject(configuration.zones)) {
    Object.entries(configuration.zones).forEach(([name, zone]) => {
      const path = `zones.${name}`;
      if (!isObject(zone)) {
        errors.push(`${path} must be an object.`);
        return;
      }
      if (zone.skipLoad !== undefined && typeof zone.skipLoad !== 'boolean') {
        errors.push(`${path}.skipLoad must be a boolean.`);
      }
      validateConditionsProperty(zone, path, errors);
    });
  }

  return { errors, warnings, line: null, column: null };
};

export const validateFlowConfiguration = (source, pageIds) => {
  if (!source.trim()) return { errors: [], warnings: [], line: null, column: null, configuration: {} };

  let configuration;
  try {
    configuration = JSON.parse(source);
  } catch (error) {
    return { ...jsonParseError(source, error), configuration: {} };
  }

  const errors = [];
  const warnings = [];
  if (!isObject(configuration)) {
    return {
      errors: ['Advanced configuration must be a JSON object, not an array or primitive value.'],
      warnings,
      line: null,
      column: null,
      configuration: {}
    };
  }

  Object.keys(configuration).forEach(key => {
    if (!flowConfigurationKeys.has(key)) errors.push(`Unsupported property in advanced configuration: ${key}.`);
  });
  if (configuration.errorPageId !== undefined) {
    if (typeof configuration.errorPageId !== 'string' || !configuration.errorPageId.trim()) {
      errors.push('errorPageId must be a non-empty string.');
    } else if (pageIds && !pageIds.includes(configuration.errorPageId)) {
      errors.push(`errorPageId must refer to an existing page: ${configuration.errorPageId}.`);
    }
  }
  if (configuration.links !== undefined) {
    if (!isObject(configuration.links)) {
      errors.push('links must be an object.');
    } else {
      Object.entries(configuration.links).forEach(([key, value]) => {
        if (typeof value !== 'string') errors.push(`links.${key} must be a string.`);
      });
    }
  }
  if (configuration.literals !== undefined) validateLiterals(configuration.literals, errors);

  return { errors, warnings, line: null, column: null, configuration };
};

export const updateConfigurationEditor = textarea => {
  const editor = textarea.closest('.json-editor');
  editor.querySelector('.json-highlight code').innerHTML = highlightJson(textarea.value);
  syncConfigurationEditorScroll(textarea);
  const status = editor.parentElement.querySelector('.configuration-status');
  const diagnostics = editor.parentElement.querySelector('.configuration-diagnostics');
  const result =
    textarea.id === 'flow-extras'
      ? validateFlowConfiguration(textarea.value, state.pages.map(page => page.pageId.trim()))
      : validatePageConfiguration(textarea.value);

  editor.classList.toggle('has-json-error', result.errors.length > 0);
  status.className = `configuration-status${result.errors.length ? ' is-invalid' : result.warnings.length ? ' has-warning' : ''}`;
  if (!textarea.value.trim()) {
    status.textContent = 'Optional configuration: enter a JSON object to define it.';
  } else if (result.errors.length) {
    status.textContent = result.line
      ? `Invalid JSON · line ${result.line}${result.column ? `, column ${result.column}` : ''}`
      : 'Invalid JSON configuration';
  } else if (result.warnings.length) {
    status.textContent = `Valid structure with ${result.warnings.length} warning${result.warnings.length === 1 ? '' : 's'}.`;
  } else {
    status.textContent = 'JSON and configuration structure are valid.';
  }

  diagnostics.replaceChildren();
  [...result.errors, ...result.warnings].forEach(message => {
    const item = document.createElement('li');
    item.textContent = message;
    item.className = result.errors.includes(message) ? 'diagnostic-error' : 'diagnostic-warning';
    diagnostics.append(item);
  });
  textarea.setAttribute('aria-invalid', String(result.errors.length > 0));
  textarea.setAttribute('aria-describedby', status.id);
  return result;
};

export const syncConfigurationEditorScroll = textarea => {
  const highlighted = textarea.closest('.json-editor').querySelector('.json-highlight');
  highlighted.scrollTop = textarea.scrollTop;
  highlighted.scrollLeft = textarea.scrollLeft;
};

export const handleConfigurationEditorKeydown = event => {
  if (!event.target.matches('.page-configuration, #flow-extras') || event.key !== 'Tab') return;
  event.preventDefault();
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;

  if (event.shiftKey) {
    const linePrefix = value.slice(lineStart, start);
    const indentation = linePrefix.match(/^ {1,2}/)?.[0];
    if (!indentation) return;
    textarea.setRangeText('', lineStart, lineStart + indentation.length, 'start');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.setSelectionRange(Math.max(lineStart, start - indentation.length), Math.max(lineStart, end - indentation.length));
    return;
  }

  if (start !== end) {
    const selectedLinesStart = lineStart;
    const selectedLinesEnd = value.indexOf('\n', end);
    const selectionEnd = selectedLinesEnd === -1 ? value.length : selectedLinesEnd;
    const selected = value.slice(selectedLinesStart, selectionEnd);
    const indented = selected.replace(/^/gm, '  ');
    textarea.setRangeText(indented, selectedLinesStart, selectionEnd, 'select');
    textarea.setSelectionRange(start, end + indented.length - selected.length);
  } else {
    textarea.setRangeText('  ', start, end, 'end');
  }
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
};
