/*
 * Shared configuration for the `@chatool/ui` **slider** family
 * (m3.material.io/components/sliders). One place for the M3 Expressive size
 * scale and motion so every slider variant (standard, centered, range) moves
 * and measures exactly alike.
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full.
 */

/** MD3 Expressive slider sizes (m3.material.io "Measurements" table). */
export type SliderSize = "xs" | "s" | "m" | "l" | "xl";

/**
 * Per-size geometry, straight from the MD3 spec table and MDC-Android's
 * `m3_comp_slider_<size>_*` tokens (`Widget.Material3Expressive.Slider.*`):
 *
 * | Size | Track | Handle height | Track corner | Inset icon |
 * | ---- | ----- | ------------- | ------------ | ---------- |
 * | XS   | 16dp  | 44dp          | 8dp          | —          |
 * | S    | 24dp  | 44dp          | 8dp          | —          |
 * | M    | 40dp  | 52dp          | 12dp         | 24dp       |
 * | L    | 56dp  | 68dp          | 16dp         | 24dp       |
 * | XL   | 96dp  | 108dp         | 28dp         | 32dp       |
 *
 * (MDC-Android's medium token still says a 44dp handle; the spec page says
 * 52dp — we follow the spec.) Each value reads the public
 * `--md-comp-slider-*` token first, so one override resizes every size.
 */
export const SIZES: Record<SliderSize, string> = {
  xs: "[--_th:var(--md-comp-slider-track-height,1rem)] [--_hh:var(--md-comp-slider-handle-height,2.75rem)] [--_r:var(--md-comp-slider-track-corner,0.5rem)] [--_icon:var(--md-comp-slider-icon-size,1.5rem)]",
  s: "[--_th:var(--md-comp-slider-track-height,1.5rem)] [--_hh:var(--md-comp-slider-handle-height,2.75rem)] [--_r:var(--md-comp-slider-track-corner,0.5rem)] [--_icon:var(--md-comp-slider-icon-size,1.5rem)]",
  m: "[--_th:var(--md-comp-slider-track-height,2.5rem)] [--_hh:var(--md-comp-slider-handle-height,3.25rem)] [--_r:var(--md-comp-slider-track-corner,0.75rem)] [--_icon:var(--md-comp-slider-icon-size,1.5rem)]",
  l: "[--_th:var(--md-comp-slider-track-height,3.5rem)] [--_hh:var(--md-comp-slider-handle-height,4.25rem)] [--_r:var(--md-comp-slider-track-corner,1rem)] [--_icon:var(--md-comp-slider-icon-size,1.5rem)]",
  xl: "[--_th:var(--md-comp-slider-track-height,6rem)] [--_hh:var(--md-comp-slider-handle-height,6.75rem)] [--_r:var(--md-comp-slider-track-corner,1.75rem)] [--_icon:var(--md-comp-slider-icon-size,2rem)]",
};

/**
 * Size-independent geometry (Compose `SliderTokens` / MDC `Widget.Material3.Slider`):
 *
 * - `--_hw` handle width **4dp**, `--_hwp` pressed / focused handle width
 *   **2dp** (`PressedHandleWidth`, `FocusHandleWidth`; MDC's
 *   `THUMB_WIDTH_PRESSED_RATIO = .5`).
 * - `--_gap` the **6dp** gap between the handle and each track
 *   (`ActiveHandleLeadingSpace` / `thumbTrackGapSize`), and `--_g`, the
 *   handle's half-width + that gap — where a track segment ends.
 * - `--_ri` the **2dp** inside corner next to the handle (`trackInsideCornerSize`).
 * - `--_stop` the **4dp** stop indicator (`StopIndicatorSize`).
 * - `--_ipad` the **10dp** inset-icon padding (`m3_slider_track_icon_padding`).
 * - `--_vis` the 4dp space between the value indicator and the handle.
 * - `--_tt` the 48dp minimum touch target across the track.
 */
export const GEOMETRY =
  "[--_hw:var(--md-comp-slider-handle-width,0.25rem)] [--_hwp:var(--md-comp-slider-pressed-handle-width,0.125rem)] [--_gap:var(--md-comp-slider-handle-gap,0.375rem)] [--_g:calc(var(--_hw)/2_+_var(--_gap))] [--_ri:var(--md-comp-slider-track-inside-corner,0.125rem)] [--_stop:var(--md-comp-slider-stop-indicator-size,0.25rem)] [--_ipad:var(--md-comp-slider-icon-padding,0.625rem)] [--_vis:var(--md-comp-slider-value-indicator-spacing,0.25rem)] [--_tt:var(--md-comp-slider-touch-target-size,3rem)]";

/**
 * M3 **Expressive** motion as CSS `linear()` easings, sampled analytically from
 * the Compose `ExpressiveMotionTokens` springs (mass 1, 0.2% settle):
 *
 * - `--_spatial` — **default spatial** `spring(0.8, 380)`, 412ms, ~1.5%
 *   overshoot. Moves the handle, tracks, stops and icon when the value
 *   *jumps* (track click, keyboard, a controlled update). Dragging follows the
 *   pointer 1:1 with no transition.
 * - `--_spatial-fast` — **fast spatial** `spring(0.6, 800)`, 348ms, ~9.5%
 *   overshoot. The handle's 4dp ⇄ 2dp press "squeeze" and the value
 *   indicator's pop.
 * - `--_fx` — **default effects** `spring(1, 1600)`, 212ms. Color changes.
 * - `--_fx-fast` — **fast effects** `spring(1, 3800)`, 137ms. Fades (value
 *   indicator out, inset icon hand-off).
 */
export const MOTION =
  "[--_spatial:var(--md-comp-slider-spatial-easing,linear(0,0.025,0.086,0.171,0.267,0.367,0.465,0.556,0.64,0.713,0.777,0.831,0.876,0.912,0.941,0.964,0.981,0.994,1.003,1.009,1.013,1.014,1.015,1.015,1.014,1.013,1.011,1.01,1.008,1.007,1.006,1.005,1.004,1.003,1))] [--_spatial-fast:var(--md-comp-slider-fast-spatial-easing,linear(0,0.05,0.172,0.331,0.499,0.658,0.795,0.906,0.989,1.045,1.078,1.093,1.094,1.086,1.073,1.057,1.041,1.027,1.015,1.005,0.999,0.994,0.992,0.991,0.991,0.992,0.994,0.995,0.997,1))] [--_fx:var(--md-comp-slider-effects-easing,linear(0,0.081,0.242,0.412,0.561,0.681,0.772,0.84,0.889,0.924,0.948,0.965,0.976,0.984,0.989,0.993,0.995,0.997,1))] [--_fx-fast:var(--md-comp-slider-fast-effects-easing,linear(0,0.099,0.285,0.47,0.623,0.74,0.824,0.883,0.923,0.95,0.968,0.98,0.987,0.992,0.995,0.997,1))]";

/**
 * Color roles (m3.material.io "Color" + MDC-Android `m3_comp_slider_*`):
 *
 * | Part                         | Enabled                  | Disabled                     |
 * | ---------------------------- | ------------------------ | ---------------------------- |
 * | Active track                 | `primary`                | `on-surface` 38%             |
 * | Inactive track               | `secondary-container`    | `on-surface` 12%             |
 * | Handle                       | `primary`                | `on-surface` 38% over surface |
 * | Stop on the active track     | `on-primary`             | `inverse-on-surface`         |
 * | Stop on the inactive track   | `on-secondary-container` | `on-surface`                 |
 * | Inset icon (active/inactive) | `on-primary` / `on-secondary-container` | as the stops |
 * | Value indicator              | `inverse-surface` + `inverse-on-surface`, `label-large` | — |
 * | Focus indicator              | `secondary`, 3dp, 2dp offset | — |
 *
 * Each role is a local (`--_active`, `--_inactive`, …) that reads its public
 * `--md-comp-slider-*` token first; the disabled set swaps the locals, and
 * forced-colors mode maps them to system colors.
 */
export const COLORS =
  "[--_active:var(--md-comp-slider-active-track-color,var(--md-sys-color-primary))] [--_inactive:var(--md-comp-slider-inactive-track-color,var(--md-sys-color-secondary-container))] [--_handle:var(--md-comp-slider-handle-color,var(--md-sys-color-primary))] [--_stop-on-active:var(--md-comp-slider-active-stop-indicator-color,var(--md-sys-color-on-primary))] [--_stop-on-inactive:var(--md-comp-slider-inactive-stop-indicator-color,var(--md-sys-color-on-secondary-container))] [--_icon-on-active:var(--md-comp-slider-active-icon-color,var(--md-sys-color-on-primary))] [--_icon-on-inactive:var(--md-comp-slider-inactive-icon-color,var(--md-sys-color-on-secondary-container))] [--_focus:var(--md-comp-slider-focus-indicator-color,var(--md-sys-color-secondary))]";

/**
 * The disabled color set (MDC `m3_slider_*_color` selectors). Applied when the
 * slider is `disabled` **or** any of its inputs matches `:disabled` (so a
 * surrounding `<fieldset disabled>` greys it out too).
 */
export const DISABLED_COLORS =
  "[&:is([data-disabled],:has(input:disabled))]:[--_active:var(--md-comp-slider-disabled-active-track-color,color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent))] [&:is([data-disabled],:has(input:disabled))]:[--_inactive:var(--md-comp-slider-disabled-inactive-track-color,color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,transparent))] [&:is([data-disabled],:has(input:disabled))]:[--_handle:var(--md-comp-slider-disabled-handle-color,color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,var(--md-sys-color-surface)))] [&:is([data-disabled],:has(input:disabled))]:[--_stop-on-active:var(--md-comp-slider-disabled-active-stop-indicator-color,var(--md-sys-color-inverse-on-surface))] [&:is([data-disabled],:has(input:disabled))]:[--_stop-on-inactive:var(--md-comp-slider-disabled-inactive-stop-indicator-color,var(--md-sys-color-on-surface))] [&:is([data-disabled],:has(input:disabled))]:[--_icon-on-active:var(--md-comp-slider-disabled-active-icon-color,var(--md-sys-color-inverse-on-surface))] [&:is([data-disabled],:has(input:disabled))]:[--_icon-on-inactive:var(--md-comp-slider-disabled-inactive-icon-color,color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent))]";

/** Windows High Contrast / forced colors: map every role to a system color. */
export const FORCED_COLORS =
  "forced-colors:forced-color-adjust-none forced-colors:[--_active:Highlight] forced-colors:[--_inactive:GrayText] forced-colors:[--_handle:Highlight] forced-colors:[--_stop-on-active:HighlightText] forced-colors:[--_stop-on-inactive:Canvas] forced-colors:[--_icon-on-active:HighlightText] forced-colors:[--_icon-on-inactive:Canvas] forced-colors:[--_focus:CanvasText]";
