/*
 * Circular progress drawing + timeline, ported from Compose's
 * `CircularWavyProgressModifiers`. Pure (no DOM, no React), so the server can
 * render the first frame and the client continues from it.
 */

import {
  EMPHASIZED_DECELERATE,
  LINEAR,
  PROGRESS_DURATION,
  STANDARD,
  clamp,
  createTween,
  defaultAmplitude,
  lerp,
  retargetAmplitude,
  round,
  snapTween,
  startTween,
  stepTween,
} from "../motion";
import { waveMorph } from "../shapes/material-shapes";
import { morphPointCount, morphPoints } from "../shapes/morph";

const CYCLE_DURATION = 6000;
const MIN_SWEEP = 0.1;
const MAX_SWEEP = 0.87;
const GLOBAL_ROTATION = 1080;
const STEP_INTERVAL = 1500;
const STEP_DURATION = 300;
/** Where the wavy indicator starts its cycle; the flat one starts at the top. */
const WAVY_BASE_ROTATION = 90;
const HANDOFF_MIN_DURATION = 300;
const HANDOFF_MAX_DURATION = 600;
const MIN_VERTICES = 5;

/** What the reduced-motion indeterminate ring holds still at (it pulses instead). */
const REDUCED_SWEEP = 0.25;

/** `pathLength` of the active path, traced twice so the wave can slide along it. */
export const ACTIVE_PATH_LENGTH = 2;

export interface CircularOptions {
  /** Progress in `0..1`; `undefined` is indeterminate. */
  fraction: number | undefined;
  wavy: boolean;
  size: number;
  thickness: number;
  amplitude: number;
  wavelength: number;
  waveSpeed: number | undefined;
  gap: number;
  animated: boolean;
  reducedMotion: boolean;
}

export interface CircularFrame {
  rotation: string | undefined;
  trackD: string;
  trackDashArray: string;
  trackDashOffset: number;
  trackHidden: boolean;
  activeD: string;
  activeTransform: string | undefined;
  activeDashArray: string;
  activeDashOffset: number;
  activeHidden: boolean;
}

/** The two-keyframe sweep: out over 3s, then eased back in over the next 3s. */
const sweepAt = (time: number) => {
  const half = CYCLE_DURATION / 2;
  return time < half
    ? lerp(MIN_SWEEP, MAX_SWEEP, time / half)
    : lerp(MAX_SWEEP, MIN_SWEEP, STANDARD((time - half) / half));
};

/** A 90° step over 300ms, every 1.5s, on top of the steady rotation. */
const stepRotationAt = (time: number) => {
  const step = Math.floor(time / STEP_INTERVAL);
  return (step + clamp((time % STEP_INTERVAL) / STEP_DURATION, 0, 1)) * 90;
};

let scratch = new Float64Array(0);

/** The wave outline at `amplitude`, in px, starting at 12 o'clock and traced twice. */
const wavePath = (
  numVertices: number,
  amplitude: number,
  size: number,
  thickness: number,
) => {
  const morph = waveMorph(numVertices);
  const count = morphPointCount(morph);
  if (scratch.length < count) scratch = new Float64Array(count);
  morphPoints(morph, amplitude, scratch);

  const scale = size - thickness;
  const center = size / 2;
  const startAngle =
    -Math.PI / 2 - Math.atan2(scratch[1]! - 0.5, scratch[0]! - 0.5);
  const cos = Math.cos(startAngle);
  const sin = Math.sin(startAngle);
  for (let i = 0; i < count; i += 2) {
    const x = (scratch[i]! - 0.5) * scale;
    const y = (scratch[i + 1]! - 0.5) * scale;
    scratch[i] = round(x * cos - y * sin + center);
    scratch[i + 1] = round(x * sin + y * cos + center);
  }

  let loop = "";
  for (let i = 2; i < count; i += 6) {
    loop += `C${scratch[i]} ${scratch[i + 1]} ${scratch[i + 2]} ${scratch[i + 3]} ${scratch[i + 4]} ${scratch[i + 5]}`;
  }
  return `M${scratch[0]} ${scratch[1]}${loop}${loop}Z`;
};

const trackPath = (size: number, radius: number) => {
  const center = size / 2;
  const top = round(center - radius);
  const bottom = round(center + radius);
  return `M${center} ${top}A${radius} ${radius} 0 1 1 ${center} ${bottom}A${radius} ${radius} 0 1 1 ${center} ${top}`;
};

export class CircularEngine {
  private options: CircularOptions;
  private indeterminate = false;
  private cycleTime = 0;
  private waveOffset = 0;
  private handoffStartSweep = 0;
  private handoffStartRotation = 0;
  private readonly progress = createTween(0);
  private readonly amplitude = createTween(0);
  private readonly handoff = createTween(1);
  private pathKey = "";
  private path = "";

  constructor(options: CircularOptions) {
    this.options = options;
    this.indeterminate = options.fraction === undefined;
    snapTween(this.progress, options.fraction ?? 0);
    snapTween(this.amplitude, this.targetAmplitude());
  }

  update(options: CircularOptions) {
    const previous = this.options.fraction;
    this.options = options;
    const { fraction, animated, reducedMotion } = options;

    if (fraction === undefined) {
      if (!this.indeterminate) {
        this.indeterminate = true;
        this.cycleTime = 0;
        snapTween(this.handoff, 1);
      }
    } else if (this.indeterminate) {
      this.startHandoff();
    } else if (fraction !== previous) {
      if (animated && !reducedMotion) {
        startTween(this.progress, fraction, PROGRESS_DURATION, LINEAR);
      } else {
        snapTween(this.progress, fraction);
      }
    }
    retargetAmplitude(this.amplitude, this.targetAmplitude());
  }

  /** The arc turns back to 12 o'clock while its sweep eases to the real value. */
  private startHandoff() {
    this.handoffStartSweep = this.currentSweep();
    const rotation = this.currentRotation() % 360;
    this.handoffStartRotation = rotation === 0 ? 360 : rotation;
    const remaining = (360 - this.handoffStartRotation) / 360;
    this.indeterminate = false;
    this.cycleTime = 0;
    snapTween(this.progress, this.options.fraction ?? 0);
    snapTween(this.handoff, 0);
    if (this.options.reducedMotion) snapTween(this.handoff, 1);
    else {
      startTween(
        this.handoff,
        1,
        lerp(HANDOFF_MIN_DURATION, HANDOFF_MAX_DURATION, remaining),
        EMPHASIZED_DECELERATE,
      );
    }
  }

  private targetAmplitude() {
    const { wavy, amplitude } = this.options;
    if (!wavy) return 0;
    return this.indeterminate
      ? amplitude
      : amplitude * defaultAmplitude(this.progress.to);
  }

  private currentSweep() {
    return this.options.reducedMotion ? REDUCED_SWEEP : sweepAt(this.cycleTime);
  }

  private currentRotation() {
    if (this.options.reducedMotion) return 0;
    const time = this.cycleTime;
    return (
      (GLOBAL_ROTATION * time) / CYCLE_DURATION +
      stepRotationAt(time) +
      (this.options.wavy ? WAVY_BASE_ROTATION : 0)
    );
  }

  /** `2πr / wavelength` waves, so the outline always closes on a whole wave. */
  private vertices() {
    const { size, thickness, wavelength } = this.options;
    const radius = size / 2 - thickness / 2;
    return Math.max(
      MIN_VERTICES,
      Math.round((2 * Math.PI * radius) / wavelength),
    );
  }

  /** The outline only changes with the amplitude, so it's rebuilt only then. */
  private activePath(amplitude: number) {
    const { size, thickness } = this.options;
    const vertices = this.vertices();
    const key = `${vertices} ${amplitude} ${size} ${thickness}`;
    if (key !== this.pathKey) {
      this.pathKey = key;
      this.path = wavePath(vertices, amplitude, size, thickness);
    }
    return this.path;
  }

  /** Advances by `dt` ms; returns whether anything is still moving. */
  step(dt: number) {
    const { reducedMotion, waveSpeed, wavelength } = this.options;
    let running = false;

    if (this.indeterminate && !reducedMotion) {
      this.cycleTime = (this.cycleTime + dt) % CYCLE_DURATION;
      running = true;
    }
    if (stepTween(this.handoff, dt)) running = true;
    if (stepTween(this.progress, dt)) running = true;

    retargetAmplitude(this.amplitude, this.targetAmplitude());
    if (stepTween(this.amplitude, dt)) running = true;

    const speed = waveSpeed ?? wavelength;
    if (this.amplitude.value > 0 && speed > 0 && !reducedMotion) {
      const turn = (this.vertices() * wavelength * 1000) / speed;
      this.waveOffset = (this.waveOffset + dt / turn) % 1;
      running = true;
    }
    return running;
  }

  draw(): CircularFrame {
    const { size, thickness, gap } = this.options;
    const amplitude = this.amplitude.value;

    let end: number;
    let rotation: number;
    if (this.indeterminate) {
      end = this.currentSweep();
      rotation = this.currentRotation();
    } else if (this.handoff.value < 1) {
      end = lerp(
        this.handoffStartSweep,
        this.progress.value,
        this.handoff.value,
      );
      rotation = lerp(this.handoffStartRotation, 360, this.handoff.value) % 360;
    } else {
      end = this.progress.value;
      rotation = 0;
    }

    const center = size / 2;
    const radius = (size - thickness) / 2;
    const trackLength = 2 * Math.PI * radius;

    // `spacing` runs from the head's cap to the track's cap, so the visible gap
    // is exactly `gap`; both shrink away near zero, where the bar is just a dot.
    const stop = end * trackLength;
    const spacing = Math.min(stop, thickness / 2) * 2 + Math.min(stop, gap);
    const trackStart = end * trackLength + spacing;
    const trackStop = trackLength - spacing;

    const angle = (this.waveOffset * 360) % 360;
    return {
      rotation:
        rotation === 0
          ? undefined
          : `rotate(${round(rotation)} ${center} ${center})`,
      trackD: trackPath(size, radius),
      trackDashArray: `${round(Math.max(trackStop - trackStart, 0))} ${round(trackLength)}`,
      trackDashOffset: round(-trackStart),
      trackHidden: trackStop <= trackStart,
      activeD: this.activePath(amplitude),
      activeTransform:
        amplitude > 0 && angle !== 0
          ? `rotate(${round(-angle)} ${center} ${center})`
          : undefined,
      activeDashArray: `${end.toFixed(4)} ${ACTIVE_PATH_LENGTH}`,
      activeDashOffset: amplitude > 0 ? -Number(this.waveOffset.toFixed(4)) : 0,
      activeHidden: end <= 0,
    };
  }
}
