(() => {
  'use strict';
  const mount = document.getElementById('season-tree');
  const svg = mount?.querySelector('svg');
  const controls = document.getElementById('garden-weather-controls');
  const toggle = document.getElementById('weather-toggle');
  if (!svg || !toggle || !controls) return;

  const NS = 'http://www.w3.org/2000/svg';
  const make = (tag, attributes = {}) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };
  const defs = make('defs');
  const clip = make('clipPath', { id: 'seasonal-weather-clip' });
  clip.append(make('rect', { x: 16, y: 12, width: 568, height: 470, rx: 30 }));
  defs.append(clip);
  const weather = make('g', { id: 'seasonal-weather', class: 'seasonal-weather', 'aria-hidden': 'true', 'pointer-events': 'none', 'clip-path': 'url(#seasonal-weather-clip)' });
  const scenes = new Map();
  ['spring', 'summer', 'autumn', 'winter'].forEach(season => {
    const scene = make('g', { class: 'weather-season', 'data-weather-season': season, display: 'none' });
    weather.append(scene);
    scenes.set(season, scene);
  });

  function cloud(scene, x, y, scale, tone) {
    const position = make('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + scale + ')' });
    const drift = make('g', { class: 'weather-motion weather-cloud', style: '--weather-delay:' + (-x / 60) + 's' });
    drift.append(make('path', {
      d: 'M-64 14C-78 13-79-5-65-12C-68-36-35-44-21-27C-7-45 23-38 27-17C49-25 70-11 65 8C62 19 47 19 31 18L-48 18C-55 18-60 17-64 14Z',
      fill: tone, stroke: '#c6d1c5', 'stroke-width': 1.1, 'stroke-linejoin': 'round'
    }));
    position.append(drift);
    scene.append(position);
  }
  const spring = scenes.get('spring');
  cloud(spring, 126, 88, .9, '#e4ece4');
  cloud(spring, 467, 63, .7, '#e9eee6');
  // Independent arithmetic keeps the existing tree's seeded geometry untouched.
  for (let index = 0; index < 26; index += 1) {
    const x = 40 + (index * 83) % 520;
    const y = 102 + (index * 61) % 310;
    const drop = make('g', { transform: 'translate(' + x + ' ' + y + ')' });
    drop.append(make('path', { d: 'M0 0L-4 12', class: 'weather-motion weather-rain', style: '--weather-delay:' + (-index * .29) + 's;--weather-duration:' + (1.65 + index % 4 * .2) + 's' }));
    spring.append(drop);
  }

  const summer = scenes.get('summer');
  const sun = make('g', { transform: 'translate(478 83)', class: 'weather-sun' });
  sun.append(make('circle', { r: 30, fill: '#ead695', opacity: .28 }));
  sun.append(make('circle', { r: 23, fill: '#e0c276', opacity: .65 }));
  const rays = make('g', { class: 'weather-motion weather-sun-rays', fill: 'none', stroke: '#d5b46c', 'stroke-width': 1.7, 'stroke-linecap': 'round' });
  for (let index = 0; index < 12; index += 1) {
    const angle = index * Math.PI / 6;
    rays.append(make('path', { d: 'M' + (Math.cos(angle) * 36).toFixed(2) + ' ' + (Math.sin(angle) * 36).toFixed(2) + 'L' + (Math.cos(angle) * 47).toFixed(2) + ' ' + (Math.sin(angle) * 47).toFixed(2) }));
  }
  sun.append(rays);
  summer.append(sun);
  cloud(summer, 113, 116, .63, '#edf0e4');
  for (let index = 0; index < 7; index += 1) {
    const position = make('g', { transform: 'translate(' + (61 + index * 79) + ' ' + (208 + index % 3 * 73) + ')' });
    position.append(make('circle', { r: 1.7 + index % 2 * .5, class: 'weather-motion weather-mote', style: '--weather-delay:' + (-index * 1.4) + 's' }));
    summer.append(position);
  }

  const autumn = scenes.get('autumn');
  [
    'M34 160C72 149 94 167 127 158C147 153 149 135 136 132C126 130 121 139 127 144',
    'M466 228C503 217 528 235 557 224C570 219 568 207 558 207',
    'M59 364C87 352 118 373 146 360',
    'M432 411C464 401 499 420 534 404'
  ].forEach((d, index) => autumn.append(make('path', { d, class: 'weather-motion weather-wind', style: '--weather-delay:' + (-index * 1.8) + 's' })));
  [[64, 227, -22], [532, 143, 30], [93, 411, -34], [494, 379, 24], [173, 439, 45], [434, 62, -25]].forEach(([x, y, angle], index) => {
    const position = make('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + angle + ')' });
    const drift = make('g', { class: 'weather-motion weather-leaf', style: '--weather-delay:' + (-index * 1.7) + 's;--weather-duration:' + (7 + index % 3) + 's' });
    drift.append(make('path', { d: 'M0 7C-7 2-5-5 0-8C7-4 6 3 0 7Z', fill: index % 2 ? '#c79958' : '#b88750' }));
    drift.append(make('path', { d: 'M0 6L0-6', stroke: '#967045', 'stroke-width': .7, opacity: .7 }));
    position.append(drift);
    autumn.append(position);
  });

  const winter = scenes.get('winter');
  cloud(winter, 128, 72, .85, '#e7ece6');
  cloud(winter, 478, 101, .73, '#e7ece6');
  for (let index = 0; index < 29; index += 1) {
    const x = 38 + index * 97 % 520;
    const y = 61 + index * 73 % 365;
    const position = make('g', { transform: 'translate(' + x + ' ' + y + ')' });
    const flake = make('g', { class: 'weather-motion weather-flake', style: '--weather-delay:' + (-index * .83) + 's;--weather-duration:' + (8 + index % 5) + 's' });
    if (index % 7 === 0) flake.append(make('path', { d: 'M-4 0H4M0-4V4M-3-3L3 3M-3 3L3-3', fill: 'none', stroke: '#b8cbc3', 'stroke-width': 1, 'stroke-linecap': 'round' }));
    else flake.append(make('circle', { r: 2.2 + index % 3 * .55, fill: '#fffefa', stroke: '#b6c8bf', 'stroke-width': .8 }));
    position.append(flake);
    winter.append(position);
  }
  const firstArtwork = [...svg.children].find(node => !['title', 'desc', 'defs'].includes(node.localName));
  svg.insertBefore(defs, firstArtwork);
  svg.insertBefore(weather, firstArtwork);

  let manuallyPaused = false;
  let sceneVisible = !('IntersectionObserver' in window);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateMotion() {
    controls.hidden = motion.matches;
    mount.dataset.weatherMotion = motion.matches ? 'still' : manuallyPaused ? 'paused' : sceneVisible && !document.hidden ? 'playing' : 'idle';
    toggle.querySelector('.weather-toggle-label').textContent = manuallyPaused ? 'Play weather' : 'Pause weather';
    toggle.querySelector('.weather-toggle-icon').textContent = manuallyPaused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', (manuallyPaused ? 'Play' : 'Pause') + ' seasonal weather animation');
  }
  function updateSeason() {
    const active = mount.dataset.season;
    scenes.forEach((scene, season) => scene.setAttribute('display', active === season ? 'inline' : 'none'));
    updateMotion();
  }
  toggle.addEventListener('click', () => { manuallyPaused = !manuallyPaused;updateMotion(); });
  mount.addEventListener('seasonchange', updateSeason);
  document.addEventListener('visibilitychange', updateMotion);
  if (motion.addEventListener) motion.addEventListener('change', updateMotion);
  else if (motion.addListener) motion.addListener(updateMotion);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { sceneVisible = entries[0].isIntersecting;updateMotion(); }, { threshold: 0 });
    observer.observe(mount);
  }
  updateSeason();
})();
