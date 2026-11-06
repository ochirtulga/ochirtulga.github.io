(() => {
  'use strict';
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const preferenceKey = 'ochi-arcade-sound';
  const volume = 0.14;
  const maxSources = 12;
  const listeners = new Set();
  const voices = new Set();
  const lastCue = new Map();
  let enabled = true;
  let supported = typeof AudioContextClass === 'function';
  let context = null;
  let master = null;
  let unlocking = null;
  let noise = null;
  try { enabled = localStorage.getItem(preferenceKey) !== 'off'; } catch (_) { /* Preference storage is optional. */ }

  const state = () => Object.freeze({ enabled, supported });
  function notify() {
    const value = state();
    listeners.forEach(listener => { try { listener(value); } catch (_) { /* A control cannot interrupt a game. */ } });
  }
  function cleanup(voice) {
    if (voice.ended) return;
    voice.ended = true;
    voice.source.onended = null;
    [voice.source, voice.gain, voice.filter].filter(Boolean).forEach(node => { try { node.disconnect(); } catch (_) { /* Already disconnected. */ } });
    voices.delete(voice);
  }
  function stopVoices(immediately = false) {
    lastCue.clear();
    for (const voice of [...voices]) {
      try {
        const now = context?.currentTime || 0;
        if (immediately || context?.state !== 'running' || voice.start > now) {
          voice.source.stop();cleanup(voice);
        } else {
          voice.gain.gain.cancelScheduledValues(now);
          voice.gain.gain.setTargetAtTime(0.0001, now, 0.003);
          voice.source.stop(now + 0.02);
        }
      } catch (_) { cleanup(voice); }
    }
  }
  function stop() { stopVoices(); }
  function setEnabled(value) {
    const next = Boolean(value);
    if (next === enabled) return;
    enabled = next;
    try { localStorage.setItem(preferenceKey, enabled ? 'on' : 'off'); } catch (_) { /* Continue in memory. */ }
    if (master && context?.state !== 'closed') {
      try { master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(enabled ? volume : 0, context.currentTime); } catch (_) { /* The context may have been interrupted. */ }
    }
    if (!enabled) stopVoices(true);
    notify();
  }
  function unlock() {
    if (!enabled || !supported) return Promise.resolve(false);
    if (unlocking) return unlocking;
    // Called by a user gesture only. Event feedback never creates a context or
    // attempts to bypass the browser's autoplay policy.
    try {
      if (!context || context.state === 'closed') {
        stopVoices(true);
        context = new AudioContextClass({ latencyHint: 'interactive' });
        master = context.createGain();master.gain.value = volume;master.connect(context.destination);noise = null;
      }
    } catch (_) {
      supported = false;context = null;master = null;notify();return Promise.resolve(false);
    }
    try {
      const resume = context.state === 'running' ? undefined : context.resume();
      unlocking = Promise.resolve(resume).then(() => enabled && context?.state === 'running').catch(() => false).finally(() => { unlocking = null; });
      return unlocking;
    } catch (_) { return Promise.resolve(false); }
  }
  function addSource(source, peak, duration, delay = 0, filter = null) {
    if (voices.size >= maxSources) { try { source.disconnect();filter?.disconnect(); } catch (_) { /* A full voice pool can skip a sound. */ }return; }
    const start = context.currentTime + delay;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.009);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    if (filter) { source.connect(filter);filter.connect(gain); } else source.connect(gain);
    gain.connect(master);
    const voice = { source, gain, filter, start, ended: false };
    voices.add(voice);source.onended = () => cleanup(voice);
    try { source.start(start);source.stop(start + duration + 0.015); } catch (_) { cleanup(voice); }
  }
  function tone(from, to, duration = 0.13, delay = 0, peak = 0.45, type = 'triangle') {
    if (voices.size >= maxSources) return;
    const source = context.createOscillator();source.type = type;
    const start = context.currentTime + delay;
    source.frequency.setValueAtTime(from, start);
    source.frequency.exponentialRampToValueAtTime(to, start + duration);
    addSource(source, peak, duration, delay);
  }
  function swish() {
    if (!noise) {
      noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.17), context.sampleRate);
      const data = noise.getChannelData(0);
      let seed = 73619;
      for (let i = 0; i < data.length; i += 1) { seed ^= seed << 13;seed ^= seed >>> 17;seed ^= seed << 5;data[i] = ((seed >>> 0) / 4294967296) * 2 - 1; }
    }
    if (voices.size < maxSources) {
      const source = context.createBufferSource();source.buffer = noise;
      const filter = context.createBiquadFilter();filter.type = 'bandpass';filter.frequency.value = 1800;filter.Q.value = 0.7;
      addSource(source, 0.5, 0.16, 0, filter);
    }
    tone(784, 880, 0.16, 0.03, 0.35, 'sine');
    tone(1175, 1320, 0.19, 0.09, 0.28, 'sine');
  }
  const cues = {
    catch: () => { tone(523, 659, 0.10);tone(784, 880, 0.12, 0.055, 0.3, 'sine'); },
    miss: () => { tone(240, 150, 0.16, 0, 0.35, 'sine'); },
    shoot: () => { tone(150, 85, 0.11, 0, 0.28); },
    swish,
    end: () => { tone(392, 392, 0.14, 0, 0.3, 'sine');tone(523, 523, 0.2, 0.11, 0.3, 'sine'); },
    best: () => { [523, 659, 784, 1047].forEach((note, index) => tone(note, note, 0.2, index * 0.085, 0.3, 'sine')); }
  };
  function play(kind) {
    if (!enabled || !supported || !context || context.state !== 'running' || document.hidden || !cues[kind]) return;
    const now = context.currentTime;
    const cooldown = kind === 'catch' || kind === 'miss' ? 0.08 : kind === 'shoot' ? 0.1 : 0.18;
    if (lastCue.has(kind) && now - lastCue.get(kind) < cooldown) return;
    lastCue.set(kind, now);
    try { cues[kind](); } catch (_) { stopVoices(true); }
  }
  function subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    try { listener(state()); } catch (_) { /* Optional UI subscriber. */ }
    return () => listeners.delete(listener);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopVoices(true); });
  window.addEventListener('blur', () => stopVoices(true));
  window.OCHI_ARCADE_AUDIO = Object.freeze({ unlock, play, stop, setEnabled, subscribe, get enabled() { return enabled; }, get supported() { return supported; } });
})();
