(() => {
  'use strict';
  const mount = document.getElementById('game-cartridge');
  if (!mount) return;
  const games = [
    { id: 'leaf-keeper', title: 'Leaf keeper', mark: 'leaf' },
    { id: 'basketball', title: 'Basketball', mark: 'ball' }
  ];
  const controllers = new Map();
  const tabGroups = [];
  const soundButtons = [];
  const audio = window.OCHI_ARCADE_AUDIO;
  let selected = 'leaf-keeper';
  let active = null;
  let closing = null;
  let returnFocus = null;
  let launchVersion = 0;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function makeSoundButton() {
    const button = element('button', 'arcade-sound-toggle');
    button.type = 'button';button.setAttribute('aria-label', 'Game sounds');
    button.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/><path class="arcade-sound-waves" d="M16 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/><path class="arcade-sound-slash" d="m17 9 5 6m0-6-5 6"/></svg>';
    button.append(element('span', 'arcade-sound-text'));
    button.addEventListener('click', () => {
      if (!audio?.supported) return;
      audio.setEnabled(!audio.enabled);
      if (audio.enabled) void audio.unlock().then(ready => { if (ready) audio.play('catch'); });
    });
    soundButtons.push(button);return button;
  }
  function updateSoundButtons() {
    soundButtons.forEach(button => {
      const enabled = Boolean(audio?.enabled && audio?.supported);
      button.disabled = !audio?.supported;
      button.dataset.enabled = String(enabled);
      button.setAttribute('aria-pressed', String(enabled));
      button.title = audio?.supported ? enabled ? 'Mute game sounds' : 'Turn on game sounds' : 'Game sound is unavailable in this browser';
      button.querySelector('.arcade-sound-text').textContent = audio?.supported ? enabled ? 'Sound on' : 'Sound off' : 'No sound';
    });
  }
  function makeTabs(scope, modal = false) {
    const tabs = element('div', 'arcade-game-tabs' + (modal ? ' arcade-modal-tabs' : ''));
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', modal ? 'Switch arcade game' : 'Choose an arcade game');
    games.forEach((game, index) => {
      const button = element('button', 'arcade-game-tab');
      button.id = `arcade-${scope}-tab-${game.id}`;
      button.type = 'button';button.dataset.arcadeGame = game.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', modal ? `arcade-session-${game.id}` : `arcade-panel-${game.id}`);
      const mark = element('span', 'arcade-tab-mark arcade-tab-' + game.mark);
      mark.setAttribute('aria-hidden', 'true');
      button.append(mark, document.createTextNode(game.title));
      const choose = () => modal ? launch(game.id, button) : select(game.id, true);
      button.addEventListener('click', choose);
      button.addEventListener('keydown', event => {
        let target;
        if (event.key === 'ArrowRight') target = (index + 1) % games.length;
        if (event.key === 'ArrowLeft') target = (index - 1 + games.length) % games.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = games.length - 1;
        if (target === undefined || !controllers.has(games[target].id)) return;
        event.preventDefault();event.stopPropagation();
        if (modal) launch(games[target].id, button);
        else select(games[target].id, true);
      });
      tabs.append(button);
    });
    tabGroups.push(tabs);return tabs;
  }
  const shell = element('div', 'arcade-shell');
  const grip = element('div', 'arcade-grip');
  grip.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i++) grip.append(element('span'));
  const header = element('div', 'arcade-heading');
  const headerTools = element('div', 'arcade-heading-tools');
  const title = element('h3', 'arcade-title', 'The after-hours arcade');
  title.id = 'arcade-title';
  shell.setAttribute('role', 'group');shell.setAttribute('aria-labelledby', title.id);
  headerTools.append(makeSoundButton());
  header.append(title, headerTools);
  shell.append(grip, header, makeTabs('shelf'));
  games.forEach(game => {
    const panel = element('div', 'arcade-cartridge-panel');
    panel.id = `arcade-panel-${game.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `arcade-shelf-tab-${game.id}`);
    panel.hidden = game.id !== selected;
    const gameMount = element('div');
    gameMount.id = game.id === 'leaf-keeper' ? 'leaf-keeper-mount' : 'basketball-mount';
    panel.append(gameMount);shell.append(panel);
  });
  ['left', 'right'].forEach(side => {
    const screw = element('span', 'arcade-screw arcade-screw-' + side);
    screw.setAttribute('aria-hidden', 'true');shell.append(screw);
  });
  mount.replaceChildren(shell);
  function updateTabs() {
    tabGroups.forEach(group => group.querySelectorAll('[role=tab]').forEach(tab => {
      const isSelected = tab.dataset.arcadeGame === selected;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      tab.disabled = !controllers.has(tab.dataset.arcadeGame);
    }));
  }
  function select(id, focus = false) {
    if (!games.some(game => game.id === id) || !controllers.has(id)) return false;
    if (active && active !== id && controllers.get(active)?.dialog.open) { launch(id);return true; }
    selected = id;mount.dataset.game = id;
    games.forEach(game => { document.getElementById(`arcade-panel-${game.id}`).hidden = game.id !== id; });
    updateTabs();
    if (focus) shell.querySelector(`[role=tab][data-arcade-game="${id}"]`).focus({ preventScroll: true });
    return true;
  }
  function launch(id, source) {
    const controller = controllers.get(id);
    if (!controller) return;
    const fromDialog = Boolean(source?.closest('dialog'));
    if (active === id && controller.dialog.open) return;
    audio?.stop();void audio?.unlock();
    if (!active && !fromDialog) returnFocus = source || shell.querySelector(`[data-arcade-game="${id}"]`);
    const version = ++launchVersion;
    const start = () => {
      if (version !== launchVersion) return;
      active = null;select(id);active = id;
      controller.open();
      if (fromDialog) controller.dialog.querySelector(`.arcade-modal-tabs [data-arcade-game="${id}"]`)?.focus({ preventScroll: true });
    };
    if (closing) { closing.dialog.addEventListener('close', start, { once: true });return; }
    const previous = active && controllers.get(active);
    if (previous?.dialog.open) {
      // Native close dispatches asynchronously. Finish the old game's cleanup
      // before opening the next one, including cancellation of pending starts.
      active = null;
      closing = previous;
      previous.dialog.addEventListener('close', () => { closing = null;start(); }, { once: true });
      previous.close();
    } else start();
  }
  function register(id, controller) {
    if (!games.some(game => game.id === id) || controllers.has(id) || !controller?.dialog || typeof controller.open !== 'function' || typeof controller.close !== 'function') return;
    controllers.set(id, controller);
    const dialog = controller.dialog;
    const heading = dialog.firstElementChild;
    const tools = element('div', 'arcade-dialog-actions');
    const closeButton = heading.querySelector('button');
    tools.append(makeSoundButton());if (closeButton) tools.append(closeButton);heading.append(tools);
    const unlockSound = () => { void audio?.unlock(); };
    dialog.addEventListener('pointerdown', unlockSound, { capture: true });
    dialog.addEventListener('keydown', unlockSound, { capture: true });
    const panel = element('div', 'arcade-game-panel');
    panel.id = `arcade-session-${id}`;panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `arcade-modal-${id}-tab-${id}`);
    while (heading.nextSibling) panel.append(heading.nextSibling);
    dialog.append(makeTabs('modal-' + id, true), panel);
    dialog.classList.add('arcade-dialog');
    dialog.addEventListener('close', () => {
      audio?.stop();
      if (active !== id) return;
      active = null;
      const target = returnFocus?.isConnected && returnFocus.getClientRects().length ? returnFocus : shell.querySelector(`[data-arcade-game="${selected}"]`);
      target?.focus({ preventScroll: true });
    });
    updateTabs();updateSoundButtons();
  }
  document.querySelectorAll('[data-arcade-open]').forEach(button => button.addEventListener('click', () => launch(button.dataset.arcadeOpen, button)));
  window.OCHI_ARCADE = Object.freeze({ register, select, launch });
  audio?.subscribe(updateSoundButtons);
  updateTabs();updateSoundButtons();
})();
