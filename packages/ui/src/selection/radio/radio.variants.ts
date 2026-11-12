import { cva } from "class-variance-authority";

import { FAST_SPATIAL, MOTION, STATE, STATE_LAYER } from "../config";

/*
 * Material Design 3 **radio button** (m3.material.io/components/radio-button),
 * ported from the MD3 token set (Compose `RadioButtonTokens` / Material Web
 * `md-comp-radio-button`) with the **Expressive** motion of Compose's
 * `RadioButton`:
 *
 * - **Geometry.** A 20dp icon: a ring stroked 2dp at radius 9 and a 10dp dot,
 *   exactly Compose's `drawCircle` calls. A 40dp circular state layer and a
 *   48dp touch target (the native `<input>` itself covers it). Sizes are `rem`,
 *   so the control scales with the user's font size.
 * - **Color.** Unselected: `on-surface-variant` (`on-surface` on hover, focus
 *   and press). Selected: `primary` for ring and dot in every state. Disabled:
 *   `on-surface` at 38%. MD3 defines no error state for radios; this one adds
 *   `error` (same shape as the checkbox's) for form validation.
 * - **State layer.** Unselected: `on-surface` (hover/focus), `primary` while
 *   pressed. Selected: `primary` (hover/focus), `on-surface` while pressed — the
 *   pressed color previews the state you're about to land in.
 *
 * **Expressive motion** (Compose: dot radius on `FastSpatial`, color on
 * `DefaultEffects`, nothing animates while disabled):
 *
 * - **Select** — the dot springs open on the Expressive fast-spatial spring
 *   (damping 0.6, stiffness 800): it overshoots ~9.5%, then settles. 348ms.
 * - **Deselect** — the same spring, cut at its first zero-crossing (98ms). In
 *   Compose the undershoot is invisible because a dot radius ≤ 0 isn't drawn; a
 *   CSS `scale()` below 0 would flash a mirrored dot, so the curve is clamped
 *   there — same look, frame for frame.
 * - **Color** — ring and dot fade on the default-effects spring (212ms).
 *
 * **Everything is CSS-driven from the native input** (`:checked`,
 * `:disabled`, `[aria-invalid]`, `:user-invalid`, `:focus-visible`), so a
 * radio works and animates before hydration, a `<fieldset disabled>` disables
 * it visually, and when the browser moves the selection with the arrow keys
 * both the old dot (out) and the new one (in) animate on their own.
 *
 * **Priority chains, not cascade order.** Each painted role resolves through a
 * chain of locals, e.g. `--_icon` = forced-colors › disabled › error ›
 * selected › interacting › rest. Every condition only *sets its own* local, so
 * overlapping states resolve the same way however Tailwind orders the rules.
 *
 * **Group inheritance.** `RadioGroup` sets `--_rg-accent` (its `color`) and
 * `--_rg-lp` (its `labelPosition`) on the fieldset; a radio's own `color` /
 * `labelPosition` win, the group's are inherited fallbacks. Group error comes
 * from `[data-slot=radio-group][aria-invalid=true]` above the radio.
 */

/** The control: 48dp touch target, owns every local the parts read. */
export const radioVariants = cva(
  [
    // Layout: the control's box is the touch target; the 20dp icon sits
    // centred inside it, the 40dp state layer around the icon.
    "relative isolate inline-flex size-[var(--md-comp-radio-touch-target-size,3rem)] shrink-0 cursor-pointer items-center justify-center align-middle [-webkit-tap-highlight-color:transparent] forced-colors:forced-color-adjust-none",
    "[--_focus:var(--md-comp-radio-focus-indicator-color,var(--md-sys-color-secondary))] [--_sls:var(--md-comp-radio-state-layer-size,2.5rem)]",
    MOTION,
    FAST_SPATIAL,
    STATE,
    STATE_LAYER,
    // Accent: token › the radio's own `color` › the group's `color` › primary.
    "[--_accent:var(--md-comp-radio-selected-icon-color,var(--_accent-own,var(--_rg-accent,var(--md-sys-color-primary))))]",
    // Timing. `--_still` (disabled) freezes everything — MD3 never animates
    // into or out of disabled. Reduced motion keeps the color fade but snaps
    // the dot. Resting values are the *deselect* (exit) timing.
    "[--_dd:var(--_still,var(--_reduced,var(--md-comp-radio-dot-exit-duration,98ms)))] [--_de:var(--md-comp-radio-dot-exit-easing,linear(0,0.024,0.088,0.178,0.285,0.398,0.513,0.622,0.722,0.811,0.887,0.95,1))] [--_ed:var(--_still,var(--md-comp-radio-effects-duration,212ms))] motion-reduce:[--_reduced:0s]",
    // The icon color chain (see the file comment).
    "[--_icon:var(--_fc-icon,var(--_icon-dis,var(--_icon-err,var(--_icon-sel,var(--_icon-hover,var(--md-comp-radio-icon-color,var(--md-sys-color-on-surface-variant)))))))]",
    "group-hover/selection-field:[--_icon-hover:var(--md-comp-radio-hover-icon-color,var(--md-sys-color-on-surface))] group-active/selection-field:[--_icon-hover:var(--md-comp-radio-hover-icon-color,var(--md-sys-color-on-surface))] hover:[--_icon-hover:var(--md-comp-radio-hover-icon-color,var(--md-sys-color-on-surface))] active:[--_icon-hover:var(--md-comp-radio-hover-icon-color,var(--md-sys-color-on-surface))] has-focus-visible:[--_icon-hover:var(--md-comp-radio-hover-icon-color,var(--md-sys-color-on-surface))]",
    // State-layer colors; pressing swaps them (MD3's "preview the next state").
    "[--_st-sel:var(--_accent)] [--_st-unsel:var(--md-sys-color-on-surface)] group-active/selection-field:[--_st-sel:var(--md-sys-color-on-surface)] group-active/selection-field:[--_st-unsel:var(--_accent)] active:[--_st-sel:var(--md-sys-color-on-surface)] active:[--_st-unsel:var(--_accent)]",
    // Unselected resting values: the dot is collapsed to nothing.
    "[--_dot:0] [--_state:var(--_st-err,var(--_st-unsel))]",
    // Selected: the dot opens on the fast-spatial spring.
    "[&:has(>input:checked)]:[--_dd:var(--_still,var(--_reduced,var(--md-comp-radio-dot-enter-duration,348ms)))] [&:has(>input:checked)]:[--_de:var(--_spatial-fast)] [&:has(>input:checked)]:[--_dot:1] [&:has(>input:checked)]:[--_icon-sel:var(--_accent)] [&:has(>input:checked)]:[--_state:var(--_st-err,var(--_st-sel))]",
    // Error — `error` prop / `aria-invalid`, a `required` group the user left
    // empty (`:user-invalid`), or an invalid `RadioGroup` above it.
    "[&:has(>input:is([aria-invalid=true],:user-invalid))]:[--_icon-err:var(--md-comp-radio-error-color,var(--md-sys-color-error))] [&:has(>input:is([aria-invalid=true],:user-invalid))]:[--_st-err:var(--md-comp-radio-error-color,var(--md-sys-color-error))] [[data-slot=radio-group][aria-invalid=true]_&]:[--_icon-err:var(--md-comp-radio-error-color,var(--md-sys-color-error))] [[data-slot=radio-group][aria-invalid=true]_&]:[--_st-err:var(--md-comp-radio-error-color,var(--md-sys-color-error))]",
    // Disabled (prop, a disabled `RadioGroup`, or any `<fieldset disabled>`).
    "[&:has(>input:disabled)]:cursor-default [&:has(>input:disabled)]:[--_icon-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>input:disabled)]:[--_sl-off:0%] [&:has(>input:disabled)]:[--_still:0s]",
    // Windows High Contrast: paint with system colors instead of losing them.
    "forced-colors:[--_fc-icon:CanvasText] forced-colors:[&:has(>input:disabled)]:[--_fc-icon:GrayText]",
  ],
  {
    variants: {
      /**
       * The selected ring + dot role. MD3 specifies `primary`; the alternatives
       * are fixed MD3 roles. Unset, a radio inherits its `RadioGroup`'s color.
       */
      color: {
        primary: "[--_accent-own:var(--md-sys-color-primary)]",
        secondary: "[--_accent-own:var(--md-sys-color-secondary)]",
        tertiary: "[--_accent-own:var(--md-sys-color-tertiary)]",
      },
    },
  },
);

/**
 * The label row (`<label>`) used when `label` is set: clicking or tapping the
 * text selects the radio (MD3: "either the icon or the label"), hovering or
 * pressing it previews the state layer, and it dims when disabled.
 */
export const radioFieldVariants = cva(
  "group/selection-field inline-flex max-w-full cursor-pointer [flex-direction:var(--_lp,var(--_rg-lp,row))] items-start align-middle select-none [-webkit-tap-highlight-color:transparent] has-disabled:cursor-default",
  {
    variants: {
      /**
       * Which side of the radio the text sits on, in logical terms (RTL-aware).
       * Unset, a radio inherits its `RadioGroup`'s `labelPosition` (else `end`).
       */
      labelPosition: {
        end: "[--_lp:row]",
        start: "[--_lp:row-reverse]",
      },
    },
  },
);

/** The native input: invisible, but it *is* the 48dp hit target and the focus. */
export const INPUT =
  "absolute inset-0 z-[1] m-0 size-full cursor-[inherit] appearance-none rounded-full opacity-0 outline-none";

/** The 20dp icon canvas; ring and dot are drawn in a 20-unit box. */
export const ICON =
  "pointer-events-none relative size-[var(--md-comp-radio-icon-size,1.25rem)] overflow-visible";

/** The outer ring (2dp stroke at r=9, Compose's geometry). */
export const RING =
  "[fill:none] [stroke:var(--_icon)] [transition:stroke_var(--_ed)_var(--_fx)]";

/** The 10dp dot: scales from its own centre, on the dot timing. */
export const DOT =
  "[fill:var(--_icon)] [transform-box:fill-box] [transform-origin:center] [transform:scale(var(--_dot))] [transition:transform_var(--_dd)_var(--_de),fill_var(--_ed)_var(--_fx)]";

/** Where the centred ripple lives: the 40dp state-layer disc. */
export const RIPPLE = "inset-0 m-auto size-[var(--_sls)] rounded-full";

/**
 * The text column. Its block padding centres the first line on the icon
 * ((48dp target − 20dp line) / 2), so multi-line labels and supporting text
 * hang from the first line instead of re-centring the radio.
 */
export const TEXT =
  "flex min-w-0 flex-col py-[calc((var(--md-comp-radio-touch-target-size,3rem)_-_1.25rem)/2)]";

/** The label: MD3 says `on-surface` adjacent text, whatever the state. */
export const LABEL =
  "text-body-medium text-on-surface group-has-disabled/selection-field:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] forced-colors:group-has-disabled/selection-field:text-[color:GrayText]";

/** Supporting text: body-small `on-surface-variant`, `error` when invalid. */
export const SUPPORTING_TEXT =
  "text-body-small text-on-surface-variant group-has-disabled/selection-field:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] group-has-[input:is([aria-invalid=true],:user-invalid):enabled]/selection-field:text-error forced-colors:group-has-disabled/selection-field:text-[color:GrayText]";
