/*
 * Frame math for the loading indicator, ported from Compose's `LoadingIndicator`.
 * Pure (no DOM, no React) so the first frame can be rendered on the server.
 */

import { round } from "../motion";
import { morphPointCount, morphPoints } from "../shapes/morph";
import {
  type MorphSequence,
  determinateSequence,
  indeterminateSequence,
} from "../shapes/material-shapes";

/** The SVG viewBox, in dp: the path scales with whatever size the box is given. */
export const VIEW_BOX_SIZE = 48;
/** The 38dp active indicator inside its 48dp container. */
const ACTIVE_INDICATOR_SCALE = 38 / 48;

const MORPH_INTERVAL = 650;
const GLOBAL_ROTATION_DURATION = 4666;
const QUARTER_ROTATION = 90;

// The morph spring, `spring(dampingRatio = 0.6, stiffness = 200)`, solved
// analytically so it can be sampled at any time.
const NATURAL_FREQUENCY = Math.sqrt(200);
const DECAY = 0.6 * NATURAL_FREQUENCY;
const DAMPED_FREQUENCY = NATURAL_FREQUENCY * Math.sqrt(1 - 0.6 * 0.6);

/**
 * The spring's position `ms` after a morph starts: it overshoots by ~9%, which
 * extrapolates the shape past its target for the indicator's bounce. Compose cuts
 * the spring off at a 0.1 visibility threshold, popping that overshoot back in one
 * frame; letting it settle over the full interval is smoother and otherwise equal.
 */
const morphSpring = (ms: number) => {
  const t = ms / 1000;
  return (
    1 -
    Math.exp(-DECAY * t) *
      (Math.cos(DAMPED_FREQUENCY * t) +
        (DECAY / DAMPED_FREQUENCY) * Math.sin(DAMPED_FREQUENCY * t))
  );
};

export interface LoadingFrame {
  d: string;
  transform: string;
}

export interface LoadingState {
  morphIndex: number;
  morphTime: number;
  morphRotation: number;
  globalTime: number;
}

export const createLoadingState = (): LoadingState => ({
  morphIndex: 0,
  morphTime: 0,
  morphRotation: QUARTER_ROTATION,
  globalTime: 0,
});

let scratch = new Float64Array(0);

/** The morphed outline, scaled into the box and centered by its control bounds. */
const morphPath = (
  { morphs, scale }: MorphSequence,
  index: number,
  progress: number,
) => {
  const morph = morphs[index]!;
  const count = morphPointCount(morph);
  if (scratch.length < count) scratch = new Float64Array(count);
  morphPoints(morph, progress, scratch);

  const size = VIEW_BOX_SIZE * scale * ACTIVE_INDICATOR_SCALE;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i += 2) {
    const x = scratch[i]! * size;
    const y = scratch[i + 1]! * size;
    scratch[i] = x;
    scratch[i + 1] = y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const offsetX = VIEW_BOX_SIZE / 2 - (minX + maxX) / 2;
  const offsetY = VIEW_BOX_SIZE / 2 - (minY + maxY) / 2;

  let d = `M${round(scratch[0]! + offsetX)} ${round(scratch[1]! + offsetY)}`;
  for (let i = 2; i < count; i += 6) {
    d += `C${round(scratch[i]! + offsetX)} ${round(scratch[i + 1]! + offsetY)} ${round(scratch[i + 2]! + offsetX)} ${round(scratch[i + 3]! + offsetY)} ${round(scratch[i + 4]! + offsetX)} ${round(scratch[i + 5]! + offsetY)}`;
  }
  return `${d}Z`;
};

const rotated = (degrees: number) =>
  `rotate(${round(degrees)} ${VIEW_BOX_SIZE / 2} ${VIEW_BOX_SIZE / 2})`;

/** Advances the morph timeline and global rotation by `dt` milliseconds. */
export const stepLoading = (state: LoadingState, dt: number) => {
  const { morphs } = indeterminateSequence();
  state.globalTime = (state.globalTime + dt) % GLOBAL_ROTATION_DURATION;
  state.morphTime += dt;
  if (state.morphTime >= MORPH_INTERVAL) {
    state.morphTime -= MORPH_INTERVAL;
    state.morphIndex = (state.morphIndex + 1) % morphs.length;
    state.morphRotation = (state.morphRotation + QUARTER_ROTATION) % 360;
  }
};

export const indeterminateFrame = (state: LoadingState): LoadingFrame => {
  const progress = morphSpring(state.morphTime);
  return {
    d: morphPath(indeterminateSequence(), state.morphIndex, progress),
    // Each morph adds a quarter turn on top of the steady global rotation.
    transform: rotated(
      progress * QUARTER_ROTATION +
        state.morphRotation +
        (state.globalTime / GLOBAL_ROTATION_DURATION) * 360,
    ),
  };
};

/** `fraction` drives the circle → soft-burst morph and a half turn back. */
export const determinateFrame = (fraction: number): LoadingFrame => ({
  d: morphPath(determinateSequence(), 0, fraction),
  transform: rotated(-fraction * 180),
});
