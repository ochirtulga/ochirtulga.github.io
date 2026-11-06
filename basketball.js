(() => {
  'use strict';
  const mount = document.getElementById('basketball-mount');
  const physics = window.OCHI_HOOPS_PHYSICS;
  if (!mount || !physics || !window.OCHI_ARCADE) return;
  mount.innerHTML = `
    <div class="gk-cartridge bb-cartridge" aria-label="Basketball, a little court for a little break">
      <div class="gk-cart-grip" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="gk-cart-label"><div class="gk-label-heading"><span>Ochi's after-hours collection</span><span aria-hidden="true">◉</span></div><h3>Basketball</h3><canvas class="bb-cover-art" width="280" height="104" aria-hidden="true"></canvas><p>Ten shots. One distant hoop.</p></div>
      <div class="gk-cart-bottom"><span class="gk-cart-mark">Meet you on the court</span><button class="gk-play bb-play" type="button">Take a shot <span aria-hidden="true">▶</span></button></div><span class="gk-screw gk-screw-left" aria-hidden="true"></span><span class="gk-screw gk-screw-right" aria-hidden="true"></span>
    </div>
    <dialog class="bb-dialog" aria-labelledby="bb-title" aria-describedby="bb-instructions">
      <div class="bb-dialog-heading"><div><p class="bb-kicker">A little intermission</p><h2 id="bb-title">Basketball</h2></div><button class="bb-close" type="button" aria-label="Close basketball">×</button></div>
      <div class="bb-scoreboard"><span>Baskets <strong id="bb-score">0</strong><small> / 10</small></span><span>Shot <strong id="bb-attempts">1</strong><small> / 10</small></span><span title="Personal best saved on this device">Best here <strong id="bb-best">0</strong><small> / 10</small></span></div>
      <p class="bb-instructions" id="bb-instructions">Drag up from the ball to aim; release to shoot.</p>
      <div class="bb-court-wrap">
        <canvas class="bb-canvas" width="600" height="440" tabindex="0" role="application" aria-label="Basketball court" aria-describedby="bb-instructions bb-wind bb-aim-assist bb-power-assist bb-keyboard" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Space Enter"></canvas>
        <div class="bb-wind" id="bb-wind" role="status" aria-live="polite"><span class="bb-wind-arrow" aria-hidden="true"></span><span><strong class="bb-wind-label"></strong><span class="bb-wind-hint"></span></span></div>
        <div class="bb-aim-assist" id="bb-aim-assist"><span>Aim</span><output id="bb-aim" aria-label="Shot aim">Center</output><small>Drag sideways</small></div>
        <div class="bb-power-assist" id="bb-power-assist"><div class="bb-power-track" role="meter" aria-label="Shot power" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40"><i></i></div><div><span>Power</span><output id="bb-power" aria-label="Shot power percentage">40%</output></div></div>
      </div>
      <div class="bb-controls"><button class="bb-pause" type="button">Pause</button><button class="bb-reset" type="button">New round</button><button class="bb-shoot" type="button">Shoot <span aria-hidden="true">↗</span></button></div>
      <p class="bb-message" role="status" aria-live="polite">Start on the ball at the bottom. Aim for the distant hoop.</p>
      <p class="bb-keyboard" id="bb-keyboard">Longer drag = more power. Keyboard: ← → aim, ↑ ↓ power, Space shoot. Wind changes after every basket. Best is saved on this device.</p>
    </dialog>`;

  const dialog = mount.querySelector('.bb-dialog');
  const canvas = mount.querySelector('.bb-canvas');
  const context = canvas.getContext('2d');
  const message = mount.querySelector('.bb-message');
  const scoreLabel = mount.querySelector('#bb-score');
  const attemptsLabel = mount.querySelector('#bb-attempts');
  const bestLabel = mount.querySelector('#bb-best');
  const powerLabel = mount.querySelector('#bb-power');
  const aimLabel = mount.querySelector('#bb-aim');
  const powerTrack = mount.querySelector('.bb-power-track i');
  const powerMeter = mount.querySelector('.bb-power-track');
  const court = mount.querySelector('.bb-court-wrap');
  const shootButton = mount.querySelector('.bb-shoot');
  const pauseButton = mount.querySelector('.bb-pause');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const W = 600, H = 440;
  const clamp = (v, low, high) => Math.min(high, Math.max(low, v));
  const project = point => {
    const scale = 8 / (8 + Math.max(-1, point.z));
    return { x: W / 2 + point.x * 70 * scale, y: H - point.z / (8 + point.z) * 370 - point.y * 70 * scale, scale };
  };
  const origin = project(physics.constants.origin);
  const rim = project(physics.constants.hoop);
  let state = 'ready';
  let previousState = 'ready';
  let score = 0;
  let attempts = 0;
  let best = 0;
  let wind = null;
  let aim = 0;
  let power = 0.4;
  let aiming = null;
  let flight = null;
  let frame = 0;
  let lastFrame = 0;
  let view = { scale: 1, x: 0, y: 0, width: W, height: H, dpr: 1 };
  try { const value = Number(localStorage.getItem('ochi-basketball-best'));if (Number.isInteger(value) && value >= 0 && value <= 10) best = value; } catch (_) { /* A round never depends on storage. */ }

  function paintBall(ctx, x, y, radius, rotation = 0, alpha = 1) {
    ctx.save();ctx.translate(x, y);ctx.rotate(rotation);ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ce773e';ctx.strokeStyle = '#643e2c';ctx.lineWidth = Math.max(1.1, radius * 0.055);
    ctx.beginPath();ctx.arc(0, 0, radius, 0, Math.PI * 2);ctx.fill();ctx.stroke();
    ctx.save();ctx.beginPath();ctx.arc(0, 0, radius - 0.5, 0, Math.PI * 2);ctx.clip();
    ctx.fillStyle = '#ec9c55';ctx.beginPath();ctx.ellipse(-radius * .26, -radius * .25, radius * .54, radius * .77, -.6, 0, Math.PI * 2);ctx.fill();
    ctx.strokeStyle = '#6f432e';ctx.beginPath();ctx.moveTo(-radius, 0);ctx.lineTo(radius, 0);ctx.moveTo(0, -radius);ctx.lineTo(0, radius);ctx.moveTo(-radius * .7, -radius);ctx.bezierCurveTo(radius * .62, -radius * .4, radius * .62, radius * .4, -radius * .7, radius);ctx.moveTo(radius * .7, -radius);ctx.bezierCurveTo(-radius * .62, -radius * .4, -radius * .62, radius * .4, radius * .7, radius);ctx.stroke();ctx.restore();ctx.restore();
  }
  function drawCover() {
    const ctx = mount.querySelector('.bb-cover-art').getContext('2d');
    ctx.fillStyle = '#e8ead9';ctx.fillRect(0, 0, 280, 104);
    ctx.fillStyle = '#bccba8';ctx.beginPath();ctx.moveTo(0, 49);ctx.quadraticCurveTo(72, 28, 130, 48);ctx.quadraticCurveTo(215, 27, 280, 50);ctx.lineTo(280, 104);ctx.lineTo(0, 104);ctx.fill();
    ctx.fillStyle = '#c7a07a';ctx.beginPath();ctx.moveTo(89, 48);ctx.lineTo(191, 48);ctx.lineTo(272, 104);ctx.lineTo(8, 104);ctx.closePath();ctx.fill();
    ctx.strokeStyle = '#f9f3dd';ctx.lineWidth = 1.1;ctx.beginPath();ctx.moveTo(95, 55);ctx.lineTo(49, 104);ctx.moveTo(185, 55);ctx.lineTo(231, 104);ctx.stroke();
    ctx.strokeStyle = '#6b775c';ctx.lineWidth = 4;ctx.beginPath();ctx.moveTo(140, 49);ctx.lineTo(140, 13);ctx.stroke();
    ctx.fillStyle = '#fffbed';ctx.strokeStyle = '#77836c';ctx.lineWidth = 1.5;ctx.fillRect(119, 6, 42, 25);ctx.strokeRect(119, 6, 42, 25);ctx.strokeRect(133, 16, 14, 11);
    ctx.strokeStyle = '#ad5c33';ctx.lineWidth = 2.5;ctx.beginPath();ctx.ellipse(140, 33, 13, 3, 0, 0, Math.PI * 2);ctx.stroke();
    ctx.strokeStyle = '#fff9e9';ctx.lineWidth = 1;ctx.beginPath();ctx.moveTo(128, 35);ctx.lineTo(133, 45);ctx.lineTo(147, 45);ctx.lineTo(152, 35);ctx.moveTo(134, 36);ctx.lineTo(137, 44);ctx.moveTo(146, 36);ctx.lineTo(143, 44);ctx.stroke();
    ctx.setLineDash([2, 5]);ctx.strokeStyle = '#6e7c5f';ctx.beginPath();ctx.moveTo(201, 87);ctx.quadraticCurveTo(181, 8, 141, 32);ctx.stroke();ctx.setLineDash([]);
    paintBall(ctx, 201, 85, 13, -.25);
  }
  function courtPoint(x, z) { return project({ x, z, y: 0 }); }
  function path(points, color = '#f4e9ce', width = 1.4) {
    context.strokeStyle = color;context.lineWidth = width;context.beginPath();
    points.forEach((point, i) => { const p = courtPoint(...point);i ? context.lineTo(p.x, p.y) : context.moveTo(p.x, p.y); });context.stroke();
  }
  function scenery() {
    context.fillStyle = '#e8eadb';context.fillRect(0, 0, W, H);
    context.fillStyle = '#f9edc6';context.beginPath();context.arc(496, 62, 27, 0, Math.PI * 2);context.fill();
    context.fillStyle = '#b6c8a4';context.beginPath();context.moveTo(0, 124);context.quadraticCurveTo(111, 61, 233, 122);context.quadraticCurveTo(378, 68, 600, 117);context.lineTo(600, H);context.lineTo(0, H);context.fill();
    context.fillStyle = '#a1b890';context.beginPath();context.moveTo(0, 150);context.quadraticCurveTo(125, 115, 250, 151);context.quadraticCurveTo(411, 95, 600, 150);context.lineTo(600, H);context.lineTo(0, H);context.fill();
    // The court narrows toward the basket. Every line shares the same projection.
    const corners = [courtPoint(-5.4, 0), courtPoint(-5.4, 15), courtPoint(5.4, 15), courtPoint(5.4, 0)];
    context.fillStyle = '#caa17a';context.beginPath();corners.forEach((p, i) => i ? context.lineTo(p.x, p.y) : context.moveTo(p.x, p.y));context.closePath();context.fill();
    context.fillStyle = '#b98a63';const paint = [[-2.15, 7.2],[-2.15,12],[2.15,12],[2.15,7.2]].map(p=>courtPoint(...p));context.beginPath();paint.forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.closePath();context.fill();
    path([[-5.4,0],[-5.4,15],[5.4,15],[5.4,0]]);path([[-2.15,12],[-2.15,7.2],[2.15,7.2],[2.15,12]]);path([[-5.4,12],[5.4,12]]);
    const arc = [];for (let a = 0; a <= Math.PI; a += Math.PI / 48) arc.push([-Math.cos(a) * 2.15, 7.2 - Math.sin(a) * 2.15]);path(arc);
    const three = [];for (let a = 0; a <= Math.PI; a += Math.PI / 64) three.push([-Math.cos(a) * 4.2, 10.5 - Math.sin(a) * 6]);path(three, '#f7e7c5', 1.7);
    context.strokeStyle = '#8b9c77';context.lineWidth = 1;context.beginPath();context.moveTo(34, 170);context.lineTo(34, 232);context.moveTo(564, 164);context.lineTo(564, 225);context.stroke();
    context.fillStyle = '#719161';context.beginPath();context.ellipse(34, 169, 22, 30, -.17, 0, Math.PI * 2);context.ellipse(564, 164, 24, 34, .2, 0, Math.PI * 2);context.fill();
  }
  function backboard() {
    const ground = project({ x: 0, y: 0, z: 11.05 });
    context.strokeStyle = '#65765c';context.lineWidth = 7;context.beginPath();context.moveTo(ground.x + 13, ground.y);context.lineTo(rim.x + 13, rim.y - 60);context.lineTo(rim.x, rim.y - 60);context.stroke();
    context.fillStyle = '#fff9e9';context.strokeStyle = '#68765d';context.lineWidth = 2;
    context.fillRect(rim.x - 46, rim.y - 64, 92, 58);context.strokeRect(rim.x - 46, rim.y - 64, 92, 58);
    context.strokeStyle = '#a8704a';context.lineWidth = 1.5;context.strokeRect(rim.x - 17, rim.y - 31, 34, 25);
    context.fillStyle = '#59744e';context.font = '10px "Space Grotesk",sans-serif';context.textAlign = 'center';context.fillText('AFTER HOURS', rim.x, rim.y - 47);
    context.strokeStyle = '#83553a';context.lineWidth = 4;context.beginPath();context.ellipse(rim.x, rim.y, 27, 7.5, 0, Math.PI, Math.PI * 2);context.stroke();
  }
  function net(front = false) {
    const pulse = flight?.made && flight.scored && !motion.matches ? Math.max(0, 1 - (flight.t - flight.result.crossing.t) * 2.8) : 0;
    const sway = pulse * Math.sin((flight?.t || 0) * 22) * 4;
    context.strokeStyle = '#fff9e8';context.lineWidth = 1.3;
    if (!front) {
      context.beginPath();context.moveTo(rim.x - 25, rim.y + 2);context.lineTo(rim.x - 16 + sway, rim.y + 31 + pulse * 5);context.lineTo(rim.x + 16 + sway, rim.y + 31 + pulse * 5);context.lineTo(rim.x + 25, rim.y + 2);context.stroke();
      for (let x = -18; x <= 18; x += 9) { context.beginPath();context.moveTo(rim.x + x, rim.y + 5);context.lineTo(rim.x + x * .65 + sway, rim.y + 31 + pulse * 5);context.stroke(); }
      context.beginPath();context.ellipse(rim.x + sway * .4, rim.y + 16, 21, 4, 0, 0, Math.PI);context.stroke();
    } else {
      context.strokeStyle = pulse ? '#b65f30' : '#a75a34';context.lineWidth = 4;context.beginPath();context.ellipse(rim.x, rim.y, 27, 7.5, 0, 0, Math.PI);context.stroke();
      context.strokeStyle = '#f6ead4';context.lineWidth = 1.1;context.beginPath();context.moveTo(rim.x - 23, rim.y + 5);context.lineTo(rim.x + 14 + sway, rim.y + 30);context.moveTo(rim.x + 23, rim.y + 5);context.lineTo(rim.x - 14 + sway, rim.y + 30);context.stroke();
    }
  }
  function guide() {
    if (state !== 'aiming' && state !== 'ready') return;
    const shot = physics.makeShot(aim, power, wind);
    context.fillStyle = '#faf5dfa6';
    for (let t = .11; t <= .95; t += .105) { const p = project(physics.pointAt(shot, t));context.beginPath();context.arc(p.x, p.y, Math.max(1.5, 3.3 - t * 1.2), 0, Math.PI * 2);context.fill(); }
    if (state === 'aiming') {
      context.strokeStyle = '#fff8e6';context.lineWidth = 1.2;context.setLineDash([4, 5]);context.beginPath();context.moveTo(origin.x, origin.y);context.lineTo(aiming.current.x, aiming.current.y);context.stroke();context.setLineDash([]);
      paintBall(context, aiming.current.x, aiming.current.y, 12, 0, .25);
    }
  }
  function draw() {
    if (!context) return;
    context.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);context.fillStyle = '#e8eadb';context.fillRect(0, 0, view.width, view.height);
    context.setTransform(view.dpr * view.scale, 0, 0, view.dpr * view.scale, view.dpr * view.x, view.dpr * view.y);
    scenery();backboard();net();guide();
    let ball = physics.constants.origin;
    let spin = 0;
    if (flight) {
      if (flight.t <= flight.duration) ball = physics.pointAt(flight.shot, flight.t);
      else ball = { ...physics.pointAt(flight.shot, flight.duration), y: Math.sin(Math.min(1, (flight.t - flight.duration) / .42) * Math.PI) * .55 };
      if (flight.made && flight.scored) { const since = flight.t - flight.result.crossing.t;ball = { x: flight.result.crossing.x * .4, z: physics.constants.hoop.z + .08, y: Math.max(0, physics.constants.hoop.y - since * 5) }; }
      spin = flight.t * 5;
    }
    const shadow = project({ ...ball, y: 0 });
    context.fillStyle = '#6c563322';context.beginPath();context.ellipse(shadow.x, shadow.y + 1, 24 * shadow.scale, 6 * shadow.scale, 0, 0, Math.PI * 2);context.fill();
    const p = project(ball);
    paintBall(context, p.x, p.y, 24 * p.scale, spin);
    // Once the ball reaches the basket, the front rim gives its pass real depth.
    if (ball.z > 9.7 && ball.y < 3.7) net(true);
    else { context.strokeStyle = '#a75a34';context.lineWidth = 4;context.beginPath();context.ellipse(rim.x, rim.y, 27, 7.5, 0, 0, Math.PI);context.stroke(); }
    if (state === 'paused' || state === 'ended') {
      context.fillStyle = '#eef0e1df';context.fillRect(75, 202, 450, 102);
      context.textAlign = 'center';context.fillStyle = '#2e4d35';context.font = '500 28px "Space Grotesk",sans-serif';context.fillText(state === 'paused' ? 'Time out.' : `${score} of 10. Nice shooting.`, 300, 243);
      context.font = '14px "Space Grotesk",sans-serif';context.fillStyle = '#607054';context.fillText(state === 'paused' ? 'Resume when you’re ready.' : 'There’s always another round.', 300, 272);
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);canvas.height = Math.round(rect.height * dpr);
    const scale = Math.min(rect.width / W, rect.height / H);
    view = { width: rect.width, height: rect.height, scale, x: (rect.width - W * scale) / 2, y: (rect.height - H * scale) / 2, dpr };
    // The controls follow the projected launch position, including letterboxing.
    court.style.setProperty('--bb-ball-x', `${view.x + origin.x * scale}px`);
    court.style.setProperty('--bb-ball-y', `${view.y + origin.y * scale}px`);
    court.style.setProperty('--bb-ball-radius', `${24 * scale}px`);
    court.style.setProperty('--bb-meter-height', `${clamp(rect.height * .19, 42, 76)}px`);
    draw();
  }
  function updateReadout() {
    powerLabel.value = `${Math.round(power * 100)}%`;aimLabel.value = Math.abs(aim) < .5 ? 'Center' : `${Math.round(Math.abs(aim))}° ${aim < 0 ? 'left' : 'right'}`;
    powerTrack.style.height = `${Math.round(power * 100)}%`;
    powerMeter.setAttribute('aria-valuenow', String(Math.round(power * 100)));
    dialog.dataset.state = state;dialog.dataset.score = String(score);dialog.dataset.attempts = String(attempts);dialog.dataset.power = power.toFixed(3);dialog.dataset.aim = aim.toFixed(2);
    scoreLabel.textContent = String(score);attemptsLabel.textContent = String(Math.min(10, attempts + (state === 'ready' || state === 'aiming' ? 1 : 0)));bestLabel.textContent = String(best);
    shootButton.disabled = !['ready', 'aiming'].includes(state);pauseButton.disabled = state === 'ended';pauseButton.textContent = state === 'paused' ? 'Resume' : 'Pause';
  }
  function setMessage(value) { message.textContent = value; }
  function cancelFrame() { cancelAnimationFrame(frame);frame = 0; }
  function cancelAim() { if (state !== 'aiming') return;aiming = null;state = 'ready';updateReadout();draw(); }
  function updateWind() {
    mount.querySelector('.bb-wind-arrow').textContent = wind.arrow;
    mount.querySelector('.bb-wind-label').textContent = wind.label;
    mount.querySelector('.bb-wind-hint').textContent = wind.hint;
    mount.querySelector('.bb-wind').setAttribute('aria-label', `${wind.label}. ${wind.hint} Wind changes after each basket.`);
    dialog.dataset.windX = String(wind.x);dialog.dataset.windZ = String(wind.z);
    dialog.dataset.windDirection = wind.direction;dialog.dataset.windStrength = String(wind.strength);
  }
  function newRound() {
    window.OCHI_ARCADE_AUDIO?.stop();
    cancelFrame();flight = null;aiming = null;attempts = 0;score = 0;aim = 0;power = .4;state = 'ready';previousState = 'ready';
    wind = physics.createWind(wind);updateWind();
    updateReadout();setMessage('Ten shots. Each basket brings a new wind.');draw();
  }
  function resultMessage(result) {
    return result.reason === 'left' ? 'Just left. Aim a little right.' : result.reason === 'right' ? 'Just right. Aim a little left.' : result.reason === 'long' ? 'A little strong. Try less power.' : 'A little short. Give it more power.';
  }
  function finishShot() {
    cancelFrame();
    const made = flight.made;
    flight = null;
    if (attempts >= 10) {
      state = 'ended';const isBest = score > best;best = Math.max(best, score);
      try { localStorage.setItem('ochi-basketball-best', String(best)); } catch (_) { /* Saving a personal best is optional. */ }
      setMessage(`${score} baskets from 10 shots.${isBest ? ' A new best on this device!' : ' Want another round?'}`);
      window.OCHI_ARCADE_AUDIO?.play(isBest ? 'best' : 'end');
    } else { state = 'ready';setMessage(made ? `Swish! New wind: ${wind.label.toLowerCase()}. ${10 - attempts} shots left.` : `${message.textContent} ${10 - attempts} shots left.`); }
    updateReadout();draw();
  }
  function tick(now) {
    if (state !== 'flight' || !flight || !dialog.open) return;
    const delta = Math.min((now - lastFrame) / 1000 || 0, .05);lastFrame = now;flight.t += delta;
    if (!flight.scored && flight.made && flight.t >= flight.result.crossing.t) {
      flight.scored = true;score += 1;
      // This flight keeps its captured wind; the new condition is for the next shot.
      wind = physics.createWind(wind);updateWind();updateReadout();
      setMessage('Swish! The wind has changed for your next shot.');window.OCHI_ARCADE_AUDIO?.play('swish');
    }
    if (!flight.made && !flight.feedback && flight.t >= (flight.result.crossing?.t || flight.duration * .8)) { flight.feedback = true;setMessage(resultMessage(flight.result));window.OCHI_ARCADE_AUDIO?.play('miss'); }
    if (flight.t >= flight.duration + .45) { finishShot();return; }
    draw();frame = requestAnimationFrame(tick);
  }
  function shoot() {
    if (!dialog.open || !['ready', 'aiming'].includes(state) || attempts >= 10) return;
    void window.OCHI_ARCADE_AUDIO?.unlock();
    window.OCHI_ARCADE_AUDIO?.play('shoot');
    cancelFrame();aiming = null;
    const shot = physics.makeShot(aim, power, wind);const result = physics.classify(shot);
    flight = { shot, result, made: result.made, duration: physics.flightDuration(shot), t: 0, scored: false, feedback: false };
    attempts += 1;state = 'flight';updateReadout();setMessage(`Shot ${attempts} of 10. Follow the arc.`);
    lastFrame = performance.now();draw();frame = requestAnimationFrame(tick);
  }
  function pause(paused, reason) {
    if (paused && !['paused', 'ended'].includes(state)) {
      window.OCHI_ARCADE_AUDIO?.stop();
      previousState = state === 'aiming' ? 'ready' : state;aiming = null;state = 'paused';cancelFrame();setMessage(reason || 'Time out. Your next shot can wait.');
    } else if (!paused && state === 'paused') {
      state = previousState;setMessage(state === 'flight' ? 'Back to the shot.' : 'Ready when you are.');
      if (state === 'flight') { lastFrame = performance.now();frame = requestAnimationFrame(tick); }
    } else return;
    updateReadout();draw();
  }
  function pointerPoint(event) {
    const r = canvas.getBoundingClientRect();return { x: (event.clientX - r.left - view.x) / view.scale, y: (event.clientY - r.top - view.y) / view.scale };
  }
  canvas.addEventListener('pointerdown', event => {
    if (state !== 'ready' || !dialog.open || event.button > 0) return;
    const point = pointerPoint(event);
    const hitRadius = Math.max(58, 30 / view.scale);
    if (Math.hypot(point.x - origin.x, point.y - origin.y) > hitRadius) { setMessage('Start on the ball at the bottom, drag up, and release.');return; }
    event.preventDefault();canvas.focus({ preventScroll: true });
    aiming = { pointerId: event.pointerId, start: point, current: point };state = 'aiming';
    try { canvas.setPointerCapture(event.pointerId); } catch (_) { /* Pointer capture is a convenience. */ }
    setMessage('Release to take your shot.');updateReadout();draw();
  });
  canvas.addEventListener('pointermove', event => {
    if (state !== 'aiming' || event.pointerId !== aiming?.pointerId) return;
    aiming.current = pointerPoint(event);
    aim = clamp((aiming.current.x - aiming.start.x) * .14, -24, 24);
    power = clamp((aiming.start.y - aiming.current.y) / 500, 0, 1);
    updateReadout();draw();
  });
  canvas.addEventListener('pointerup', event => {
    if (state !== 'aiming' || event.pointerId !== aiming?.pointerId) return;
    const point = pointerPoint(event);aiming.current = point;
    aim = clamp((point.x - aiming.start.x) * .14, -24, 24);power = clamp((aiming.start.y - point.y) / 500, 0, 1);
    const enough = aiming.start.y - point.y >= 35;
    if (enough) shoot();else { cancelAim();setMessage('Drag upward a little farther, then release.'); }
    try { canvas.releasePointerCapture(event.pointerId); } catch (_) { /* A cancelled pointer may already be released. */ }
  });
  ['pointercancel', 'lostpointercapture'].forEach(type => canvas.addEventListener(type, cancelAim));
  canvas.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || !dialog.open) return;
    const key = event.key.toLowerCase();
    if (key === 'p' && !event.repeat) { event.preventDefault();pause(state !== 'paused');return; }
    if (!['ready', 'aiming'].includes(state)) return;
    if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'enter'].includes(key)) event.preventDefault();else return;
    if (key === ' ' || key === 'enter') { if (!event.repeat) shoot();return; }
    if (key === 'arrowleft') aim = clamp(aim - 1, -24, 24);
    if (key === 'arrowright') aim = clamp(aim + 1, -24, 24);
    if (key === 'arrowup') power = clamp(power + .025, 0, 1);
    if (key === 'arrowdown') power = clamp(power - .025, 0, 1);
    updateReadout();draw();
  });
  function cleanup() { window.OCHI_ARCADE_AUDIO?.stop();cancelFrame();aiming = null;flight = null;state = 'ready';updateReadout(); }
  function open() { if (dialog.open) return;newRound();dialog.showModal();resize();canvas.focus({ preventScroll: true }); }
  function close() { if (dialog.open) dialog.close();cleanup(); }
  mount.querySelector('.bb-play').addEventListener('click', event => window.OCHI_ARCADE.launch('basketball', event.currentTarget));
  mount.querySelector('.bb-close').addEventListener('click', close);
  mount.querySelector('.bb-reset').addEventListener('click', () => { newRound();canvas.focus({ preventScroll: true }); });
  shootButton.addEventListener('click', shoot);pauseButton.addEventListener('click', () => { void window.OCHI_ARCADE_AUDIO?.unlock();pause(state !== 'paused'); });
  dialog.addEventListener('close', cleanup);
  dialog.addEventListener('click', event => { if (event.target !== dialog) return;const r = dialog.getBoundingClientRect();if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); });
  window.addEventListener('blur', () => { if (dialog.open) pause(true, 'Paused while you were away. Resume when you’re ready.'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && dialog.open) pause(true, 'Paused while you were away. Resume when you’re ready.'); });
  if (window.ResizeObserver) new ResizeObserver(() => { if (dialog.open) resize(); }).observe(canvas);
  else window.addEventListener('resize', () => { if (dialog.open) resize(); });
  if (motion.addEventListener) motion.addEventListener('change', () => { if (dialog.open) draw(); });
  drawCover();updateReadout();
  window.OCHI_ARCADE.register('basketball', { title: 'Basketball', dialog, open, close });
})();
