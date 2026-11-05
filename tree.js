(() => {
  'use strict';

  const mount = document.getElementById('season-tree');
  if (!mount) return;
  const NS = 'http://www.w3.org/2000/svg';
  const story = document.getElementById('leaf-story');
  const status = document.getElementById('season-status');
  const buttons = [...document.querySelectorAll('.season-button[data-season]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const svg = make('svg', { viewBox: '0 0 600 540', role: 'group', 'aria-labelledby': 'season-tree-title season-tree-description' });
  svg.append(make('title', { id: 'season-tree-title' }, 'A tree with a few stories in its leaves'));
  svg.append(make('desc', { id: 'season-tree-description' }, 'A leafy tree changes through spring, summer, autumn, and winter. Select a highlighted leaf with your pointer, or use Tab and Enter, to discover something about Ochi.'));

  function make(tag, attributes = {}, text) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  let seed = 73129;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  // Every mark is generated once. Changing the season only changes its palette.
  const ground = make('g', { 'aria-hidden': 'true' });
  ground.append(make('ellipse', { cx: 302, cy: 491, rx: 176, ry: 18, fill: '#7f9474', opacity: '.14' }));
  ground.append(make('path', { d: 'M105 490 Q186 477 252 486 Q353 499 476 487', fill: 'none', stroke: '#c6cfb9', 'stroke-width': '1.1' }));
  ground.append(make('path', { class: 'tree-snow', d: 'M141 487 Q180 475 222 481 Q263 476 299 485 Q368 475 459 487 Q402 507 300 505 Q199 503 141 487Z', fill: '#fffefa', stroke: '#dbe3d6', 'stroke-width': '.7' }));
  svg.append(ground);

  const back = make('g', { class: 'tree-canopy', 'aria-hidden': 'true' });
  const masses = [
    [166, 235, 65, 64, 'leaf-shade'], [139, 193, 61, 55, 'leaf-dark'],
    [194, 151, 69, 67, 'leaf-dark'], [240, 110, 68, 59, 'leaf-mid'],
    [307, 105, 78, 66, 'leaf-dark'], [363, 115, 69, 67, 'leaf-mid'],
    [420, 164, 68, 67, 'leaf-dark'], [454, 228, 63, 66, 'leaf-mid'],
    [398, 263, 82, 73, 'leaf-shade'], [326, 248, 85, 80, 'leaf-dark'],
    [247, 259, 81, 75, 'leaf-shade'], [211, 208, 91, 80, 'leaf-mid'],
    [345, 171, 93, 75, 'leaf-mid']
  ];
  masses.forEach(([x, y, rx, ry, color], index) => {
    const d = `M${x - rx} ${y + 7} C${x - rx - 10} ${y - ry * .45} ${x - rx * .66} ${y - ry} ${x - 13} ${y - ry} C${x + rx * .48} ${y - ry - 11} ${x + rx + 12} ${y - ry * .43} ${x + rx} ${y + 4} C${x + rx + 2} ${y + ry * .7} ${x + rx * .35} ${y + ry + 3} ${x - 6} ${y + ry} C${x - rx * .55} ${y + ry + 5} ${x - rx - 7} ${y + ry * .56} ${x - rx} ${y + 7}Z`;
    back.append(make('path', { d, class: color, opacity: index % 3 === 0 ? '.96' : '1' }));
  });
  svg.append(back);

  const limbs = make('g', { 'aria-hidden': 'true' });
  const branches = [
    ['M305 405 C284 334 245 298 192 252 C162 225 144 211 126 206', 17],
    ['M299 356 C282 302 258 254 232 204 C214 170 191 155 176 148', 14],
    ['M299 326 C297 264 286 216 267 168 C254 138 241 113 228 91', 12],
    ['M306 340 C322 278 331 221 329 171 C325 127 316 104 309 75', 13],
    ['M310 386 C343 335 369 298 415 269 C436 256 456 244 477 236', 18],
    ['M315 354 C349 299 376 253 397 211 C414 178 427 153 442 137', 14],
    ['M321 299 C347 257 361 213 369 174 C374 147 374 122 368 101', 11],
    ['M282 336 C254 309 228 297 192 293 C164 290 141 280 123 265', 10],
    ['M339 337 C373 325 405 319 434 321 C458 321 476 316 488 307', 9],
    ['M260 273 C229 255 205 231 194 206 C186 190 181 180 169 171', 7],
    ['M276 214 C253 203 237 187 222 161 C214 146 210 134 207 121', 6],
    ['M333 240 C349 229 373 214 392 208 C416 201 435 197 448 186', 6],
    ['M414 269 C417 248 419 235 431 222', 5],
    ['M244 303 C218 307 199 307 177 303', 6],
    ['M286 267 C299 238 306 220 306 201', 7]
  ];
  branches.forEach(([d, width]) => limbs.append(make('path', { d, class: 'tree-branch', stroke: '#796047', 'stroke-width': width })));
  limbs.append(make('path', {
    d: 'M265 489 C280 470 283 447 284 423 C286 389 280 351 282 319 C284 305 288 298 293 295 C295 331 309 350 315 379 C319 347 329 324 341 307 C338 333 327 363 326 390 C325 435 329 465 347 489 C331 486 323 481 314 480 C311 485 309 489 306 493 C300 485 296 483 291 485 C282 490 274 491 265 489Z',
    fill: '#7c634b'
  }));
  limbs.append(make('path', { d: 'M291 481 C303 443 297 413 300 387 C302 369 305 351 300 329', class: 'tree-branch', stroke: '#ab8c65', 'stroke-width': 5, opacity: '.57' }));
  limbs.append(make('path', { d: 'M314 475 C306 447 316 421 314 405 M287 473 C287 455 291 447 292 439 M321 363 C315 374 313 381 312 390', class: 'tree-branch', stroke: '#514b38', 'stroke-width': 1.5, opacity: '.55' }));
  limbs.append(make('path', { d: 'M274 487 Q246 493 235 489 M335 486 Q360 492 372 489', class: 'tree-branch', stroke: '#7c634b', 'stroke-width': 3 }));
  svg.append(limbs);

  const foliage = make('g', { class: 'tree-foliage', 'aria-hidden': 'true' });
  const colors = ['leaf-mid', 'leaf-light', 'leaf-dark', 'leaf-light', 'leaf-fresh', 'leaf-mid'];
  masses.forEach(([cx, cy, rx, ry], clusterIndex) => {
    for (let j = 0; j < 22; j += 1) {
      const theta = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * .93;
      const x = cx + Math.cos(theta) * rx * radius;
      const y = cy + Math.sin(theta) * ry * radius;
      const angle = random() * 120 - 60;
      const size = .66 + random() * .53;
      const leaf = make('path', {
        d: 'M0 15 C-13 8 -12 -7 0 -16 C13 -8 13 8 0 15Z',
        class: colors[(clusterIndex + j) % colors.length],
        transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${size.toFixed(2)})`,
        opacity: (.74 + random() * .26).toFixed(2)
      });
      foliage.append(leaf);
      if (j % 5 === 0) foliage.append(make('path', {
        d: 'M0 9 L0 -10', fill: 'none', stroke: '#d8e1b5', 'stroke-width': '.7', opacity: '.28',
        transform: leaf.getAttribute('transform')
      }));
    }
  });
  svg.append(foliage);

  const spring = make('g', { class: 'tree-spring', 'aria-hidden': 'true' });
  [[155, 194], [204, 128], [288, 70], [351, 105], [408, 163], [464, 230], [371, 245], [223, 269], [274, 194], [135, 256], [441, 292]].forEach(([x, y], index) => {
    const flower = make('g', { transform: `translate(${x} ${y}) rotate(${index * 19})` });
    for (let petal = 0; petal < 5; petal += 1) {
      const theta = petal * Math.PI * 2 / 5;
      flower.append(make('circle', { cx: Math.cos(theta) * 4, cy: Math.sin(theta) * 4, r: 3.7, fill: index % 2 ? '#f1ceca' : '#f9e2d7' }));
    }
    flower.append(make('circle', { r: 2.2, fill: '#dfbc7b' }));
    spring.append(flower);
  });
  svg.append(spring);

  const snow = make('g', { class: 'tree-snow', 'aria-hidden': 'true' });
  ['M137 212 C166 226 171 240 196 255', 'M336 335 C370 320 405 316 432 319', 'M291 290 C291 254 283 217 272 184', 'M382 239 C399 213 408 190 418 173'].forEach(d => snow.append(make('path', { d, class: 'tree-branch', stroke: '#fffefa', 'stroke-width': 5 })));
  [[178, 103, 2], [249, 75, 2.5], [424, 103, 2], [466, 178, 2.3], [146, 304, 2], [388, 365, 2.5], [224, 398, 2]].forEach(([cx, cy, r]) => snow.append(make('circle', { cx, cy, r, fill: '#d8e2d4' })));
  svg.append(snow);

  const fallen = make('g', { class: 'tree-autumn', 'aria-hidden': 'true' });
  [[169, 487, 48], [210, 497, -32], [386, 492, 71], [432, 482, 27], [353, 504, -65], [243, 482, 37], [146, 475, -17]].forEach(([x, y, angle], index) => fallen.append(make('path', {
    d: 'M0 9 C-9 3 -8 -5 0 -10 C9 -5 9 4 0 9Z', transform: `translate(${x} ${y}) rotate(${angle})`, fill: index % 2 ? '#c39147' : '#b7703f', opacity: '.85'
  })));
  svg.append(fallen);

  const stories = [
    { x: 145, y: 211, angle: -38, name: 'Mongolia', text: 'From Mongolia. The roots of my story, and the place I still call home.' },
    { x: 204, y: 138, angle: -22, name: 'Java', text: 'Java is one of my everyday tools, from banking services to life-sciences software.' },
    { x: 281, y: 79, angle: 17, name: 'Reading', text: 'A good reading habit became Bookworm: my own reading companion for iOS.' },
    { x: 371, y: 125, angle: 28, name: 'Kafka', text: 'Kafka helps the systems I build keep information moving, one event at a time.' },
    { x: 447, y: 203, angle: 38, name: 'Video games', text: 'Off duty, you might find me exploring a different world in a video game.' },
    { x: 441, y: 292, angle: 55, name: 'Austin', text: 'Based in Austin, Texas. A new place to build, explore, and find live music.' },
    { x: 348, y: 290, angle: 21, name: 'Cassandra', text: 'Data outlives code. Cassandra is one of the tools I use to build around that idea.' },
    { x: 238, y: 304, angle: -34, name: 'Basketball', text: 'Away from the keyboard: basketball, live music, and usually another book.' },
    { x: 172, y: 273, angle: -53, name: 'AWS', text: 'AWS is part of the infrastructure behind the systems and independent projects I build.' }
  ];
  const interactive = make('g', { class: 'tree-stories' });
  const storyActions = [];
  let activeStory = -1;
  stories.forEach((item, index) => {
    const group = make('g', {
      class: 'story-leaf', role: 'button', tabindex: '0',
      'aria-label': `${item.name}: discover a story`,
      'aria-pressed': 'false', transform: `translate(${item.x} ${item.y})`
    });
    group.append(make('title', {}, item.name));
    group.append(make('circle', { class: 'leaf-ring', r: 22 }));
    const shapes = make('g', { class: 'story-leaf-shape', transform: `rotate(${item.angle})` });
    shapes.append(make('path', { d: 'M0 15 C-15 8 -14 -10 0 -20 C15 -11 15 8 0 15Z', class: index % 2 ? 'leaf-fresh' : 'leaf-light' }));
    shapes.append(make('path', { d: 'M0 11 L0 -14 M0 2 L-6 -4 M0 -3 L6 -9', class: 'leaf-vein', fill: 'none', stroke: '#f0f3cf', 'stroke-width': '.9' }));
    group.append(shapes);
    const bud = make('g', { class: 'tree-snow', 'aria-hidden': 'true' });
    bud.append(make('path', { d: 'M-6 7 L0 0 L5 -9', class: 'tree-branch', stroke: '#88725b', 'stroke-width': '2' }));
    bud.append(make('ellipse', { cx: 1, cy: -4, rx: 6, ry: 4, fill: '#fffefa', stroke: '#c7d3c3', 'stroke-width': '.7' }));
    group.append(bud);
    // The transparent circle keeps the leaves easy to select with touch.
    group.append(make('circle', { r: 24, fill: 'transparent' }));
    const choose = () => {
      activeStory = index;
      interactive.querySelectorAll('.story-leaf').forEach(leaf => {
        leaf.classList.remove('is-selected');
        leaf.setAttribute('aria-pressed', 'false');
      });
      group.classList.add('is-selected');
      group.setAttribute('aria-pressed', 'true');
      if (story) story.textContent = item.text;
      if (!reducedMotion.matches && typeof shapes.animate === 'function') shapes.animate([
        { transform: `rotate(${item.angle}deg)` },
        { transform: `rotate(${item.angle - 12}deg)` },
        { transform: `rotate(${item.angle + 5}deg)` },
        { transform: `rotate(${item.angle}deg)` }
      ], { duration: 480, easing: 'ease-out' });
    };
    storyActions.push(choose);
    group.addEventListener('click', choose);
    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose();
      }
    });
    interactive.append(group);
  });
  svg.append(interactive);
  document.getElementById('next-leaf-story')?.addEventListener('click', () => {
    storyActions[(activeStory + 1) % storyActions.length]();
  });

  // A quiet patch of grass grounds the illustration without a backdrop.
  const grass = make('g', { 'aria-hidden': 'true', stroke: '#7b9469', 'stroke-width': 1.2, fill: 'none', 'stroke-linecap': 'round' });
  ['M191 490 l-3 -8 M192 490 l3 -6', 'M393 489 l-1 -9 M394 489 l4 -5', 'M230 489 l-2 -5'].forEach(d => grass.append(make('path', { d })));
  svg.append(grass);
  mount.append(svg);

  function calendarSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  function setSeason(selection, remember = false) {
    const season = selection === 'auto' ? calendarSeason() : selection;
    if (!['spring', 'summer', 'autumn', 'winter'].includes(season)) return;
    mount.dataset.season = season;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.season === selection)));
    const names = { spring: 'Spring in the garden', summer: 'Summer in the garden', autumn: 'Autumn in the garden', winter: 'Winter in the garden' };
    if (status) status.textContent = names[season] + (selection === 'auto' ? ' · Following the calendar' : '');
    if (remember) {
      try { localStorage.setItem('ochi-garden-season', selection); } catch (_) { /* Private browsing can disable storage. */ }
    }
    mount.dispatchEvent(new CustomEvent('seasonchange', { bubbles: true, detail: { season, selection } }));
  }

  buttons.forEach(button => button.addEventListener('click', () => setSeason(button.dataset.season, true)));
  let initial = 'summer';
  try { initial = localStorage.getItem('ochi-garden-season') || initial; } catch (_) { /* Use the green summer tree. */ }
  if (!['spring', 'summer', 'autumn', 'winter', 'auto'].includes(initial)) initial = 'summer';
  setSeason(initial);
})();
