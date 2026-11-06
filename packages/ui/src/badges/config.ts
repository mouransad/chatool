/*
 * Shared configuration for the `@chatool/ui` badge family — the Material 3 badge
 * measurements, anchor offsets and Expressive motion, kept in one file so future
 * siblings (e.g. a navigation-item badge slot) draw and place the **exact same**
 * badge.
 *
 * Material Design 3 badge spec (m3.material.io/components/badges/specs, Material
 * Web tokens v34, Compose `BadgeTokens` / `BadgedBox`):
 *
 * - **Small badge:** a `6dp` dot, `3dp` corner radius. Signals "something new".
 * - **Large badge:** `16dp` tall, `16dp` min-width (a circle at one digit),
 *   `8dp` corner radius, `4dp` horizontal padding, `label-small` type; grows to
 *   `16×34dp` at the 4-character maximum (`999+`).
 * - **Color:** `error` container + `on-error` label (custom roles need ≥ 3:1).
 * - **Placement:** anchored **inside the icon's bounding box** at the upper
 *   trailing corner. The distance from the icon's top-trailing corner to the
 *   badge's bottom-leading corner is `6×6dp` (small) and `14×12dp` (H×W, large).
 *   The leading edge is fixed, so a growing count expands **toward the trailing
 *   side** and keeps its placement. RTL mirrors it.
 *
 * Every value reads a `--md-comp-badge-*` token first and falls back to the spec
 * value (in `rem`, so badges scale with the user's font size like the rest of the
 * library). Tailwind only generates classes it can see as **complete literals**,
 * so the fragments below are spelled out in full.
 */

/** MD3 badge variants: the `small` dot or the `large` labelled pill. */
export type BadgeSize = "small" | "large";

/**
 * Per-size geometry, as local custom properties the base classes read:
 * `--_h` height (= min-width), `--_r` corner radius, `--_px` inline padding,
 * `--_ox` / `--_oy` the anchor offsets (badge leading edge from the anchor's
 * trailing edge / badge bottom from the anchor's top). Switching size swaps the
 * locals, so the dot ⇄ pill change **morphs** every property in one spring.
 */
export const SIZE: Record<BadgeSize, string> = {
  small:
    "[--_h:var(--md-comp-badge-small-size,0.375rem)] [--_r:var(--md-comp-badge-small-shape,0.1875rem)] [--_px:0rem] [--_ox:var(--md-comp-badge-small-offset-x,0.375rem)] [--_oy:var(--md-comp-badge-small-offset-y,0.375rem)]",
  large:
    "[--_h:var(--md-comp-badge-large-size,1rem)] [--_r:var(--md-comp-badge-large-shape,0.5rem)] [--_px:var(--md-comp-badge-large-padding,0.25rem)] [--_ox:var(--md-comp-badge-large-offset-x,0.75rem)] [--_oy:var(--md-comp-badge-large-offset-y,0.875rem)]",
};

/**
 * M3 **Expressive** motion, expressed as CSS `linear()` easings sampled from the
 * real spring physics in Compose's `ExpressiveMotionTokens` (mass 1, solved
 * analytically, sampled to a 0.2% settle threshold):
 *
 * - **Fast spatial** — `spring(dampingRatio = 0.6, stiffness = 800)`, 350ms,
 *   ~9.5% overshoot. For anything that changes the badge's **shape or bounds**
 *   (scale-in, dot ⇄ pill morph, width growth, digit pop).
 * - **Fast effects** — `spring(dampingRatio = 1, stiffness = 3800)`, 140ms, no
 *   overshoot. For properties that must not bounce (opacity, color).
 *
 * Both are overridable (`--md-comp-badge-spatial-easing` / `-spatial-duration`,
 * `--md-comp-badge-effects-easing` / `-effects-duration`), e.g. set the durations
 * to `0s` to switch motion off for one badge or the whole app.
 */
export const MOTION =
  "[--_spatial:var(--md-comp-badge-spatial-easing,linear(0,0.054,0.185,0.352,0.527,0.69,0.827,0.934,1.011,1.06,1.086,1.095,1.091,1.079,1.063,1.047,1.031,1.018,1.007,1,0.995,0.992,0.991,0.991,0.992,0.994,0.995,0.997,1))] [--_sd:var(--md-comp-badge-spatial-duration,350ms)] [--_effects:var(--md-comp-badge-effects-easing,linear(0,0.102,0.293,0.481,0.635,0.751,0.833,0.891,0.929,0.954,0.971,0.982,0.988,0.993,0.996,0.997,1))] [--_ed:var(--md-comp-badge-effects-duration,140ms)]";

/**
 * The badge's resting transition: spatial properties ride the spring, effects
 * ride the critically-damped curve. Under `prefers-reduced-motion` only the
 * opacity/color crossfade survives — no scaling, no bounce.
 */
export const TRANSITION =
  "[transition:height_var(--_sd)_var(--_spatial),min-width_var(--_sd)_var(--_spatial),padding_var(--_sd)_var(--_spatial),border-radius_var(--_sd)_var(--_spatial),top_var(--_sd)_var(--_spatial),inset-inline-start_var(--_sd)_var(--_spatial),inset-inline-end_var(--_sd)_var(--_spatial),scale_var(--_sd)_var(--_spatial),opacity_var(--_ed)_var(--_effects),background-color_var(--_ed)_var(--_effects),color_var(--_ed)_var(--_effects)] motion-reduce:[transition:opacity_var(--_ed)_var(--_effects),background-color_var(--_ed)_var(--_effects),color_var(--_ed)_var(--_effects)]";

/**
 * Leaving: a quick MD3 `emphasized-accelerate` shrink + fade (exits get out of
 * the way; only entrances bounce). CSS uses the transition declared on the
 * **destination** state, so this only governs the visible → hidden direction.
 */
export const EXIT =
  "pointer-events-none scale-0 opacity-0 [transition:scale_var(--md-sys-motion-duration-short3,150ms)_var(--md-sys-motion-easing-emphasized-accelerate,cubic-bezier(0.3,0,0.8,0.15)),opacity_var(--md-sys-motion-duration-short3,150ms)_var(--md-sys-motion-easing-emphasized-accelerate,cubic-bezier(0.3,0,0.8,0.15))]";

/**
 * Entrance: on first render (and every time it's re-inserted) the badge springs
 * up from nothing via `@starting-style` — pure CSS, so it works in a Server
 * Component. Browsers without `@starting-style` simply show the badge.
 */
export const ENTER = "starting:scale-0 starting:opacity-0";

/**
 * The visible label. Keyed by its text in the view, so a **changed count
 * remounts** it and re-plays this pop (scale 50% → spring overshoot → 100%) —
 * a count that ticks up visibly "lands", with no JS and no state.
 */
export const LABEL =
  "inline-block [transition:scale_var(--_sd)_var(--_spatial),opacity_var(--_ed)_var(--_effects)] starting:scale-50 starting:opacity-0 motion-reduce:[transition:opacity_var(--_ed)_var(--_effects)] motion-reduce:starting:scale-100";

/**
 * Windows High Contrast / `forced-colors: active` would erase the badge's
 * background (and with it the whole dot). Opt out of the forced palette and
 * paint it with the system's maximum-contrast pair instead.
 */
export const FORCED_COLORS =
  "forced-colors:forced-color-adjust-none forced-colors:bg-[color:CanvasText] forced-colors:text-[color:Canvas]";
