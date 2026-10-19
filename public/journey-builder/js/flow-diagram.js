import { COMPONENTS } from './component-catalog.js';

const svgNamespace = 'http://www.w3.org/2000/svg';
const nodeWidth = 216;
const nodeHeight = 104;
const columnGap = 72;
const rowGap = 76;
const originX = 32;
const originY = 32;
const edgeLabelLimit = 56;

const createSvgElement = (name, attributes = {}) => {
  const element = document.createElementNS(svgNamespace, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
};

const routeLabel = (route, index) => {
  const conditions = (route.conditions ?? [])
    .map((condition, conditionIndex) => {
      const value = condition.value === undefined ? '' : JSON.stringify(condition.value);
      const expression = [condition.expression, condition.operation, value].filter(Boolean).join(' ');
      return conditionIndex ? `${condition.union || 'AND'} ${expression}` : expression;
    })
    .filter(Boolean);
  const label = `Route ${index + 1}`;
  const text = conditions.length ? `${label}: ${conditions.join(' ')}` : label;
  return text.length > edgeLabelLimit ? `${text.slice(0, edgeLabelLimit - 1)}…` : text;
};

const getConnections = (flow, pageIndexes) => {
  const connections = [];
  flow.pageMap.forEach((page, source) => {
    (page.nextOptionList ?? []).forEach((route, index) => {
      const target = pageIndexes.get(route.nextPageId);
      if (target !== undefined) connections.push({ source, target, label: routeLabel(route, index), type: 'route' });
    });
  });

  Object.entries(flow.links ?? {}).forEach(([sourceId, targetId]) => {
    const source = pageIndexes.get(sourceId);
    const target = pageIndexes.get(targetId);
    if (source !== undefined && target !== undefined) {
      connections.push({ source, target, label: `Link: ${sourceId}`, type: 'link' });
    }
  });
  return connections;
};

const getLevels = (flow, connections, pageIndexes) => {
  const levels = Array(flow.pageMap.length).fill(-1);
  const homeIndex = pageIndexes.get(flow.homePageId);
  const queue = [];
  if (homeIndex !== undefined) {
    levels[homeIndex] = 0;
    queue.push(homeIndex);
  }

  const outgoing = Array.from({ length: flow.pageMap.length }, () => []);
  connections.forEach(({ source, target }) => outgoing[source].push(target));
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const source = queue[cursor];
    outgoing[source].forEach(target => {
      if (levels[target] !== -1) return;
      levels[target] = levels[source] + 1;
      queue.push(target);
    });
  }

  const reachable = levels.map(level => level !== -1);
  const deepestReachable = Math.max(-1, ...levels);
  const unreachableLevel = deepestReachable + 1;
  levels.forEach((level, index) => {
    if (level === -1) levels[index] = unreachableLevel;
  });
  return { levels, homeIndex, reachable };
};

const createConnectionPath = (connection, positions, laneIndex, laneWidth) => {
  const source = positions[connection.source];
  const target = positions[connection.target];
  if (target.level === source.level + 1) {
    const startX = source.x + nodeWidth / 2;
    const startY = source.y + nodeHeight;
    const endX = target.x + nodeWidth / 2;
    const endY = target.y;
    const bend = Math.max(24, (endY - startY) / 2);
    return {
      d: `M ${startX} ${startY} C ${startX} ${startY + bend}, ${endX} ${endY - bend}, ${endX} ${endY}`,
      labelX: (startX + endX) / 2,
      labelY: (startY + endY) / 2
    };
  }

  const startX = source.x + nodeWidth;
  const startY = source.y + nodeHeight / 2;
  const endX = target.x + nodeWidth;
  const endY = target.y + nodeHeight / 2;
  const laneX = laneWidth - 16 - laneIndex * 24;
  return {
    d: `M ${startX} ${startY} C ${laneX} ${startY}, ${laneX} ${endY}, ${endX} ${endY}`,
    labelX: laneX - 5,
    labelY: (startY + endY) / 2
  };
};

const renderConnections = (svg, connections, positions, laneWidth, markerId) => {
  const definition = createSvgElement('defs');
  const marker = createSvgElement('marker', {
    id: markerId,
    markerWidth: 8,
    markerHeight: 8,
    refX: 6,
    refY: 4,
    orient: 'auto',
    markerUnits: 'strokeWidth'
  });
  marker.append(createSvgElement('path', { d: 'M 0 0 L 8 4 L 0 8 z' }));
  definition.append(marker);
  svg.append(definition);

  let laneIndex = 0;
  connections.forEach(connection => {
    const source = positions[connection.source];
    const target = positions[connection.target];
    const routed = target.level !== source.level + 1;
    const pathData = createConnectionPath(connection, positions, laneIndex, laneWidth);
    if (routed) laneIndex += 1;

    const path = createSvgElement('path', {
      d: pathData.d,
      class: `flow-edge${connection.type === 'link' ? ' flow-edge-link' : ''}${routed ? ' flow-edge-routed' : ''}`,
      'marker-end': `url(#${markerId})`
    });
    path.setAttribute('aria-hidden', 'true');
    svg.append(path);

    const label = createSvgElement('text', {
      x: pathData.labelX,
      y: pathData.labelY,
      class: `flow-edge-label${routed ? ' flow-edge-label-routed' : ''}`,
      'text-anchor': routed ? 'end' : 'middle'
    });
    label.textContent = connection.label;
    label.setAttribute('aria-hidden', 'true');
    svg.append(label);
  });
};

const renderNode = (page, index, position, homeIndex, reachable, pageCount) => {
  const button = document.createElement('button');
  const heading = document.createElement('span');
  const pageId = document.createElement('strong');
  const component = document.createElement('span');
  const details = document.createElement('span');

  button.type = 'button';
  button.className = `flow-diagram-node${index === homeIndex ? ' is-home' : ''}${!reachable ? ' is-unreachable' : ''}`;
  button.dataset.pageIndex = index;
  button.style.left = `${position.x}px`;
  button.style.top = `${position.y}px`;
  button.setAttribute('aria-label', `Edit page ${page.pageId || `page ${index + 1}`}${index === homeIndex ? ', home page' : ''}`);

  heading.className = 'flow-diagram-node-heading';
  heading.textContent = index === homeIndex ? 'Home page' : !reachable ? 'Unreachable' : `Page ${index + 1} of ${pageCount}`;
  pageId.className = 'flow-diagram-page-id';
  pageId.textContent = page.pageId || '(no ID)';
  component.className = 'flow-diagram-component';
  component.textContent = COMPONENTS.find(entry => entry.id === page.component)?.label ?? page.component ?? 'No component';
  details.className = 'flow-diagram-details';
  const routes = page.nextOptionList?.length ?? 0;
  details.textContent = `${routes} ${routes === 1 ? 'route' : 'routes'}`;
  button.append(heading, pageId, component, details);
  return button;
};

export const renderFlowDiagram = flow => {
  const canvas = document.getElementById('flow-diagram-canvas');
  const count = document.getElementById('flow-diagram-count');
  if (!canvas || !count) return;

  canvas.replaceChildren();
  const pages = flow.pageMap ?? [];
  count.textContent = `${pages.length} ${pages.length === 1 ? 'page' : 'pages'}`;
  if (!pages.length) {
    const empty = document.createElement('p');
    empty.className = 'flow-diagram-empty';
    empty.textContent = 'Add a page to see the screen flow.';
    canvas.append(empty);
    return;
  }

  const pageIndexes = new Map();
  pages.forEach((page, index) => {
    if (!pageIndexes.has(page.pageId)) pageIndexes.set(page.pageId, index);
  });
  const connections = getConnections(flow, pageIndexes);
  const { levels, homeIndex, reachable } = getLevels(flow, connections, pageIndexes);
  const layers = [];
  levels.forEach((level, index) => {
    layers[level] ??= [];
    layers[level].push(index);
  });
  const columnCount = Math.max(1, ...layers.map(layer => layer?.length ?? 0));
  const width = originX * 2 + columnCount * nodeWidth + Math.max(0, columnCount - 1) * columnGap;
  const routedConnections = connections.filter(({ source, target }) => levels[target] !== levels[source] + 1).length;
  const laneWidth = width + routedConnections * 24 + 40;
  const height = originY * 2 + layers.length * nodeHeight + Math.max(0, layers.length - 1) * rowGap;
  const positions = Array(pages.length);

  layers.forEach((layer, level) => {
    layer.forEach((pageIndex, column) => {
      positions[pageIndex] = {
        x: originX + column * (nodeWidth + columnGap),
        y: originY + level * (nodeHeight + rowGap),
        level
      };
    });
  });

  canvas.style.width = `${laneWidth}px`;
  canvas.style.height = `${height}px`;
  const svg = createSvgElement('svg', {
    class: 'flow-diagram-edges',
    width: laneWidth,
    height,
    viewBox: `0 0 ${laneWidth} ${height}`,
    'aria-hidden': 'true'
  });
  const markerId = 'flow-arrowhead';
  renderConnections(svg, connections, positions, laneWidth, markerId);
  canvas.append(svg);

  pages.forEach((page, index) => {
    canvas.append(renderNode(page, index, positions[index], homeIndex, reachable[index], pages.length));
  });
};
