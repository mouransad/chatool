/*
 * Linear progress drawing + timeline, ported from Compose's
 * `LinearWavyProgressModifiers`. Pure (no DOM, no React): the engine owns every
 * value that moves per frame, and `draw` turns them into SVG attributes.
 */

import {
  EMPHASIZED_ACCELERATE,
  LINEAR,
  PROGRESS_DURATION,
  clamp,
  createTween,
  defaultAmplitude,
  delayedEase,
  lerp,
  retargetAmplitude,
  round,
  snapTween,
  startTween,
  stepTween,
} from "../motion";

const CYCLE_DURATION = 1750;
const FIRST_HEAD_DELAY = 0;
const FIRST_HEAD_DURATION = 1000;
const FIRST_TAIL_DELAY = 250;
const FIRST_TAIL_DURATION = 1000;
const SECOND_HEAD_DELAY = 650;
const SECOND_HEAD_DURATION = 850;
const SECOND_TAIL_DELAY = 900;
const SECOND_TAIL_DURATION = 850;

/** The first line has left the track from this point of the cycle on. */
const FIRST_LINE_EXIT = FIRST_TAIL_DELAY + FIRST_TAIL_DURATION;
/** Leaving indeterminate plays the rest of the lines, ramping up to 2.5× speed. */
const HANDOFF_MAX_SPEED = 2.5;
const HANDOFF_RAMP_DURATION = 150;

const DETERMINATE_WAVELENGTH = 40;
const INDETERMINATE_WAVELENGTH = 20;

/** What the reduced-motion indeterminate bar holds still at (it pulses instead). */
const REDUCED_SEGMENT = [0.15, 0.85, 0, 0] as const;

export interface LinearOptions {
  /** Progress in `0..1`; `undefined` is indeterminate. */
  fraction: number | undefined;
  wavy: boolean;
  thickness: number;
  amplitude: number;
  wavelength: number | undefined;
  waveSpeed: number | undefined;
  gap: number;
  stop: boolean;
  animated: boolean;
  reducedMotion: boolean;
}

export interface LinearFrame {
  track: string;
  first: string;
  second: string;
  stopX: number;
  stopY: number;
  stopRadius: number;
}

/**
 * The wave between `tail` and `head`, moved left by `shift`. Android measures a full
 * wave path and cuts a segment by arc length; each half wave here is a quadratic
 * whose `x` is linear in `t`, so its cut is simply the blossom at `t0, t1` — the same
 * curve, with the ends landing on exact `x` positions.
 */
const wavePath = (
  tail: number,
  head: number,
  shift: number,
  wavelength: number,
  centerY: number,
  crest: number,
) => {
  const period = wavelength / 2;
  const end = head + shift;
  // A quadratic peaks at half its control height.
  const control = crest * 2;
  let x = tail + shift;
  let index = Math.floor(x / period);

  const heightAt = (t0: number, t1: number) =>
    centerY +
    (index % 2 === 0 ? 1 : -1) * control * ((1 - t0) * t1 + t0 * (1 - t1));
  const fractionAt = (position: number) => position / period - index;

  const startFraction = fractionAt(x);
  let d = `M${round(tail)} ${round(heightAt(startFraction, startFraction))}`;
  if (head <= tail) return `${d}l0 0`;

  while (x < end) {
    const next = Math.min((index + 1) * period, end);
    const t0 = fractionAt(x);
    const t1 = fractionAt(next);
    d += `Q${round((x + next) / 2 - shift)} ${round(heightAt(t0, t1))} ${round(next - shift)} ${round(heightAt(t1, t1))}`;
    x = next;
    index++;
  }
  return d;
};

export class LinearEngine {
  private options: LinearOptions;
  private width = 0;
  private indeterminate = false;
  private exiting = false;
  private exitTime = 0;
  private cycleTime = 0;
  private drawSecondLine = true;
  private waveOffset = 0;
  private readonly progress = createTween(0);
  private readonly amplitude = createTween(0);
  private readonly handoff = createTween(1);

  constructor(options: LinearOptions) {
    this.options = options;
    this.indeterminate = options.fraction === undefined;
    snapTween(this.progress, options.fraction ?? 0);
    snapTween(this.amplitude, this.targetAmplitude());
  }

  resize(width: number) {
    this.width = width;
  }

  update(options: LinearOptions) {
    const previous = this.options.fraction;
    this.options = options;
    const { fraction, animated, reducedMotion } = options;

    if (fraction === undefined) {
      this.exiting = false;
      if (!this.indeterminate) {
        this.indeterminate = true;
        this.cycleTime = 0;
        this.drawSecondLine = true;
        snapTween(this.handoff, 1);
      }
    } else if (this.indeterminate) {
      if (reducedMotion) this.finishHandoff();
      else if (!this.exiting) {
        this.exiting = true;
        this.exitTime = 0;
        this.drawSecondLine =
          this.drawSecondLine && this.cycleTime > SECOND_HEAD_DELAY;
      }
    } else if (fraction !== previous) {
      if (animated && !reducedMotion) {
        startTween(this.progress, fraction, PROGRESS_DURATION, LINEAR);
      } else {
        snapTween(this.progress, fraction);
      }
    }
    retargetAmplitude(this.amplitude, this.targetAmplitude());
  }

  private targetAmplitude() {
    const { wavy, amplitude } = this.options;
    if (!wavy) return 0;
    return this.indeterminate
      ? amplitude
      : amplitude * defaultAmplitude(this.progress.to);
  }

  private wavelength() {
    return (
      this.options.wavelength ??
      (this.indeterminate ? INDETERMINATE_WAVELENGTH : DETERMINATE_WAVELENGTH)
    );
  }

  /** The bar picks up from nothing, drawing itself in up to the real value. */
  private finishHandoff() {
    this.indeterminate = false;
    this.exiting = false;
    this.cycleTime = 0;
    snapTween(this.progress, this.options.fraction ?? 0);
    snapTween(this.amplitude, this.targetAmplitude());
    snapTween(this.handoff, this.options.reducedMotion ? 1 : 0);
    if (!this.options.reducedMotion) {
      startTween(this.handoff, 1, PROGRESS_DURATION, LINEAR);
    }
  }

  private stepCycle(dt: number) {
    if (this.exiting) {
      this.exitTime += dt;
      const ramp = clamp(this.exitTime / HANDOFF_RAMP_DURATION, 0, 1);
      const time = this.cycleTime + dt * lerp(1, HANDOFF_MAX_SPEED, ramp);
      const exit = this.drawSecondLine ? CYCLE_DURATION : FIRST_LINE_EXIT;
      if (time >= exit) this.finishHandoff();
      else this.cycleTime = time;
      return;
    }
    const time = this.cycleTime + dt;
    if (time >= CYCLE_DURATION) this.drawSecondLine = true;
    this.cycleTime = time % CYCLE_DURATION;
  }

  /** Advances by `dt` ms; returns whether anything is still moving. */
  step(dt: number) {
    const { reducedMotion, waveSpeed } = this.options;
    let running = false;

    if (this.indeterminate && !reducedMotion) {
      this.stepCycle(dt);
      running = true;
    }
    if (stepTween(this.handoff, dt)) running = true;
    if (stepTween(this.progress, dt)) running = true;

    retargetAmplitude(this.amplitude, this.targetAmplitude());
    if (stepTween(this.amplitude, dt)) running = true;

    const wavelength = this.wavelength();
    const speed = waveSpeed ?? wavelength;
    if (this.amplitude.value > 0 && speed > 0 && !reducedMotion) {
      this.waveOffset =
        (this.waveOffset + (dt * speed) / (wavelength * 1000)) % 1;
      running = true;
    }
    return running;
  }

  private fractions(): readonly number[] {
    if (!this.indeterminate) {
      return [0, this.progress.value * this.handoff.value, 0, 0];
    }
    if (this.options.reducedMotion) return REDUCED_SEGMENT;
    const time = this.cycleTime;
    const firstHead = delayedEase(
      time,
      FIRST_HEAD_DELAY,
      FIRST_HEAD_DURATION,
      EMPHASIZED_ACCELERATE,
    );
    const firstTail = delayedEase(
      time,
      FIRST_TAIL_DELAY,
      FIRST_TAIL_DURATION,
      EMPHASIZED_ACCELERATE,
    );
    if (!this.drawSecondLine) return [firstTail, firstHead, 0, 0];
    return [
      firstTail,
      firstHead,
      delayedEase(
        time,
        SECOND_TAIL_DELAY,
        SECOND_TAIL_DURATION,
        EMPHASIZED_ACCELERATE,
      ),
      delayedEase(
        time,
        SECOND_HEAD_DELAY,
        SECOND_HEAD_DURATION,
        EMPHASIZED_ACCELERATE,
      ),
    ];
  }

  /** Current frame in px, or `undefined` until the width is known. */
  draw(): LinearFrame | undefined {
    const { width } = this;
    if (width <= 0) return undefined;
    const { thickness, gap, stop, wavy } = this.options;
    const height = wavy ? thickness + 6 : thickness;
    const centerY = height / 2;
    const cap = thickness / 2;
    const fractions = this.fractions();
    const amplitude = this.amplitude.value;
    const wavelength = this.wavelength();
    const crest = ((height - thickness) / 2) * amplitude;
    const shift = amplitude > 0 ? this.waveOffset * wavelength : 0;

    const lines = ["", ""];
    let adjustedGap = gap;
    let activeVisible = false;
    let nextEndTrack = width - cap;
    let track = `M${round(nextEndTrack)} ${centerY}`;

    for (let i = 0; i < 2; i++) {
      const start = fractions[i * 2]!;
      const end = fractions[i * 2 + 1]!;
      const barTail = start * width;
      const barHead = end * width;

      if (i === 0) {
        // Let the very first dot of progress grow in before the gap opens up.
        adjustedGap = barHead < cap ? 0 : Math.min(barHead - cap, gap);
        activeVisible = barHead >= cap;
      }
      const head = clamp(barHead, cap, width - cap);
      const tail = clamp(barTail, cap, width - cap);

      if (Math.abs(end - start) > 0) {
        lines[i] =
          crest > 0
            ? wavePath(tail, head, shift, wavelength, centerY, crest)
            : `M${round(tail)} ${centerY}H${round(head)}`;
      }

      // Track parts are drawn right to left, around each active line.
      const spacing = activeVisible ? adjustedGap + cap * 2 : adjustedGap;
      if (nextEndTrack > head + spacing) {
        track += `H${round(Math.max(cap, head + spacing))}`;
      }
      if (barHead > barTail) {
        nextEndTrack = Math.max(cap, tail - spacing);
        track += `M${round(nextEndTrack)} ${centerY}`;
      }
    }
    if (nextEndTrack > cap) track += `H${round(cap)}`;

    return {
      track,
      first: lines[0]!,
      second: lines[1]!,
      ...this.stopIndicator(fractions[1]!, stop, height),
    };
  }

  /** The stop dot holds its size, then is eaten by the arriving bar. */
  private stopIndicator(progressEnd: number, stop: boolean, height: number) {
    const { thickness } = this.options;
    const hidden = { stopX: 0, stopY: 0, stopRadius: 0 };
    if (this.indeterminate || !stop) return hidden;

    let size = Math.min(thickness, 4 * this.handoff.value);
    const offset = size === thickness ? 0 : thickness / 4;
    let x = this.width - size - offset;
    const progressX = this.width * progressEnd + thickness / 2;
    if (x <= progressX) {
      size = Math.max(0, size - (progressX - x));
      x = progressX;
    }
    return { stopX: x + size / 2, stopY: height / 2, stopRadius: size / 2 };
  }
}
