(() => {
  'use strict';

  const mount = document.getElementById('leaf-keeper-mount');
  if (!mount) return;

  mount.innerHTML = `
    <div class="gk-cartridge" aria-label="Leaf keeper, an original little game">
      <div class="gk-cart-grip" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="gk-cart-label">
        <div class="gk-label-heading"><span>Ochi's after-hours collection</span><span aria-hidden="true">✳</span></div>
        <h3>Leaf keeper</h3>
        <canvas class="gk-cover-art" width="280" height="104" aria-hidden="true"></canvas>
        <p>A small game for a little break.</p>
      </div>
      <div class="gk-cart-bottom"><span class="gk-cart-mark">Made to play</span><button class="gk-play" type="button">Play a round <span aria-hidden="true">▶</span></button></div>
      <span class="gk-screw gk-screw-left" aria-hidden="true"></span><span class="gk-screw gk-screw-right" aria-hidden="true"></span>
    </div>
    <dialog class="gk-dialog" aria-labelledby="gk-title" aria-describedby="gk-instructions">
      <div class="gk-dialog-heading"><div><p class="gk-dialog-kicker">A little intermission</p><h2 id="gk-title">Leaf keeper</h2></div><button class="gk-close" type="button" aria-label="Close game">×</button></div>
      <p id="gk-instructions" class="gk-instructions">Catch falling leaves. Drag the basket, or move with ← → / A D and the buttons below.</p>
      <div class="gk-player"><label for="gk-player-name">Nickname <span>(optional)</span></label><input id="gk-player-name" type="text" maxlength="24" placeholder="Anonymous" autocomplete="nickname" aria-describedby="gk-player-note"><p id="gk-player-note">Your nickname and best score appear on the shared leaderboard.</p></div>
      <p class="gk-player-summary" hidden></p>
      <div class="gk-game-status"><span>Leaves <strong id="gk-score">0</strong></span><span>Time <strong id="gk-time">25</strong><span class="gk-seconds"> sec</span></span></div>
      <canvas class="gk-canvas" width="480" height="300" role="img" aria-label="A basket catching falling leaves in a garden"></canvas>
      <div class="gk-controls"><div class="gk-movement"><button class="gk-move" type="button" data-direction="left" aria-label="Move basket left">←</button><button class="gk-move" type="button" data-direction="right" aria-label="Move basket right">→</button></div><div class="gk-round-controls"><button class="gk-pause" type="button" disabled>Pause</button><button class="gk-start" type="button">Start round</button></div></div>
      <p class="gk-message" role="status" aria-live="polite">25 seconds. A basket. A few falling leaves.</p>
      <section class="gk-leaderboard" hidden aria-labelledby="gk-leaderboard-title"><div class="gk-board-heading"><h3 id="gk-leaderboard-title">The garden leaderboard</h3><span class="gk-board-scope">Top 10</span></div><p class="gk-result-line"></p><p class="gk-board-status" role="status" aria-live="polite"></p><div class="gk-board-table-wrap" hidden><table class="gk-board-table"><thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">Leaves</th></tr></thead><tbody></tbody></table></div><p class="gk-board-empty" hidden>No scores yet. Set the first one.</p><button class="gk-board-retry" type="button" hidden>Try saving again</button></section>
      <p class="gk-game-credit">An original game, grown for this portfolio.</p>
    </dialog>`;

  const playButton = mount.querySelector('.gk-play');
  const dialog = mount.querySelector('.gk-dialog');
  const canvas = mount.querySelector('.gk-canvas');
  const context = canvas.getContext('2d');
  const scoreLabel = mount.querySelector('#gk-score');
  const timeLabel = mount.querySelector('#gk-time');
  const message = mount.querySelector('.gk-message');
  const startButton = mount.querySelector('.gk-start');
  const pauseButton = mount.querySelector('.gk-pause');
  const cover = mount.querySelector('.gk-cover-art');
  const player = mount.querySelector('.gk-player');
  const nameInput = mount.querySelector('#gk-player-name');
  const playerSummary = mount.querySelector('.gk-player-summary');
  const board = mount.querySelector('.gk-leaderboard');
  const boardStatus = mount.querySelector('.gk-board-status');
  const boardRetry = mount.querySelector('.gk-board-retry');
  const boardBody = mount.querySelector('.gk-board-table tbody');
  const boardTable = mount.querySelector('.gk-board-table-wrap');
  const boardEmpty = mount.querySelector('.gk-board-empty');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const WORLD = { width: 480, height: 300, ground: 269 };
  const keys = { left: false, right: false };
  let animation = 0;
  let lastFrame = 0;
  let state = 'ready';
  let score = 0;
  let remaining = 25;
  let spawnClock = 0;
  let basketX = 240;
  let leaves = [];
  let lastShownSecond = 25;
  let runVersion = 0;
  let currentRound = null;
  let pauseAfterStart = false;
  let latestFinishedRound = null;
  let visibleResult = null;
  let showingPreviousRound = false;
  const playerId = getPlayerId();
  try { nameInput.value = localStorage.getItem('ochi-leaf-keeper-name') || ''; } catch (_) { /* Remembering a name is optional. */ }

  function normalizeName(value) {
    return Array.from(String(value || '').normalize('NFKC').replace(/[\u0000-\u001f\u007f-\u009f]/g, '').replace(/\s+/g, ' ').trim()).slice(0, 24).join('') || 'Anonymous';
  }

  function newId() {
    if (typeof window.crypto?.randomUUID === 'function') return window.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
    else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function getPlayerId() {
    try {
      const saved = localStorage.getItem('ochi-leaf-keeper-player');
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(saved || '')) return saved;
    } catch (_) { /* Use an in-memory identity when storage is unavailable. */ }
    const id = newId();
    try { localStorage.setItem('ochi-leaf-keeper-player', id); } catch (_) { /* The game still works without storage. */ }
    return id;
  }

  async function apiRequest(path, body) {
    const base = String(window.LEAF_KEEPER_API_BASE || '').replace(/\/$/, '');
    if (!base) throw new Error('Leaderboard is not configured.');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(base + path, {
        method: body ? 'POST' : 'GET',
        credentials: 'omit',
        cache: 'no-store',
        headers: body ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Leaderboard request failed.');
      return await response.json();
    } finally { clearTimeout(timeout); }
  }

  async function startRoundSession() {
    const session = await apiRequest('/rounds/start', { playerId });
    if (typeof session.roundId !== 'string' || typeof session.token !== 'string') throw new Error('Invalid round session.');
    return { roundId: session.roundId, token: session.token };
  }

  function validEntries(value) {
    return Array.isArray(value) ? value.filter(entry => entry && typeof entry.id === 'string' && typeof entry.name === 'string' && Number.isInteger(entry.score) && entry.score >= 0 && entry.score <= 41).slice(0, 10) : [];
  }

  function renderResult(round) {
    if (visibleResult !== round) return;
    mount.querySelector('.gk-result-line').textContent = `${showingPreviousRound ? 'Last round: ' : ''}${round.name}, you gathered ${round.score} ${round.score === 1 ? 'leaf' : 'leaves'}.`;
    board.setAttribute('aria-busy', String(round.saveState === 'saving' || round.loadingBoard));
    boardStatus.classList.toggle('gk-board-status-error', round.saveState === 'failed' || round.boardFailed);
    if (round.saveState === 'saving') boardStatus.textContent = 'Saving your personal best…';
    else if (round.saveState === 'saved') boardStatus.textContent = round.rank ? `Your personal best is #${round.rank}. There’s always another season.` : 'Your best score is saved. Can you make the top 10?';
    else if (round.saveState === 'failed') boardStatus.textContent = 'Your score hasn’t been confirmed yet. Try saving again.';
    else boardStatus.textContent = 'This round wasn’t connected to the leaderboard. Play again to post a score.';
    if (round.loadingBoard && round.saveState !== 'saving') boardStatus.textContent += ' Loading the top 10…';
    else if (round.boardFailed) boardStatus.textContent += ' The leaderboard couldn’t load right now.';
    boardBody.replaceChildren();
    const entries = round.entries;
    boardTable.hidden = !entries || entries.length === 0;
    boardEmpty.hidden = !entries || entries.length > 0;
    if (entries) entries.forEach((entry, index) => {
      const row = document.createElement('tr');
      const rank = document.createElement('td');rank.textContent = String(index + 1);
      const name = document.createElement('td');name.textContent = normalizeName(entry.name);
      const leaves = document.createElement('td');leaves.textContent = String(entry.score);
      if (entry.id === round.entry?.id) {
        row.className = 'gk-board-current';
        const you = document.createElement('span');you.className = 'gk-you';you.textContent = 'you';name.append(you);
      }
      row.append(rank, name, leaves);boardBody.append(row);
    });
    boardRetry.hidden = round.saveState === 'saving' || (round.saveState === 'saved' && !round.boardFailed) || (round.saveState === 'unranked' && !round.boardFailed);
    boardRetry.disabled = Boolean(round.inFlight || round.loadingBoard);
    boardRetry.textContent = round.saveState === 'failed' ? 'Try saving again' : 'Refresh leaderboard';
  }

  async function fetchLeaderboard(round) {
    if (round.loadingBoard) return;
    round.loadingBoard = true;round.boardFailed = false;renderResult(round);
    try {
      const data = await apiRequest('/leaderboard');
      if (!Array.isArray(data.entries)) throw new Error('Invalid leaderboard.');
      round.entries = validEntries(data.entries);
      if (round.saveState === 'saved' && round.entry?.id) {
        const currentPosition = round.entries.findIndex(entry => entry.id === round.entry.id);
        round.rank = currentPosition >= 0 ? currentPosition + 1 : null;
      }
    }
    catch (_) { round.boardFailed = true; }
    finally { round.loadingBoard = false;renderResult(round); }
  }

  async function saveResult(round) {
    if (!round.session) { await fetchLeaderboard(round);return; }
    if (round.inFlight || round.saveState === 'saved') return;
    round.inFlight = true;round.saveState = 'saving';round.boardFailed = false;renderResult(round);
    try {
      const data = await apiRequest('/scores', { roundId: round.session.roundId, token: round.session.token, name: round.name, score: round.score });
      if (!data.entry || typeof data.entry.id !== 'string' || !Array.isArray(data.entries)) throw new Error('Invalid score response.');
      round.entry = data.entry;
      round.entries = validEntries(data.entries);
      round.rank = Number.isInteger(data.rank) && data.rank > 0 ? data.rank : null;
      round.saveState = 'saved';
    } catch (_) { round.saveState = 'failed';await fetchLeaderboard(round); }
    finally { round.inFlight = false;renderResult(round); }
  }

  function showResult(round, previous = false) {
    visibleResult = round;showingPreviousRound = previous;board.hidden = false;renderResult(round);
  }

  function pixelTree(ctx, x, y, scale = 1, foliage = '#467249') {
    const shapes = [
      [-5, -11, 10, 6], [-9, -8, 18, 8], [-12, -4, 24, 9],
      [-9, 2, 18, 5], [-5, 6, 10, 3]
    ];
    ctx.fillStyle = '#8e7152';
    ctx.fillRect(x - 2 * scale, y, 4 * scale, 18 * scale);
    ctx.fillRect(x - 6 * scale, y + 6 * scale, 8 * scale, 3 * scale);
    ctx.fillStyle = foliage;
    shapes.forEach(([left, top, width, height]) => ctx.fillRect(x + left * scale, y + top * scale, width * scale, height * scale));
    ctx.fillStyle = '#719259';
    ctx.fillRect(x - 8 * scale, y - 5 * scale, 5 * scale, 5 * scale);
    ctx.fillRect(x + 2 * scale, y + 1 * scale, 6 * scale, 4 * scale);
  }

  function drawCover() {
    const ctx = cover.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#e9ecd7';
    ctx.fillRect(0, 0, 280, 104);
    ctx.fillStyle = '#d5dec1';
    ctx.fillRect(0, 81, 280, 23);
    pixelTree(ctx, 65, 51, 2.1);
    pixelTree(ctx, 219, 65, 1.35, '#5d7c4a');
    ctx.fillStyle = '#a3b98b';
    [[8, 89, 24], [92, 93, 17], [235, 88, 32]].forEach(([x, y, width]) => ctx.fillRect(x, y, width, 3));
    ctx.fillStyle = '#c28d48';
    ctx.fillRect(142, 37, 5, 8);
    ctx.fillRect(146, 34, 4, 6);
    ctx.fillStyle = '#b79565';
    ctx.fillRect(131, 83, 32, 15);
    ctx.fillStyle = '#755f43';
    ctx.fillRect(129, 80, 36, 4);
    ctx.fillRect(137, 83, 2, 15);
    ctx.fillRect(153, 83, 2, 15);
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.getBoundingClientRect().width || WORLD.width;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(width * WORLD.height / WORLD.width * dpr);
    context.setTransform(canvas.width / WORLD.width, 0, 0, canvas.height / WORLD.height, 0, 0);
    draw();
  }

  function drawLeaf(leaf) {
    context.save();
    context.translate(leaf.x, leaf.y);
    context.rotate(leaf.rotation);
    context.fillStyle = leaf.color;
    context.beginPath();
    context.moveTo(0, -9);
    context.quadraticCurveTo(13, -4, 2, 9);
    context.quadraticCurveTo(-10, 5, 0, -9);
    context.fill();
    context.strokeStyle = '#5b693b';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(-1, 6);
    context.lineTo(1, -5);
    context.stroke();
    context.restore();
  }

  function draw() {
    if (dialog.dataset.state !== state) dialog.dataset.state = state;
    context.clearRect(0, 0, WORLD.width, WORLD.height);
    context.fillStyle = '#eef0de';
    context.fillRect(0, 0, WORLD.width, WORLD.height);
    context.fillStyle = '#e1e7ce';
    context.beginPath();
    context.arc(435, 58, 27, 0, Math.PI * 2);
    context.fill();
    pixelTree(context, 31, 214, 2.1, '#91a475');
    pixelTree(context, 448, 229, 1.65, '#a4b487');
    context.fillStyle = '#cfddba';
    context.fillRect(0, WORLD.ground, WORLD.width, WORLD.height - WORLD.ground);
    context.fillStyle = '#b6c89d';
    [[7, 283, 39], [104, 291, 22], [361, 279, 34], [423, 291, 20]].forEach(([x, y, width]) => context.fillRect(x, y, width, 2));
    leaves.forEach(drawLeaf);
    context.fillStyle = '#ac8757';
    context.fillRect(basketX - 32, 249, 64, 21);
    context.fillStyle = '#7e633f';
    context.fillRect(basketX - 36, 244, 72, 6);
    [basketX - 21, basketX - 7, basketX + 7, basketX + 21].forEach(x => context.fillRect(x, 250, 2, 20));
    context.fillStyle = '#c8a878';
    context.fillRect(basketX - 31, 255, 62, 2);
    context.fillRect(basketX - 31, 263, 62, 2);
    if (state !== 'playing') {
      context.fillStyle = '#20392b';
      context.textAlign = 'center';
      context.font = '500 23px "Space Grotesk", sans-serif';
      const headline = state === 'paused' ? 'A moment to pause.' : state === 'ended' ? `${score} leaves, safely gathered.` : state === 'starting' ? 'Getting the garden ready…' : 'A little room to play.';
      context.fillText(headline, WORLD.width / 2, 118);
      context.font = '13px "Space Grotesk", sans-serif';
      context.fillStyle = '#617258';
      context.fillText(state === 'paused' ? 'Resume whenever you’re ready.' : state === 'ended' ? 'There’s always another season.' : state === 'starting' ? 'Your round will begin in a moment.' : 'Catch what the canopy sends your way.', WORLD.width / 2, 144);
    }
  }

  function createLeaf() {
    const colors = ['#638246', '#94a34e', '#bc944b', '#aa6941'];
    const x = 26 + Math.random() * (WORLD.width - 52);
    leaves.push({ x, origin: x, y: -15, speed: reducedMotion.matches ? 42 + Math.random() * 17 : 65 + Math.random() * 34, rotation: Math.random() - 0.5, age: 0, color: colors[Math.floor(Math.random() * colors.length)] });
  }

  function endRound() {
    if (state !== 'playing') return;
    state = 'ended';
    cancelAnimationFrame(animation);
    pauseButton.disabled = true;
    startButton.disabled = false;
    startButton.textContent = 'Play again';
    timeLabel.textContent = '0';
    message.textContent = `Round finished. You caught ${score} ${score === 1 ? 'leaf' : 'leaves'}. Play again whenever you like.`;
    keys.left = false;
    keys.right = false;
    nameInput.disabled = false;
    player.hidden = false;
    playerSummary.hidden = true;
    const round = currentRound;
    if (round) {
      round.score = score;
      round.saveState = round.session ? 'saving' : 'unranked';
      round.entries = null;
      latestFinishedRound = round;
      showResult(round);
      void saveResult(round);
      requestAnimationFrame(() => {
        if (dialog.open && visibleResult === round) board.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      });
    }
    draw();
  }

  function tick(now) {
    if (state !== 'playing') return;
    const delta = Math.min((now - lastFrame) / 1000 || 0, 0.05);
    lastFrame = now;
    remaining = Math.max(0, remaining - delta);
    const seconds = Math.ceil(remaining);
    if (seconds !== lastShownSecond) {
      timeLabel.textContent = String(seconds);
      lastShownSecond = seconds;
    }
    if (!remaining) { endRound(); return; }
    const movement = Number(keys.right) - Number(keys.left);
    basketX = Math.max(38, Math.min(WORLD.width - 38, basketX + movement * 300 * delta));
    spawnClock += delta;
    if (spawnClock >= 0.62) { createLeaf(); spawnClock = 0; }
    const survivors = [];
    for (const leaf of leaves) {
      leaf.age += delta;
      leaf.y += leaf.speed * delta;
      if (!reducedMotion.matches) leaf.x = leaf.origin + Math.sin(leaf.age * 2 + leaf.rotation) * 15;
      if (leaf.y >= 238 && leaf.y <= 266 && Math.abs(leaf.x - basketX) <= 36) {
        score += 1;
        scoreLabel.textContent = String(score);
      } else if (leaf.y <= WORLD.ground + 8) survivors.push(leaf);
    }
    leaves = survivors;
    draw();
    animation = requestAnimationFrame(tick);
  }

  async function startRound() {
    if (state === 'starting' || state === 'playing' || state === 'paused') return;
    cancelAnimationFrame(animation);
    const version = ++runVersion;
    const name = normalizeName(nameInput.value);
    try { localStorage.setItem('ochi-leaf-keeper-name', nameInput.value.trim() ? name : ''); } catch (_) { /* Names can remain in memory only. */ }
    const round = { name, session: null, score: 0, entries: null, entry: null, rank: null, saveState: 'unranked', inFlight: false, loadingBoard: false, boardFailed: false };
    currentRound = round;
    visibleResult = null;
    board.hidden = true;
    nameInput.disabled = true;
    player.hidden = true;
    playerSummary.textContent = `Playing as ${name}`;
    playerSummary.hidden = false;
    state = 'starting';
    pauseAfterStart = false;
    startButton.disabled = true;
    startButton.textContent = 'Connecting…';
    pauseButton.disabled = true;
    message.textContent = 'Getting your leaderboard round ready.';
    draw();
    try { round.session = await startRoundSession(); }
    catch (_) { /* The game remains playable when the shared board is unavailable. */ }
    if (version !== runVersion || !dialog.open) return;
    state = 'playing';
    score = 0;
    remaining = 25;
    lastShownSecond = 25;
    spawnClock = 0.5;
    basketX = WORLD.width / 2;
    leaves = [];
    keys.left = false;
    keys.right = false;
    scoreLabel.textContent = '0';
    timeLabel.textContent = '25';
    startButton.disabled = true;
    startButton.textContent = 'Playing';
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pause';
    message.textContent = round.session ? 'The canopy is sharing. Catch a few leaves.' : 'Playing without a leaderboard connection. This round won’t be posted.';
    lastFrame = performance.now();
    if (pauseAfterStart || document.hidden) setPaused(true, 'Paused while you were away. Resume when you’re ready.');
    else { draw();animation = requestAnimationFrame(tick); }
  }

  function setPaused(paused, reason) {
    if (paused && state === 'starting') { pauseAfterStart = true;return; }
    if (paused && state === 'playing') {
      state = 'paused';
      cancelAnimationFrame(animation);
      keys.left = false;
      keys.right = false;
      pauseButton.textContent = 'Resume';
      message.textContent = reason || 'Paused. Your leaves can wait.';
      draw();
    } else if (!paused && state === 'paused') {
      state = 'playing';
      pauseButton.textContent = 'Pause';
      message.textContent = 'Back to the garden.';
      lastFrame = performance.now();
      animation = requestAnimationFrame(tick);
    }
  }

  function updatePointer(event) {
    if (state !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    basketX = Math.max(38, Math.min(WORLD.width - 38, (event.clientX - rect.left) / rect.width * WORLD.width));
  }

  function openGame() {
    if (dialog.open) return;
    dialog.showModal();
    runVersion += 1;
    currentRound = null;
    visibleResult = null;
    board.hidden = true;
    state = 'ready';
    pauseAfterStart = false;
    score = 0;
    remaining = 25;
    leaves = [];
    basketX = WORLD.width / 2;
    scoreLabel.textContent = '0';
    timeLabel.textContent = '25';
    startButton.disabled = false;
    startButton.textContent = 'Start round';
    pauseButton.disabled = true;
    pauseButton.textContent = 'Pause';
    nameInput.disabled = false;
    player.hidden = false;
    playerSummary.hidden = true;
    message.textContent = '25 seconds. A basket. A few falling leaves.';
    if (latestFinishedRound) {
      showResult(latestFinishedRound, true);
      if (latestFinishedRound.saveState === 'saved') void fetchLeaderboard(latestFinishedRound);
    }
    resizeCanvas();
    nameInput.focus({ preventScroll: true });
  }
  playButton.addEventListener('click', () => window.OCHI_ARCADE.launch('leaf-keeper', playButton));
  mount.querySelector('.gk-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    cancelAnimationFrame(animation);
    runVersion += 1;
    currentRound = null;
    visibleResult = null;
    state = 'ready';
    pauseAfterStart = false;
    keys.left = false;
    keys.right = false;
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  startButton.addEventListener('click', startRound);
  boardRetry.addEventListener('click', () => {
    if (!visibleResult) return;
    if (visibleResult.saveState === 'failed') void saveResult(visibleResult);
    else void fetchLeaderboard(visibleResult);
  });
  pauseButton.addEventListener('click', () => setPaused(state === 'playing'));
  canvas.addEventListener('pointerdown', event => { canvas.setPointerCapture(event.pointerId); updatePointer(event); });
  canvas.addEventListener('pointermove', updatePointer);
  mount.querySelectorAll('.gk-move').forEach(button => {
    const direction = button.dataset.direction;
    button.addEventListener('pointerdown', event => { if (state !== 'playing') return; event.preventDefault(); button.setPointerCapture(event.pointerId); keys[direction] = true; });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => button.addEventListener(type, () => { keys[direction] = false; }));
    button.addEventListener('click', event => {
      if (event.detail !== 0 || state !== 'playing') return;
      basketX = Math.max(38, Math.min(WORLD.width - 38, basketX + (direction === 'left' ? -45 : 45)));
    });
  });
  window.addEventListener('keydown', event => {
    if (!dialog.open || event.defaultPrevented || event.target?.closest?.('[role=tablist]')) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    const key = event.key.toLowerCase();
    if (['arrowleft', 'a', 'arrowright', 'd'].includes(key)) {
      event.preventDefault();
      if (state === 'playing') keys[key === 'arrowleft' || key === 'a' ? 'left' : 'right'] = true;
    }
    if (key === 'p' && !event.repeat) setPaused(state === 'playing');
  });
  window.addEventListener('keyup', event => {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a') keys.left = false;
    if (key === 'arrowright' || key === 'd') keys.right = false;
  });
  window.addEventListener('blur', () => setPaused(true, 'Paused while you were away. Resume when you’re ready.'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) setPaused(true, 'Paused while you were away. Resume when you’re ready.'); });
  if (window.ResizeObserver) new ResizeObserver(() => { if (dialog.open) resizeCanvas(); }).observe(canvas);
  else window.addEventListener('resize', () => { if (dialog.open) resizeCanvas(); });
  drawCover();
  window.OCHI_ARCADE.register('leaf-keeper', { title: 'Leaf keeper', dialog, open: openGame, close: () => dialog.close() });
})();
