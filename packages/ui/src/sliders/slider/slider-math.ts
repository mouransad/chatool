/*
 * Pure slider math — no React, no DOM, no directive. Value snapping and
 * stepping, number formatting, and the track layout (where each track
 * segment, stop and icon sits), shared by the view and `useLogic`.
 *
 * Layout mirrors Compose `SliderDefaults.drawTrack` / `SliderImpl`:
 *
 * - The track is inset by half a handle width at each end, so the handle's
 *   centre can reach both ends.
 * - The handle centre sits at `f · T` along a track of length `T`. With stop
 *   indicators shown, a value *between* the ends sits at `r + f · (T − 2r)`
 *   (`r` = the track corner), lining the handle up with the stop dots, which
 *   are inset by the corner so they sit centred in the rounded caps.
 * - Each segment ends `--_g` (half the handle + the 6dp gap) short of a
 *   handle; a centered slider also leaves a 6dp gap at the centre.
 * - A segment shorter than its outer corner is dropped (Compose's
 *   `rangeInactiveTrackThreshold` / `activeTrackThreshold`), so the track
 *   never shows a hairline sliver.
 */

/** The value domain. `step: "any"` is continuous. */
export interface SliderScale {
  min: number;
  max: number;
  step: number | "any";
  /** Explicit allowed values (custom stops); overrides `step` when set. */
  allowed?: readonly number[];
}

export type SliderMode = "standard" | "centered" | "range";

/** Value-indicator / `aria-valuetext` formatting. */
export type SliderFormat =
  | Intl.NumberFormatOptions
  | ((value: number) => string);

const clamp = (value: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, value));

/** Decimal places in a number (`0.25` → 2, `1e-3` → 3). */
export const decimals = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  const text = String(value);
  const exp = /e-(\d+)$/.exec(text);
  if (exp) return Number(exp[1]);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
};

/** Rounds away float noise (`0.1 + 0.2` → `0.3`) at the step's precision. */
const tidy = (value: number, scale: SliderScale) => {
  const places = Math.max(
    decimals(scale.min),
    typeof scale.step === "number" ? decimals(scale.step) : 0,
  );
  return Number(value.toFixed(Math.min(20, places)));
};

/** Sorted, de-duplicated custom stops inside `[min, max]`. */
export const normalizeAllowed = (
  stops: readonly number[],
  min: number,
  max: number,
) =>
  [...new Set(stops)]
    .filter((v) => Number.isFinite(v) && v >= min && v <= max)
    .sort((a, b) => a - b);

/** Snaps a value onto the scale, kept inside `[lo, hi]` (defaults: min/max). */
export const snap = (
  value: number,
  scale: SliderScale,
  lo = scale.min,
  hi = scale.max,
): number => {
  if (!Number.isFinite(value)) return lo;
  const bounded = clamp(value, lo, hi);
  if (scale.allowed?.length) {
    let best: number | undefined;
    for (const candidate of scale.allowed) {
      if (candidate < lo || candidate > hi) continue;
      if (
        best === undefined ||
        Math.abs(candidate - bounded) < Math.abs(best - bounded)
      )
        best = candidate;
    }
    return best ?? bounded;
  }
  if (scale.step === "any" || !(scale.step > 0)) return bounded;
  const { step } = scale;
  const snapped = scale.min + Math.round((bounded - scale.min) / step) * step;
  // Rounding may land just outside [lo, hi]; step back inside.
  const inside =
    snapped > hi ? snapped - step : snapped < lo ? snapped + step : snapped;
  return tidy(clamp(inside, lo, hi), scale);
};

/** The arrow-key increment: the step, or 1% of the range when continuous. */
export const keyStep = (scale: SliderScale) =>
  scale.step === "any" || !(scale.step > 0)
    ? (scale.max - scale.min) / 100
    : scale.step;

/**
 * The Page Up / Page Down / Shift+Arrow increment: ~10% of the range, rounded
 * to a whole number of steps (at least one) — the WAI-ARIA APG "larger
 * increment".
 */
export const defaultLargeStep = (scale: SliderScale) => {
  const base = keyStep(scale);
  const tenth = (scale.max - scale.min) / 10;
  if (scale.step === "any") return tenth;
  return Math.max(base, Math.round(tenth / base) * base);
};

/**
 * Moves `value` by `count` increments of `amount`; with custom stops it moves
 * `count` stops instead. Stays inside `[lo, hi]`.
 */
export const stepBy = (
  value: number,
  count: number,
  amount: number,
  scale: SliderScale,
  lo = scale.min,
  hi = scale.max,
) => {
  if (scale.allowed?.length) {
    const inside = scale.allowed.filter((v) => v >= lo && v <= hi);
    if (!inside.length) return value;
    let index = inside.findIndex((v) => v >= value);
    if (index === -1) index = inside.length - 1;
    // Exactly on a stop moves from it; between stops, the first move lands on
    // the neighbour in that direction.
    const onStop = inside[index] === value;
    const from = onStop || count > 0 ? index : index - 1;
    const steps = onStop || count < 0 ? count : count - 1;
    return inside[clamp(from + steps, 0, inside.length - 1)] ?? value;
  }
  return snap(value + count * amount, scale, lo, hi);
};

/** `value` → 0…1 along the scale. */
export const toFraction = (value: number, scale: SliderScale) =>
  scale.max === scale.min
    ? 0
    : clamp((value - scale.min) / (scale.max - scale.min), 0, 1);

/** 0…1 → a value (unsnapped). */
export const fromFraction = (fraction: number, scale: SliderScale) =>
  scale.min + clamp(fraction, 0, 1) * (scale.max - scale.min);

/** The values a stop indicator is drawn at (empty when stops are off). */
export const stopValues = (
  scale: SliderScale,
  stops: boolean,
  limit = 1000,
): number[] => {
  if (scale.allowed?.length) return [...scale.allowed];
  if (!stops || scale.step === "any" || !(scale.step > 0)) return [];
  const count = Math.floor((scale.max - scale.min) / scale.step + 1e-9) + 1;
  if (count < 2 || count > limit) return [];
  return Array.from({ length: count }, (_, i) =>
    tidy(scale.min + i * (scale.step as number), scale),
  );
};

/** Builds the formatter for the value indicator and `aria-valuetext`. */
export const createFormatter = (
  format: SliderFormat | undefined,
  locale: string | undefined,
  scale: SliderScale,
): ((value: number) => string) => {
  if (typeof format === "function") return format;
  const places =
    scale.step === "any"
      ? 2
      : Math.max(
          decimals(scale.min),
          typeof scale.step === "number" ? decimals(scale.step) : 0,
          ...(scale.allowed ?? []).map(decimals),
        );
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.min(20, places),
    ...format,
  });
  return (value) => formatter.format(value);
};

/* ------------------------------------------------------------------ layout */

/** Measured geometry in px (all `NaN` until the track has been measured). */
export interface SliderMeasure {
  /** Track length `T` along the slider's axis. */
  length: number;
  /** Track corner `r`. */
  corner: number;
  /** Inside corner (2dp). */
  insideCorner: number;
  /** Handle half-width + gap (`--_g`). */
  edge: number;
  /** The bare handle–track gap (6dp), used at a centered slider's centre. */
  gap: number;
  /** An inset icon's box along the axis (icon + 2 × padding). */
  iconBox: number;
}

export const UNMEASURED: SliderMeasure = {
  length: Number.NaN,
  corner: Number.NaN,
  insideCorner: Number.NaN,
  edge: Number.NaN,
  gap: Number.NaN,
  iconBox: Number.NaN,
};

/** A point on the track: a CSS length (for `calc()`) + its px value. */
interface Point {
  css: string;
  px: number;
}

export interface SliderSegment {
  kind: "active" | "inactive";
  /** Which corners are the track's outer (`r`) corners. */
  outer: "start" | "end" | "none";
  start: string;
  end: string;
  /** Too short to draw (Compose's threshold); hidden. */
  hidden: boolean;
  /** Length in px (`NaN` when unmeasured). */
  length: number;
}

export interface SliderLayout {
  /** `true` → the inset (stop-aligned) placement for that handle. */
  inset: boolean[];
  /** Handle centres in px (`NaN` when unmeasured). */
  centers: number[];
  segments: SliderSegment[];
}

/** Handle centre in px (`k` = 1 for the stop-aligned placement). */
const centerPx = (f: number, k: number, m: SliderMeasure) =>
  k * m.corner + f * (m.length - 2 * k * m.corner);

export const computeLayout = (
  mode: SliderMode,
  fractions: readonly number[],
  stopsShown: boolean,
  m: SliderMeasure,
): SliderLayout => {
  const inset = fractions.map((f) => stopsShown && f > 0 && f < 1);
  const centers = fractions.map((f, i) => centerPx(f, inset[i] ? 1 : 0, m));

  const handle = (i: number, side: -1 | 1): Point => ({
    css: `calc(var(--_c${i}) ${side < 0 ? "-" : "+"} var(--_g))`,
    px: (centers[i] ?? 0) + side * m.edge,
  });
  const trackStart: Point = { css: "0px", px: 0 };
  const trackEnd: Point = { css: "100%", px: m.length };
  const middle = (side: -1 | 0 | 1): Point => ({
    css: side === 0 ? "50%" : `calc(50% ${side < 0 ? "-" : "+"} var(--_gap))`,
    px: m.length / 2 + side * m.gap,
  });

  const make = (
    kind: SliderSegment["kind"],
    outer: SliderSegment["outer"],
    a: Point,
    b: Point,
  ): SliderSegment => {
    const length = b.px - a.px;
    const threshold = outer === "none" ? m.insideCorner : m.corner;
    return {
      kind,
      outer,
      start: a.css,
      end: b.css,
      length,
      // Unmeasured (SSR / first paint): let CSS clamp the size at 0 instead.
      hidden: Number.isFinite(length) ? length <= threshold : false,
    };
  };

  const segments: SliderSegment[] = [];
  if (mode === "range") {
    segments.push(
      make("inactive", "start", trackStart, handle(0, -1)),
      make("active", "none", handle(0, 1), handle(1, -1)),
      make("inactive", "end", handle(1, 1), trackEnd),
    );
  } else if (mode === "centered") {
    const f = fractions[0] ?? 0.5;
    if (f > 0.5) {
      segments.push(
        make("inactive", "start", trackStart, middle(-1)),
        make("active", "none", middle(0), handle(0, -1)),
        make("inactive", "end", handle(0, 1), trackEnd),
      );
    } else if (f < 0.5) {
      segments.push(
        make("inactive", "start", trackStart, handle(0, -1)),
        make("active", "none", handle(0, 1), middle(0)),
        make("inactive", "end", middle(1), trackEnd),
      );
    } else {
      segments.push(
        make("inactive", "start", trackStart, handle(0, -1)),
        make("inactive", "end", handle(0, 1), trackEnd),
      );
    }
  } else {
    segments.push(
      make("active", "start", trackStart, handle(0, -1)),
      make("inactive", "end", handle(0, 1), trackEnd),
    );
  }
  return { inset, centers, segments };
};

/** A stop dot's centre in px (stops are always inset by the corner). */
export const stopPx = (f: number, m: SliderMeasure) => centerPx(f, 1, m);
