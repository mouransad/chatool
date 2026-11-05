/*
 * Shared motion for the `@chatool/ui` loading family: the Material easing curves,
 * the timing constants lifted from Compose's indicators, and the small tween the
 * progress engines step frame by frame. Engines advance by `dt` (never wall-clock
 * time), so a paused or off-screen indicator resumes exactly where it stopped.
 */

export type Easing = (fraction: number) => number;

/** `cubic-bezier()` as a function; WAAPI-style solver with a bisection fallback. */
export const cubicBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): Easing => {
  const axis = (a: number, b: number, t: number) => {
    const u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  };
  return (fraction) => {
    if (fraction <= 0) return 0;
    if (fraction >= 1) return 1;
    let low = 0;
    let high = 1;
    let t = fraction;
    for (let i = 0; i < 16; i++) {
      const x = axis(x1, x2, t);
      if (Math.abs(x - fraction) < 1e-4) break;
      if (x < fraction) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return axis(y1, y2, t);
  };
};

export const LINEAR: Easing = (fraction) => fraction;
/** MD3 `standard`. */
export const STANDARD = cubicBezier(0.2, 0, 0, 1);
/** MD3 `emphasized-accelerate`. */
export const EMPHASIZED_ACCELERATE = cubicBezier(0.3, 0, 0.8, 0.15);
/** MD3 `emphasized-decelerate`. */
export const EMPHASIZED_DECELERATE = cubicBezier(0.05, 0.7, 0.1, 1);

/** `WavyProgressIndicatorDefaults.ProgressAnimationSpec` (`long2`). */
export const PROGRESS_DURATION = 500;
/** Duration of the wave's amplitude fading in or out (`long2`). */
export const AMPLITUDE_DURATION = 500;

/** Shortest usable wave; below it waves blur together and vertex counts explode. */
export const MIN_WAVELENGTH = 4;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const lerp = (start: number, stop: number, fraction: number) =>
  start + (stop - start) * fraction;

/** Rounds path data to 2 decimals: sub-pixel at every size, and far shorter. */
export const round = (value: number) => Math.round(value * 100) / 100;

/** A keyframe `0 → 1`, delayed by `delay` then eased over `duration`. */
export const delayedEase = (
  time: number,
  delay: number,
  duration: number,
  easing: Easing,
) => easing(clamp((time - delay) / duration, 0, 1));

/**
 * `indicatorAmplitude`: the wave grows in after 10% and settles flat by 95%, so
 * the bar reads as a clean line while it starts and as it completes.
 */
export const defaultAmplitude = (progress: number) =>
  progress <= 0.1 || progress >= 0.95 ? 0 : 1;

export interface Tween {
  value: number;
  from: number;
  to: number;
  elapsed: number;
  duration: number;
  easing: Easing;
}

export const createTween = (value: number): Tween => ({
  value,
  from: value,
  to: value,
  elapsed: 0,
  duration: 0,
  easing: LINEAR,
});

export const startTween = (
  tween: Tween,
  to: number,
  duration: number,
  easing: Easing,
) => {
  tween.from = tween.value;
  tween.to = to;
  tween.elapsed = 0;
  tween.duration = duration;
  tween.easing = easing;
};

export const snapTween = (tween: Tween, value: number) => {
  tween.value = value;
  tween.from = value;
  tween.to = value;
  tween.duration = 0;
};

/** Advances the tween; returns whether it is still running. */
export const stepTween = (tween: Tween, dt: number) => {
  if (tween.duration === 0) return false;
  tween.elapsed += dt;
  const fraction = Math.min(tween.elapsed / tween.duration, 1);
  tween.value = lerp(tween.from, tween.to, tween.easing(fraction));
  if (fraction === 1) tween.duration = 0;
  return tween.duration !== 0;
};

/** Eases the wave's amplitude toward `target`: gently in, accelerating out. */
export const retargetAmplitude = (tween: Tween, target: number) => {
  if (tween.to === target) return;
  startTween(
    tween,
    target,
    AMPLITUDE_DURATION,
    tween.value < target ? STANDARD : EMPHASIZED_ACCELERATE,
  );
};
