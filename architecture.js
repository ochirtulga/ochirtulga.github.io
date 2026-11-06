(() => {
  'use strict';

  const root = document.getElementById('architecture-story-widget');
  if (!root) return;

  // The owner supplied the notification topology; repeated groups show multiplicity,
  // not a fixed number of categories, channels, topics, or service instances.
  const notificationNodes = [
    { id: 'core', label: 'Core transaction', detail: 'Microservice · produces a record', icon: 'service' },
    { id: 'intake', label: 'Notification topic', detail: 'Kafka · incoming records', icon: 'topic' },
    { id: 'processors', label: 'Notification processors', detail: 'Microservices · consume & route', icon: 'router' },
    { id: 'categories', label: 'Category topics', detail: 'Kafka · one path per category', icon: 'topic', repeated: true },
    { id: 'channels', label: 'Channel services', detail: 'Each consumes its own topic', icon: 'service', repeated: true, badge: 'Priority handling', kind: 'highlight' },
    { id: 'send', label: 'Send notifications', detail: 'Through the specific channel', icon: 'send' },
    { id: 'results', label: 'Cassandra', detail: 'Delivery success / failure', icon: 'database' }
  ];
  const defaults = [
    {
      name: 'Before',
      title: 'One application, shared infrastructure.',
      summary: 'RabbitMQ, a .NET monolith, and a database server shared with other systems formed the original notification setup.',
      nodes: [
        { label: 'RabbitMQ', detail: 'Message broker', icon: 'topic', kind: 'previous' },
        { label: '.NET monolith', detail: 'Application and notifications', icon: 'service', kind: 'previous' },
        { label: 'Shared database server', detail: 'Also used by other systems', icon: 'database', kind: 'shared' }
      ],
      diagramDescription: 'Before: RabbitMQ connects to a .NET monolith, which uses a database server shared with other systems.',
      note: 'The earlier architecture, simplified.'
    },
    {
      name: 'Challenges', layout: 'constraints',
      title: 'Scaling had more than one constraint.',
      summary: 'Scaling the monolith, maintaining the .NET application, and sharing the database server with other systems all had to be addressed.',
      nodes: [
        { label: 'Monolithic application', detail: 'Scaling the workload', icon: 'cluster', kind: 'highlight' },
        { label: '.NET application', detail: 'Ongoing maintenance', icon: 'service', kind: 'highlight' },
        { label: 'Shared database server', detail: 'Resources shared with other systems', icon: 'database', kind: 'shared' }
      ],
      diagramDescription: 'Three challenges: scaling a monolith, maintaining the .NET application, and sharing database-server resources with other systems.',
      note: 'The migration needed to address the application and its infrastructure.'
    },
    {
      name: 'Events',
      title: 'Start with the transaction event.',
      summary: 'The core transaction microservice produces a record in the Kafka notification topic. Notification processing microservices consume from that topic.',
      nodes: notificationNodes.slice(0, 3),
      diagramDescription: 'The core transaction microservice produces a record in the Kafka notification topic. Notification processing microservices consume from this topic.',
      note: 'Kafka separates the transaction producer from notification processing.'
    },
    {
      name: 'Routing',
      title: 'Route work into category topics.',
      summary: 'Notification processing microservices consume the incoming records and publish them into the appropriate category topics.',
      nodes: [notificationNodes[1], { ...notificationNodes[2], kind: 'highlight' }, notificationNodes[3]],
      diagramDescription: 'The initial notification topic feeds notification processing microservices, which publish records into category topics. Topics and services are shown as groups, not individual instances.',
      note: 'The shared intake becomes a separate path for each category.'
    },
    {
      name: 'Delivery', layout: 'delivery',
      title: 'Each channel owns its delivery.',
      summary: 'Channel services consume their own topics with priority handling, send notifications, and record delivery success or failure in Cassandra.',
      nodes: notificationNodes.slice(3),
      diagramDescription: 'Repeated for each category and channel: a category topic feeds its channel-specific service, which handles priority and sends notifications. The channel service also records success or failure in Cassandra.',
      note: 'Each channel consumes its own topic; every delivery has a recorded outcome.'
    },
    {
      name: 'Result', layout: 'notification',
      title: 'A clear responsibility at every step.',
      summary: 'Transactions produce records; notification processors route them into category topics; channel services handle priority, delivery, and the outcome stored in Cassandra.',
      nodes: notificationNodes,
      diagramDescription: 'Core transaction microservice produces records in the Kafka notification topic. Notification processing microservices consume this topic and publish category topics. Each channel service consumes its own topic with priority handling, sends notifications, and records success or failure in Cassandra. The grouped path repeats for each category and channel; no fixed count is implied.',
      fact: { label: 'Guaranteed SLA downtime per year, after the migration', value: '2,000 minutes → 20 minutes' }
    }
  ];

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const text = value => typeof value === 'string' ? value : '';
  const symbolNames = new Set(['database', 'service', 'topic', 'cluster', 'pipeline', 'document', 'check', 'warning', 'speed', 'cost', 'send', 'router']);
  function normalizeSteps(value, fallback = defaults) {
    if (!Array.isArray(value) || value.length < 2) return fallback;
    const valid = value.slice(0, 10).filter(step => step && text(step.name) && text(step.title) && text(step.summary) && Array.isArray(step.nodes) && step.nodes.length > 0);
    if (valid.length < 2) return fallback;
    return valid.map(step => ({
      name: text(step.name), title: text(step.title), summary: text(step.summary),
      layout: ['notification', 'delivery'].includes(step.layout) ? (['categories', 'channels', 'send', 'results'].every(id => step.nodes.some(node => node.id === id)) ? step.layout : 'flow') : (['constraints', 'components'].includes(step.layout) ? step.layout : 'flow'),
      nodes: step.nodes.slice(0, 7).map(node => ({ id: text(node.id), label: text(node.label), detail: text(node.detail), kind: text(node.kind), icon: symbolNames.has(node.icon) ? node.icon : 'service', repeated: Boolean(node.repeated), badge: text(node.badge) })),
      diagramDescription: text(step.diagramDescription) || step.nodes.map(node => text(node.label)).join(', '),
      note: text(step.note),
      fact: step.fact && text(step.fact.label) && text(step.fact.value) ? { label: text(step.fact.label), value: text(step.fact.value) } : null
    }));
  }

  const stories = [{
    id: 'notifications',
    name: 'Notifications',
    title: 'The notification migration.',
    project: 'Khan Bank / Notifications',
    steps: normalizeSteps(window.OCHI_ARCHITECTURE_STEPS)
  }];
  if (Array.isArray(window.OCHI_ARCHITECTURE_STORIES)) {
    window.OCHI_ARCHITECTURE_STORIES.forEach(value => {
      if (!value || !text(value.name) || !text(value.title) || !text(value.project)) return;
      const id = text(value.id).toLowerCase().replace(/[^a-z0-9-]/g, '');
      const normalized = normalizeSteps(value.steps, null);
      if (!id || !normalized || stories.some(story => story.id === id)) return;
      stories.push({ id, name: value.name, title: value.title, project: value.project, steps: normalized });
    });
  }
  const priority = new Map((window.OCHI_STORY_ORDER || []).map((id, index) => [id, index]));
  stories.sort((a, b) => (priority.get(a.id) ?? Infinity) - (priority.get(b.id) ?? Infinity));
  let story = stories[0];
  let steps = story.steps;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 10_000;
  let current = 0;
  let autoplay = !motion.matches;
  let visible = !('IntersectionObserver' in window);
  let hovered = false;
  let focusReading = false;
  let timer = 0;
  let tabs = [];

  root.setAttribute('aria-roledescription', 'slideshow');
  root.dataset.story = story.id;
  root.dataset.stage = '0';
  const header = element('div', 'as-heading');
  const headingText = element('div');
  headingText.append(element('h3', 'as-heading-title', 'A look under the cover'));
  headingText.append(element('p', 'as-intro', 'Notes from real problems, and how I worked through them.'));
  header.append(headingText);

  const workspace = element('div', 'as-workspace');
  const index = element('nav', 'as-story-index');
  index.setAttribute('aria-label', 'Engineering stories');
  const indexHeading = element('div', 'as-index-heading');
  indexHeading.append(element('span', '', 'Choose a story'), element('span', 'as-index-count', stories.length + ' stories'));
  index.append(indexHeading);
  const storyButtons = stories.map(value => {
    const button = element('button', 'as-story-button');
    button.type = 'button';
    button.dataset.storyId = value.id;
    button.setAttribute('aria-controls', 'architecture-current-chapter');
    button.setAttribute('aria-pressed', String(value.id === story.id));
    const copy = element('span', 'as-story-copy');
    copy.append(element('span', 'as-story-name', value.name), element('span', 'as-story-company', value.project.split(' / ')[0]));
    const marker = element('span', 'as-story-marker');
    marker.setAttribute('aria-hidden', 'true');
    button.append(copy, marker);
    button.addEventListener('click', () => selectStory(value.id));
    index.append(button);
    return button;
  });

  const storyPicker = element('div', 'as-story-picker');
  const storyLabel = element('label', 'as-story-label', 'Choose a story');
  storyLabel.htmlFor = 'architecture-story-select';
  const storySelect = element('select', 'as-story-select');
  storySelect.id = 'architecture-story-select';
  storySelect.setAttribute('aria-controls', 'architecture-current-chapter');
  stories.forEach(value => {
    const option = element('option', '', value.name);
    option.value = value.id;
    storySelect.append(option);
  });
  storyPicker.append(storyLabel, storySelect);

  const reader = element('div', 'as-reader');
  const readerHeading = element('div', 'as-reader-heading');
  const readerTitle = element('div');
  const storyProject = element('p', 'as-project', story.project);
  const storyTitle = element('h4', 'as-story-title', story.title);
  readerTitle.append(storyProject, storyTitle);
  const resultLink = element('button', 'as-result-link', 'See the result');
  resultLink.type = 'button';
  resultLink.setAttribute('aria-controls', 'architecture-current-chapter');
  resultLink.addEventListener('click', () => goTo(steps.length - 1, true));
  readerHeading.append(readerTitle, resultLink);

  const nav = element('div', 'as-stages');
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'Story chapters');

  const panel = element('div', 'as-panel');
  panel.id = 'architecture-current-chapter';
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-live', 'off');
  const title = element('h5', 'as-title');
  const summary = element('p', 'as-summary');
  const diagram = element('div', 'as-diagram');
  diagram.setAttribute('role', 'group');
  function symbol(name) {
    const icon = element('span', 'as-symbol');
    icon.dataset.symbol = symbolNames.has(name) ? name : 'service';
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }
  function diagramNode(data) {
    const node = element('div', 'as-node');
    node.dataset.kind = data.kind || '';
    node.dataset.icon = data.icon || 'service';
    if (data.id) node.dataset.nodeId = data.id;
    if (data.repeated) node.classList.add('as-node-repeated');
    const copy = element('div', 'as-node-copy');
    copy.append(element('strong', 'as-node-label', data.label), element('span', 'as-node-detail', data.detail));
    node.append(symbol(data.icon), copy);
    if (data.badge) node.append(element('span', 'as-node-badge', data.badge));
    return node;
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  function svgElement(tag, attributes) {
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }
  function renderDiagram(step) {
    diagram.replaceChildren();
    const network = ['notification', 'delivery'].includes(step.layout);
    diagram.classList.toggle('as-network', network);
    if (!network) {
      step.nodes.forEach((data, i) => {
        if (i && (step.layout || 'flow') === 'flow') {
          const wire = element('span', 'as-wire', '→');
          wire.setAttribute('aria-hidden', 'true');
          diagram.append(wire);
        }
        diagram.append(diagramNode(data));
      });
      return;
    }
    if (step.layout === 'notification') {
      const ingress = element('div', 'as-ingress');
      step.nodes.slice(0, 3).forEach(data => ingress.append(diagramNode(data)));
      diagram.append(ingress);
    }
    const perChannel = element('div', 'as-channel-group');
    perChannel.append(element('p', 'as-group-label', 'Repeated for each category / channel'));
    const path = element('div', 'as-channel-path');
    step.nodes.filter(data => ['categories', 'channels', 'send'].includes(data.id)).forEach(data => path.append(diagramNode(data)));
    perChannel.append(path);
    const storage = element('div', 'as-storage');
    storage.append(diagramNode(step.nodes.find(data => data.id === 'results')));
    diagram.append(perChannel, storage);
    const edges = svgElement('svg', { class: 'as-connections', 'aria-hidden': 'true', focusable: 'false' });
    diagram.append(edges);
    requestAnimationFrame(drawConnections);
  }
  function drawConnections() {
    const svg = diagram.querySelector('.as-connections');
    if (!svg) return;
    const box = diagram.getBoundingClientRect();
    if (!box.width || !box.height) return;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);
    svg.replaceChildren();
    const defs = svgElement('defs', {});
    const marker = svgElement('marker', { id: 'as-flow-head', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
    marker.append(svgElement('path', { d: 'M1 1L8 5L1 9', fill: 'none', stroke: '#617867', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    defs.append(marker);svg.append(defs);
    const bounds = id => {
      const node = diagram.querySelector(`[data-node-id="${id}"]`);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, bottom: r.bottom - box.top, x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    };
    const line = (points, label) => {
      const path = svgElement('path', { d: points.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' '), fill: 'none', stroke: '#617867', 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'marker-end': 'url(#as-flow-head)' });
      svg.append(path);
      if (label) {
        svg.append(svgElement('rect', { x: label.x - 58, y: label.y - 9, width: 116, height: 18, rx: 2, fill: '#f8f9ef' }));
        const text = svgElement('text', { x: label.x, y: label.y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'as-edge-label' });
        text.textContent = label.text;svg.append(text);
      }
    };
    const vertical = window.matchMedia('(max-width: 620px)').matches;
    const pair = (from, to) => {
      const a = bounds(from), b = bounds(to);
      if (!a || !b) return;
      line(vertical ? [[a.x, a.bottom + 2], [b.x, b.top - 4]] : [[a.right + 2, a.y], [b.left - 4, b.y]]);
    };
    pair('core', 'intake');pair('intake', 'processors');
    pair('categories', 'channels');pair('channels', 'send');
    const processors = bounds('processors'), categories = bounds('categories');
    if (processors && categories) {
      if (vertical) line([[processors.x, processors.bottom + 2], [categories.x, categories.top - 4]]);
      else {
        const y = processors.bottom + 29;
        line([[processors.x, processors.bottom + 2], [processors.x, y], [categories.x, y], [categories.x, categories.top - 4]], { x: (processors.x + categories.x) / 2, y, text: 'Publish by category' });
      }
    }
    const channels = bounds('channels'), results = bounds('results');
    if (channels && results) {
      if (vertical) {
        const x = box.width - 13;
        line([[channels.right + 2, channels.y], [x, channels.y], [x, results.y], [results.right + 4, results.y]]);
      } else {
        const y = channels.bottom + (results.top - channels.bottom) / 2;
        line([[channels.x, channels.bottom + 2], [results.x, results.top - 4]], { x: channels.x, y, text: 'Record delivery result' });
      }
    }
  }
  if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(drawConnections)).observe(diagram);
  else window.addEventListener('resize', drawConnections);
  const diagramKey = element('div', 'as-diagram-key');
  diagramKey.setAttribute('aria-label', 'Diagram symbols');
  const symbolLabels = { service: 'Service', topic: 'Topic / queue', database: 'Database', cluster: 'Distributed compute', pipeline: 'Processing', document: 'Document / code', check: 'Validation', warning: 'Issue', speed: 'Performance', cost: 'Cost', send: 'Delivery', router: 'Routing' };
  function renderKey(nodes) {
    diagramKey.replaceChildren();
    new Set(nodes.map(node => node.icon || 'service')).forEach(name => {
      const item = element('span');item.append(symbol(name), document.createTextNode(symbolLabels[name]));diagramKey.append(item);
    });
  }
  function keepChapterVisible() {
    const selected = tabs[current];
    if (!selected) return;
    if (selected.offsetLeft < nav.scrollLeft) nav.scrollLeft = selected.offsetLeft;
    else if (selected.offsetLeft + selected.offsetWidth > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = selected.offsetLeft + selected.offsetWidth - nav.clientWidth;
  }
  if ('ResizeObserver' in window) new ResizeObserver(keepChapterVisible).observe(nav);
  const takeaway = element('div', 'as-takeaway');
  const takeawayLabel = element('span', 'as-takeaway-label');
  const takeawayValue = element('span', 'as-takeaway-value');
  takeaway.append(takeawayLabel, takeawayValue);
  panel.append(title, summary, diagram, diagramKey, takeaway);

  const footer = element('div', 'as-footer');
  const pagination = element('div', 'as-pagination');
  const previous = element('button', 'as-arrow', '←');
  previous.type = 'button';
  previous.setAttribute('aria-label', 'Previous architecture chapter');
  const count = element('span', 'as-count');
  count.setAttribute('aria-hidden', 'true');
  const next = element('button', 'as-arrow as-next');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next architecture chapter');
  const nextLabel = element('span', 'as-next-label', 'Next chapter');
  const nextIcon = element('span', 'as-next-icon', '→');
  nextIcon.setAttribute('aria-hidden', 'true');
  next.append(nextLabel, nextIcon);
  pagination.append(previous, count, next);
  const playback = element('div', 'as-playback');
  const toggle = element('button', 'as-autoplay');
  toggle.type = 'button';
  toggle.setAttribute('aria-controls', panel.id);
  const toggleIcon = element('span', 'as-autoplay-icon');
  toggleIcon.setAttribute('aria-hidden', 'true');
  const toggleLabel = element('span');
  toggle.append(toggleIcon, toggleLabel);
  playback.append(toggle);
  footer.append(pagination, playback);
  const playbackNote = element('p', 'as-playback-note');
  const live = element('div', 'as-sr-only');
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  reader.append(readerHeading, nav, panel, footer, playbackNote);
  workspace.append(index, storyPicker, reader);
  root.replaceChildren(header, workspace, live);

  function refreshTabs() {
    nav.dataset.chapters = String(steps.length);
    tabs = steps.map((step, index) => {
      const button = element('button', 'as-stage');
      const number = element('span', 'as-stage-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      button.append(number, element('span', 'as-stage-name', step.name));
      button.type = 'button';
      button.id = `architecture-${story.id}-chapter-${index}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panel.id);
      button.addEventListener('click', () => goTo(index, true));
      button.addEventListener('keydown', event => {
        let target;
        if (event.key === 'ArrowRight') target = (current + 1) % steps.length;
        if (event.key === 'ArrowLeft') target = (current - 1 + steps.length) % steps.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = steps.length - 1;
        if (target === undefined) return;
        event.preventDefault();
        goTo(target, true);
        tabs[target].focus();
      });
      return button;
    });
    nav.replaceChildren(...tabs);
  }

  function updatePlayback() {
    toggleLabel.textContent = autoplay ? 'Pause story' : 'Play story';
    toggleIcon.textContent = autoplay ? 'Ⅱ' : '▶';
    toggle.setAttribute('aria-label', autoplay ? 'Pause automatic architecture story' : 'Play automatic architecture story');
    root.dataset.autoplay = String(autoplay);
    if (!autoplay) playbackNote.textContent = 'Take your time. Move through the chapters, or press play.';
    else if (hovered || focusReading) playbackNote.textContent = 'Paused for reading. Continues when you move away.';
    else playbackNote.textContent = 'Playing automatically. The next chapter appears in 10 seconds.';
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = 0;
    updatePlayback();
    if (!autoplay || !visible || hovered || focusReading || document.hidden) return;
    timer = window.setTimeout(() => goTo((current + 1) % steps.length, false), interval);
  }

  function render() {
    const step = steps[current];
    storyTitle.textContent = story.title;
    storyProject.textContent = story.project;
    storySelect.value = story.id;
    storyButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.storyId === story.id)));
    title.textContent = step.title;
    summary.textContent = step.summary;
    diagram.setAttribute('aria-label', step.diagramDescription);
    diagram.dataset.nodes = String(step.nodes.length);
    const layout = step.layout || 'flow';
    renderDiagram(step);
    renderKey(step.nodes);
    takeaway.classList.toggle('as-takeaway-fact', Boolean(step.fact));
    takeawayLabel.textContent = step.fact?.label || '';
    takeawayValue.textContent = step.fact?.value || step.note || '';
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === current));
      tab.tabIndex = index === current ? 0 : -1;
      tab.dataset.complete = String(index < current);
    });
    panel.setAttribute('aria-labelledby', tabs[current].id);
    count.textContent = `${current + 1} of ${steps.length}`;
    nextLabel.textContent = current === steps.length - 1 ? 'Start again' : 'Next chapter';
    keepChapterVisible();
    root.dataset.story = story.id;
    root.dataset.stage = String(current);
    root.dataset.layout = layout;
    schedule();
  }

  function goTo(index, manual) {
    current = (index + steps.length) % steps.length;
    if (manual) {
      autoplay = false;
      live.textContent = `${story.name}. Chapter ${current + 1} of ${steps.length}: ${steps[current].name}. ${steps[current].title}`;
    }
    render();
  }

  function selectStory(id) {
    story = stories.find(value => value.id === id) || stories[0];
    steps = story.steps;
    current = 0;
    autoplay = false;
    refreshTabs();
    render();
    live.textContent = `${story.name}. Chapter 1 of ${steps.length}: ${steps[0].name}. ${steps[0].title}`;
  }
  storySelect.addEventListener('change', () => selectStory(storySelect.value));

  function revealStory(id) {
    if (!stories.some(value => value.id === id)) return;
    selectStory(id);
    if (window.location.hash !== '#architecture-story-widget') window.history.pushState(null, '', '#architecture-story-widget');
    root.scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth', block: 'start' });
    tabs[0].focus({ preventScroll: true });
  }
  window.addEventListener('ochi:open-architecture-story', event => revealStory(event.detail?.id));

  document.querySelectorAll('a[data-architecture-story]').forEach(link => {
    const target = link.dataset.architectureStory;
    if (!stories.some(value => value.id === target)) return;
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      revealStory(target);
    });
  });

  previous.addEventListener('click', () => goTo(current - 1, true));
  next.addEventListener('click', () => goTo(current + 1, true));
  toggle.addEventListener('click', () => {
    autoplay = !autoplay;
    // An explicit keyboard Play action can resume without moving focus.
    focusReading = false;
    schedule();
  });
  panel.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    schedule();
  });
  panel.addEventListener('pointerleave', () => { hovered = false;schedule(); });
  root.addEventListener('focusin', () => { focusReading = true;schedule(); });
  root.addEventListener('focusout', event => {
    if (root.contains(event.relatedTarget)) return;
    focusReading = false;
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  const onMotionChange = () => { if (motion.matches) autoplay = false;schedule(); };
  if (motion.addEventListener) motion.addEventListener('change', onMotionChange);
  else if (motion.addListener) motion.addListener(onMotionChange);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      schedule();
    }, { threshold: [0, 0.25] });
    observer.observe(root);
  }
  window.addEventListener('ochi:architecture-steps', event => {
    steps = normalizeSteps(event.detail);
    story.steps = steps;
    current = 0;
    refreshTabs();
    render();
  });
  refreshTabs();
  render();
})();
