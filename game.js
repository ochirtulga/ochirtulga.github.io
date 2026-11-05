(() => {
  'use strict';

  const mount = document.getElementById('game-cartridge');
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
      <p id="gk-instructions" class="gk-instructions">Catch the leaves before they touch the ground. Move with ← → or A / D. You can also drag or use the buttons below.</p>
      <div class="gk-game-status"><span>Leaves <strong id="gk-score">0</strong></span><span>Time <strong id="gk-time">25</strong><span class="gk-seconds"> sec</span></span></div>
      <canvas class="gk-canvas" width="480" height="300" role="img" aria-label="A basket catching falling leaves in a garden"></canvas>
      <div class="gk-controls"><div class="gk-movement"><button class="gk-move" type="button" data-direction="left" aria-label="Move basket left">←</button><button class="gk-move" type="button" data-direction="right" aria-label="Move basket right">→</button></div><div class="gk-round-controls"><button class="gk-pause" type="button" disabled>Pause</button><button class="gk-start" type="button">Start round</button></div></div>
      <p class="gk-message" role="status" aria-live="polite">25 seconds. A basket. A few falling leaves.</p>
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
      const headline = state === 'paused' ? 'A moment to pause.' : state === 'ended' ? `${score} leaves, safely gathered.` : 'A little room to play.';
      context.fillText(headline, WORLD.width / 2, 118);
      context.font = '13px "Space Grotesk", sans-serif';
      context.fillStyle = '#617258';
      context.fillText(state === 'paused' ? 'Resume whenever you’re ready.' : state === 'ended' ? 'There’s always another season.' : 'Catch what the canopy sends your way.', WORLD.width / 2, 144);
    }
  }

  function createLeaf() {
    const colors = ['#638246', '#94a34e', '#bc944b', '#aa6941'];
    const x = 26 + Math.random() * (WORLD.width - 52);
    leaves.push({ x, origin: x, y: -15, speed: reducedMotion.matches ? 42 + Math.random() * 17 : 65 + Math.random() * 34, rotation: Math.random() - 0.5, age: 0, color: colors[Math.floor(Math.random() * colors.length)] });
  }

  function endRound() {
    state = 'ended';
    cancelAnimationFrame(animation);
    pauseButton.disabled = true;
    startButton.disabled = false;
    startButton.textContent = 'Play again';
    timeLabel.textContent = '0';
    message.textContent = `Round finished. You caught ${score} ${score === 1 ? 'leaf' : 'leaves'}. Play again whenever you like.`;
    keys.left = false;
    keys.right = false;
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

  function startRound() {
    cancelAnimationFrame(animation);
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
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pause';
    message.textContent = 'The canopy is sharing. Catch a few leaves.';
    lastFrame = performance.now();
    animation = requestAnimationFrame(tick);
  }

  function setPaused(paused, reason) {
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

  playButton.addEventListener('click', () => {
    if (dialog.open) return;
    dialog.showModal();
    state = 'ready';
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
    message.textContent = '25 seconds. A basket. A few falling leaves.';
    resizeCanvas();
    startButton.focus();
  });
  mount.querySelector('.gk-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    cancelAnimationFrame(animation);
    state = 'ready';
    keys.left = false;
    keys.right = false;
    playButton.focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  startButton.addEventListener('click', startRound);
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
    if (!dialog.open) return;
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
})();
