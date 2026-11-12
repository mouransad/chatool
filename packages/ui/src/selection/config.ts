/*
 * Shared configuration for the `@chatool/ui` **selection** family — MD3's
 * "selection" components (checkbox, radio and switch). One place for
 * the Expressive motion and the shared state-layer / focus wiring so siblings
 * move and respond exactly alike.
 *
 * Tailwind only generates classes it can see as **complete literals**, so every
 * fragment below is spelled out in full (compose whole classes, never a
 * variant prefix + a utility).
 */

/**
 * M3 **Expressive** motion, as CSS `linear()` easings sampled from the real
 * springs in Compose's `ExpressiveMotionTokens` (the scheme
 * `MaterialExpressiveTheme` uses; mass 1, solved analytically, sampled to a
 * 0.2% settle threshold):
 *
 * - `--_spatial` — **default spatial**, `spring(dampingRatio = 0.8, stiffness =
 *   380)`, 412ms, ~1.5% overshoot. For geometry: the checkmark drawing itself
 *   and the check ⇄ indeterminate morph (Compose's `checkDrawFraction` +
 *   `checkCenterGravitationShiftFraction`).
 * - `--_fx` — **default effects**, `spring(1, 1600)`, 212ms, no overshoot. For
 *   colors when a control turns **on** (Compose's "box in").
 * - `--_fx-fast` — **fast effects**, `spring(1, 3800)`, 137ms. For colors when
 *   a control turns **off** ("box out") and for state-layer feedback.
 */
export const MOTION =
  "[--_spatial:var(--md-comp-selection-spatial-easing,linear(0,0.031,0.107,0.209,0.32,0.433,0.538,0.634,0.718,0.789,0.847,0.894,0.931,0.959,0.979,0.994,1.004,1.01,1.013,1.015,1.015,1.014,1.013,1.011,1.01,1.008,1.006,1.005,1.004,1.003,1))] [--_fx:var(--md-comp-selection-effects-easing,linear(0,0.081,0.242,0.412,0.561,0.681,0.772,0.84,0.889,0.924,0.948,0.965,0.976,0.984,0.989,0.993,0.995,0.997,1))] [--_fx-fast:var(--md-comp-selection-fast-effects-easing,linear(0,0.099,0.285,0.47,0.623,0.74,0.824,0.883,0.923,0.95,0.968,0.98,0.987,0.992,0.995,0.997,1))]";

/**
 * M3 **Expressive fast spatial** spring — `spring(dampingRatio = 0.6,
 * stiffness = 800)`, 348ms to settle, **~9.5% overshoot** — as `--_spatial-fast`.
 * Compose's `RadioButton` animates its dot radius on this spring
 * (`MotionSchemeKeyTokens.FastSpatial`), which is where the radio's springy
 * "pop" comes from; Compose's `Switch` moves and resizes its thumb on it too. Kept separate from `MOTION` so siblings that don't use it
 * (checkbox) don't carry the extra custom property.
 */
export const FAST_SPATIAL =
  "[--_spatial-fast:var(--md-comp-selection-fast-spatial-easing,linear(0,0.027,0.098,0.198,0.315,0.437,0.557,0.67,0.771,0.858,0.931,0.988,1.031,1.062,1.082,1.092,1.095,1.092,1.085,1.076,1.064,1.053,1.042,1.031,1.021,1.013,1.006,1.001,0.997,0.994,0.992,0.991,0.991,0.991,0.992,0.993,0.994,0.995,0.996,0.997,1))]";

/**
 * Shared **state layer** wiring for a control whose native `<input>` is the
 * host's direct child. The opacity is resolved through a priority chain of
 * locals — disabled (`--_sl-off`) › pressed › focused › hovered › none — so
 * overlapping states never depend on stylesheet order: each condition only
 * *sets its own* local and the chain picks the strongest.
 *
 * Hover also comes from the surrounding label row (`group/selection-field`),
 * so pointing at a checkbox's text previews its state layer, as on Android.
 * Tailwind's `hover:` only matches on devices that can hover, so touch never
 * leaves a stuck highlight.
 */
export const STATE =
  "[--_sl:var(--_sl-off,var(--_sl-press,var(--_sl-focus,var(--_sl-hover,0%))))] hover:[--_sl-hover:calc(var(--md-sys-state-hover-opacity,0.08)*100%)] group-hover/selection-field:[--_sl-hover:calc(var(--md-sys-state-hover-opacity,0.08)*100%)] has-focus-visible:[--_sl-focus:calc(var(--md-sys-state-focus-opacity,0.1)*100%)] active:[--_sl-press:calc(var(--md-sys-state-pressed-opacity,0.1)*100%)] group-active/selection-field:[--_sl-press:calc(var(--md-sys-state-pressed-opacity,0.1)*100%)]";

/**
 * The state layer + focus indicator, painted by the host's `::before`: a
 * `--md-comp-<control>-state-layer-size` disc (40dp) centred in the 48dp touch
 * target. Its tint is `color-mix(--_state, --_sl)` rather than `opacity`, so
 * the MD3 focus indicator (3dp `secondary` outline, 2dp outside the layer) can
 * share the pseudo-element at full strength.
 */
export const STATE_LAYER =
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:m-auto before:size-[var(--_sls)] before:rounded-full before:bg-[color-mix(in_srgb,var(--_state)_var(--_sl),transparent)] before:outline-0 before:outline-offset-2 before:outline-[color:var(--_focus)] before:outline-solid before:content-[''] before:[transition:background-color_137ms_var(--_fx-fast)] has-focus-visible:before:outline-3 forced-colors:[--_focus:Highlight]";
