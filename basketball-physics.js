(() => {
  'use strict';

  // Metres and seconds. This model is independent of rendering and frame rate.
  const constants = Object.freeze({
    origin: Object.freeze({ x: 0, y: 0.7, z: 0 }),
    hoop: Object.freeze({ x: 0, y: 3.05, z: 10.5, radius: 0.62 }),
    ballRadius: 0.16,
    gravity: 9.8
  });
  const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function makeShot(aimDeg = 0, power01 = 0.5) {
    const aim = clamp(finite(aimDeg, 0), -24, 24);
    const power = clamp(finite(power01, 0.5), 0, 1);
    const vz = 5.8 + 4.6 * power;
    const vy = 6.7 + 3 * power;
    const vx = Math.tan(aim * Math.PI / 180) * vz;
    return Object.freeze({
      origin: constants.origin,
      velocity: Object.freeze({ x: vx, y: vy, z: vz }),
      vx, vy, vz, aimDeg: aim, power
    });
  }

  function coefficients(shot) {
    if (!shot || typeof shot !== 'object') return null;
    const origin = shot.origin || constants.origin;
    const vx = shot.vx ?? shot.velocity?.x;
    const vy = shot.vy ?? shot.velocity?.y;
    const vz = shot.vz ?? shot.velocity?.z;
    return [origin.x, origin.y, origin.z, vx, vy, vz].every(Number.isFinite)
      ? { origin, vx, vy, vz }
      : null;
  }

  function pointAt(shot, seconds) {
    const values = coefficients(shot);
    if (!values || !Number.isFinite(seconds)) return null;
    const t = Math.max(0, seconds);
    return {
      x: values.origin.x + values.vx * t,
      y: values.origin.y + values.vy * t - 0.5 * constants.gravity * t * t,
      z: values.origin.z + values.vz * t
    };
  }

  function crossing(shot) {
    const values = coefficients(shot);
    if (!values) return null;
    const rise = constants.hoop.y - values.origin.y;
    const discriminant = values.vy * values.vy - 2 * constants.gravity * rise;
    // A tangent at the apex does not travel down through the rim.
    if (discriminant <= 0) return null;
    const t = (values.vy + Math.sqrt(discriminant)) / constants.gravity;
    if (t <= 0 || values.vy - constants.gravity * t >= 0) return null;
    const point = pointAt(shot, t);
    return point ? { t, x: point.x, z: point.z } : null;
  }

  function classify(shot) {
    const hit = crossing(shot);
    if (!hit) return { made: false, reason: 'short', crossing: null };
    const dx = hit.x - constants.hoop.x;
    const dz = hit.z - constants.hoop.z;
    const clearance = constants.hoop.radius - constants.ballRadius;
    if (dx * dx + dz * dz <= clearance * clearance) {
      return { made: true, reason: 'made', crossing: hit };
    }
    const reason = Math.abs(dx) > Math.abs(dz)
      ? (dx < 0 ? 'left' : 'right')
      : (dz < 0 ? 'short' : 'long');
    return { made: false, reason, crossing: hit };
  }

  function flightDuration(shot) {
    const values = coefficients(shot);
    if (!values) return 0;
    const discriminant = values.vy * values.vy + 2 * constants.gravity * values.origin.y;
    if (discriminant < 0) return 0;
    return Math.max(0, (values.vy + Math.sqrt(discriminant)) / constants.gravity);
  }

  window.OCHI_HOOPS_PHYSICS = Object.freeze({ constants, makeShot, pointAt, crossing, classify, flightDuration });
})();
