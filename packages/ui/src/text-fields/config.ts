/*
 * Shared configuration for the `@chatool/ui` **text-field** family: MD3's text
 * input components (the text field today; search / select-style fields later).
 * One place for the Expressive motion and the root-state selectors, so future
 * siblings move and react exactly like the text field.
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full (compose whole classes, never a variant
 * prefix + a utility). In arbitrary values always write math operators as
 * `_+_` / `_-_` / `_*_`: Tailwind's normalizer rewrites a bare `+var(--_x)` or
 * `*var(--_x)` as `var(-- x)`.
 */

/**
 * M3 **Expressive** motion as CSS `linear()` easings, sampled from the real
 * springs in Compose's `ExpressiveMotionTokens` (mass 1, solved analytically,
 * sampled to a 0.2% settle threshold — the same sampler as the selection
 * family). Compose's text field (`TextFieldImpl.kt`) drives:
 *
 * - `--_spring` — **fast spatial**, `spring(0.6, 800)`, 348ms, ~9.5% overshoot:
 *   the label's `labelProgress` (position **and** body-large → body-small text
 *   style, which Compose lerps), the indicator / outline thickness
 *   (`borderSpec(fastSpatialSpec)`) and, by extension, the outline notch.
 * - `--_fade` — **fast effects**, `spring(1, 3800)`, 137ms: every color
 *   (container, indicator, label, icons), the prefix / suffix fade and the
 *   placeholder fading out.
 * - `--_fade-slow` — **slow effects**, `spring(1, 800)`, 299ms: the placeholder
 *   fading **in** when an empty field gains focus (Compose's
 *   `placeholderOpacity`).
 *
 * `--_still` (disabled) freezes everything: Compose snaps instead of animating
 * a disabled field. Reduced motion keeps the color fades but drops the spatial
 * movement (`--_reduced`).
 */
export const MOTION =
  "[--_spring:var(--md-comp-text-field-spatial-easing,linear(0,0.027,0.098,0.198,0.314,0.437,0.557,0.67,0.771,0.858,0.93,0.988,1.031,1.062,1.081,1.092,1.095,1.092,1.085,1.076,1.065,1.053,1.042,1.031,1.021,1.013,1.006,1.001,0.997,0.994,0.992,0.991,0.991,0.991,0.992,0.993,0.994,0.995,0.996,0.997,1))] [--_fade:var(--md-comp-text-field-effects-easing,linear(0,0.099,0.285,0.47,0.624,0.741,0.825,0.884,0.924,0.951,0.968,0.98,0.987,0.992,0.995,0.997,1))] [--_fade-slow:var(--md-comp-text-field-slow-effects-easing,linear(0,0.068,0.208,0.362,0.504,0.624,0.72,0.795,0.851,0.893,0.924,0.946,0.962,0.973,0.981,0.987,0.991,0.994,0.996,0.997,1))] [--_sd:var(--_still,var(--_reduced,var(--md-comp-text-field-spatial-duration,348ms)))] [--_fd:var(--_still,var(--md-comp-text-field-effects-duration,137ms))] [--_fsd:var(--_still,var(--md-comp-text-field-slow-effects-duration,299ms))] motion-reduce:[--_reduced:0s]";

/**
 * Input types whose UA rendering is never "empty" (a date / time field always
 * shows its `mm/dd/yyyy`-style template), so the label must stay floated or it
 * would sit on top of that template.
 */
export const ALWAYS_FLOAT_TYPES = new Set([
  "date",
  "datetime-local",
  "month",
  "time",
  "week",
  "color",
  "file",
]);
