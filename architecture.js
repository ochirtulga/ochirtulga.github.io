(() => {
  'use strict';

  const root = document.getElementById('architecture-story-widget');
  if (!root) return;

  const defaults = [
    {
      name: 'Before',
      title: 'One application, shared infrastructure.',
      summary: 'RabbitMQ, a .NET monolith, and a database server shared with other systems formed the original notification setup.',
      nodes: [
        { label: 'RabbitMQ', detail: 'Message broker', kind: 'previous' },
        { label: '.NET monolith', detail: 'Application and notifications', kind: 'previous' },
        { label: 'Shared database server', detail: 'Also used by other systems', kind: 'shared' }
      ],
      diagramDescription: 'The earlier system used RabbitMQ, a .NET monolith, and a database server shared with other systems.',
      note: 'The earlier architecture, simplified.'
    },
    {
      name: 'Challenges',
      title: 'Scaling had more than one constraint.',
      summary: 'Scaling the monolith, maintaining the .NET application, and sharing the database server with other systems all had to be addressed.',
      nodes: [
        { label: 'Monolithic application', detail: 'Scaling the workload', kind: 'highlight' },
        { label: '.NET application', detail: 'Ongoing maintenance', kind: 'highlight' },
        { label: 'Shared database server', detail: 'Resources shared with other systems', kind: 'shared' }
      ],
      diagramDescription: 'Three challenges: scaling a monolith, maintaining the .NET application, and sharing database-server resources with other systems.',
      note: 'The migration needed to address the application and its infrastructure.'
    },
    {
      name: 'Events',
      title: 'Introduce an asynchronous event layer.',
      summary: 'The new architecture used the bank’s first Kafka cluster for event streaming and asynchronous messaging.',
      nodes: [
        { label: 'Banking events', detail: 'The starting point' },
        { label: 'Kafka cluster', detail: 'The bank’s first', kind: 'highlight' },
        { label: 'Notifications', detail: 'Asynchronous processing' }
      ],
      diagramDescription: 'Banking events connect through the Kafka cluster to asynchronous notification processing.',
      note: 'A dedicated event layer in the new architecture.'
    },
    {
      name: 'Service',
      title: 'Give notifications a service of their own.',
      summary: 'The SMS workload moved out of the monolith into a focused Java and Spring Boot microservice.',
      nodes: [
        { label: 'Banking events', detail: 'The starting point' },
        { label: 'Kafka', detail: 'Event stream' },
        { label: 'SMS notifications', detail: 'Java / Spring Boot', kind: 'highlight' }
      ],
      diagramDescription: 'Banking events connect through Kafka to a dedicated Java and Spring Boot SMS notification microservice.',
      note: 'The notification responsibility has a focused service boundary.'
    },
    {
      name: 'Data',
      title: 'A data layer built around notifications.',
      summary: 'The notification microservice uses Cassandra for storage. It has a defined data layer alongside the Kafka event stream.',
      nodes: [
        { label: 'Banking events', detail: 'The starting point' },
        { label: 'Kafka', detail: 'Event stream' },
        { label: 'Notifications', detail: 'Java microservice' },
        { label: 'Cassandra', detail: 'Data layer', kind: 'highlight' }
      ],
      diagramDescription: 'Banking events, Kafka, the Java notification microservice, and Cassandra form the migrated architecture.',
      note: 'Cassandra supports the migrated notification service.'
    },
    {
      name: 'Result',
      title: 'One service. A clear job.',
      summary: 'The result brings Kafka, a Java and Spring Boot notification service, and Cassandra together in a focused architecture.',
      nodes: [
        { label: 'Banking events', detail: 'The starting point' },
        { label: 'Kafka', detail: 'Event stream' },
        { label: 'Notifications', detail: 'Java microservice', kind: 'highlight' },
        { label: 'Cassandra', detail: 'Data layer' }
      ],
      diagramDescription: 'The resulting notification architecture uses Kafka, a dedicated Java service, and Cassandra.',
      fact: { label: 'Guaranteed SLA downtime per year', value: '2,000 minutes → 20 minutes' }
    }
  ];

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const text = value => typeof value === 'string' ? value : '';
  function normalizeSteps(value) {
    if (!Array.isArray(value) || value.length < 2) return defaults;
    const valid = value.slice(0, 10).filter(step => step && text(step.name) && text(step.title) && text(step.summary) && Array.isArray(step.nodes) && step.nodes.length > 0);
    if (valid.length < 2) return defaults;
    return valid.map(step => ({
      name: text(step.name), title: text(step.title), summary: text(step.summary),
      nodes: step.nodes.slice(0, 5).map(node => ({ label: text(node.label), detail: text(node.detail), kind: text(node.kind) })),
      diagramDescription: text(step.diagramDescription) || step.nodes.map(node => text(node.label)).join(', '),
      note: text(step.note),
      fact: step.fact && text(step.fact.label) && text(step.fact.value) ? { label: text(step.fact.label), value: text(step.fact.value) } : null
    }));
  }

  let steps = normalizeSteps(window.OCHI_ARCHITECTURE_STEPS);
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
  root.dataset.stage = '0';
  const header = element('div', 'as-heading');
  const headingText = element('div');
  headingText.append(element('span', 'as-caption', 'A look under the cover'));
  headingText.append(element('h3', 'as-heading-title', 'The notification migration.'));
  header.append(headingText, element('span', 'as-project', 'Khan Bank / Notifications'));

  const nav = element('div', 'as-stages');
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'Migration chapters');

  const panel = element('div', 'as-panel');
  panel.id = 'architecture-current-chapter';
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-live', 'off');
  const title = element('h4', 'as-title');
  const summary = element('p', 'as-summary');
  const diagram = element('div', 'as-diagram');
  diagram.setAttribute('role', 'group');
  const slots = [];
  const connectors = [];
  for (let index = 0; index < 5; index += 1) {
    if (index) {
      const connector = element('span', 'as-wire');
      connector.setAttribute('aria-hidden', 'true');
      diagram.append(connector);
      connectors.push(connector);
    }
    const node = element('div', 'as-node');
    const label = element('strong', 'as-node-label');
    const detail = element('span', 'as-node-detail');
    node.append(label, detail);
    diagram.append(node);
    slots.push({ node, label, detail });
  }
  const takeaway = element('div', 'as-takeaway');
  const takeawayLabel = element('span', 'as-takeaway-label');
  const takeawayValue = element('span', 'as-takeaway-value');
  takeaway.append(takeawayLabel, takeawayValue);
  panel.append(title, summary, diagram, takeaway);

  const footer = element('div', 'as-footer');
  const pagination = element('div', 'as-pagination');
  const previous = element('button', 'as-arrow', '←');
  previous.type = 'button';
  previous.setAttribute('aria-label', 'Previous architecture chapter');
  const count = element('span', 'as-count');
  count.setAttribute('aria-hidden', 'true');
  const next = element('button', 'as-arrow', '→');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next architecture chapter');
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
  root.replaceChildren(header, nav, panel, footer, playbackNote, live);

  function refreshTabs() {
    tabs = steps.map((step, index) => {
      const button = element('button', 'as-stage', step.name);
      button.type = 'button';
      button.id = `architecture-chapter-${index}`;
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
    if (!autoplay) playbackNote.textContent = motion.matches ? 'Choose a chapter, or play the story at your own pace.' : 'Paused. Explore the chapters at your own pace.';
    else if (hovered || focusReading) playbackNote.textContent = 'Paused while you explore. Continues when you leave the story.';
    else playbackNote.textContent = 'Changes automatically every 10 seconds. Pause whenever you like.';
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
    title.textContent = step.title;
    summary.textContent = step.summary;
    diagram.setAttribute('aria-label', step.diagramDescription);
    diagram.dataset.nodes = String(step.nodes.length);
    slots.forEach((slot, index) => {
      const data = step.nodes[index];
      slot.node.hidden = !data;
      slot.label.textContent = data?.label || '';
      slot.detail.textContent = data?.detail || '';
      slot.node.dataset.kind = data?.kind || '';
    });
    connectors.forEach((connector, index) => { connector.hidden = index >= step.nodes.length - 1; });
    takeaway.classList.toggle('as-takeaway-fact', Boolean(step.fact));
    takeawayLabel.textContent = step.fact?.label || '';
    takeawayValue.textContent = step.fact?.value || step.note || '';
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === current));
      tab.tabIndex = index === current ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[current].id);
    count.textContent = `${current + 1} / ${steps.length}`;
    root.dataset.stage = String(current);
    schedule();
  }

  function goTo(index, manual) {
    current = (index + steps.length) % steps.length;
    if (manual) {
      autoplay = false;
      live.textContent = `Chapter ${current + 1} of ${steps.length}: ${steps[current].name}. ${steps[current].title}`;
    }
    render();
  }

  previous.addEventListener('click', () => goTo(current - 1, true));
  next.addEventListener('click', () => goTo(current + 1, true));
  toggle.addEventListener('click', () => {
    autoplay = !autoplay;
    // An explicit keyboard Play action can resume without moving focus.
    focusReading = false;
    schedule();
  });
  root.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    schedule();
  });
  root.addEventListener('pointerleave', () => { hovered = false;schedule(); });
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
    current = 0;
    refreshTabs();
    render();
  });
  refreshTabs();
  render();
})();
