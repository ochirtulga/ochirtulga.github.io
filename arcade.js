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
  const header = element('div', 'arcade-heading');
  header.append(element('span', '', 'The after-hours arcade'), element('span', 'arcade-game-count', '2 games'));
  shell.append(header, makeTabs('shelf'));
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
    const panel = element('div', 'arcade-game-panel');
    panel.id = `arcade-session-${id}`;panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `arcade-modal-${id}-tab-${id}`);
    while (heading.nextSibling) panel.append(heading.nextSibling);
    dialog.append(makeTabs('modal-' + id, true), panel);
    dialog.classList.add('arcade-dialog');
    dialog.addEventListener('close', () => {
      if (active !== id) return;
      active = null;
      const target = returnFocus?.isConnected && returnFocus.getClientRects().length ? returnFocus : shell.querySelector(`[data-arcade-game="${selected}"]`);
      target?.focus({ preventScroll: true });
    });
    updateTabs();
  }
  document.querySelectorAll('[data-arcade-open]').forEach(button => button.addEventListener('click', () => launch(button.dataset.arcadeOpen, button)));
  window.OCHI_ARCADE = Object.freeze({ register, select, launch });
  updateTabs();
})();
