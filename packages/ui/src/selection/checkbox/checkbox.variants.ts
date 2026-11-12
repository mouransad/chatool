import { cva } from "class-variance-authority";

import { MOTION, STATE, STATE_LAYER } from "../config";

/*
 * Material Design 3 **checkbox** (m3.material.io/components/checkbox), ported
 * from the MD3 token set (Compose `CheckboxTokens` v14.1 / Material Web
 * `md-comp-checkbox`) with the **Expressive** motion of Compose's Checkbox:
 *
 * - **Geometry.** An 18dp container with 2dp corners and a 2dp outline, a 40dp
 *   circular state layer, and a 48dp touch target (the native `<input>` itself
 *   covers it). Sizes are `rem`, so the control scales with the user's font size.
 * - **Color.** Unselected: `on-surface-variant` outline (`on-surface` on hover,
 *   focus and press). Selected: `primary` container + `on-primary` check, with
 *   no visible outline. Error: `error` / `on-error`. Disabled: `on-surface` at
 *   38% for the outline/container and an opaque `surface` check.
 * - **State layer.** Unselected: `on-surface` (hover/focus), `primary` while
 *   pressed. Selected: `primary` (hover/focus), `on-surface` while pressed. Error:
 *   `error` throughout. MD3 picks the pressed colors so the ripple previews the
 *   state you're about to land in.
 *
 * **Everything is CSS-driven from the native input** (`:checked`,
 * `:indeterminate`, `:disabled`, `[aria-invalid]`, `:user-invalid`,
 * `:focus-visible`), so an uncontrolled checkbox works — and animates — before
 * hydration and inside a Server Component, and a `<fieldset disabled>` disables
 * it visually too. `data-indeterminate` (from the prop) mirrors `:indeterminate`
 * so the server-rendered first paint is already right.
 *
 * **Priority chains, not cascade order.** Each painted role resolves through a
 * chain of locals, e.g. `--_outline` = forced-colors › disabled › error ›
 * interacting › rest. Every condition only *sets its own* local, so overlapping
 * states (an invalid checkbox you're hovering, a disabled one inside a hovered
 * label) resolve the same way no matter how Tailwind orders the rules.
 *
 * **The checkmark is one stroked path** in an 18-unit box — an "L" whose two
 * legs share a vertex: `M0 -6 V0 H12` (short leg up, long leg right). A group
 * transform (`--_mx`, `--_my`, `--_mr`) rotates it into a check or lays it flat
 * for the dash, and the dash pattern picks the visible stretch: it starts
 * `--_mg` along the path and runs `--_md` long. That gives, with plain,
 * universally-transitionable CSS:
 *
 * - **Draw-in** — `--_md` grows 0 → full: the check is drawn from its short tip,
 *   through the vertex, to its long tip, exactly like Compose's
 *   `checkDrawFraction` (default-spatial spring).
 * - **Check ⇄ indeterminate morph** — the L rotates flat while the short leg
 *   retracts into the vertex (Compose's center-gravitation shift).
 * - **Exit** — colors fade on the fast-effects spring while the mark snaps away
 *   after 100ms (Compose's `snap(delayMillis = 100)`).
 *
 * The check's centerline matches Compose (points 4.5,9 → 7.2,11.7 → 13.5,5.4)
 * and the dash runs 3.5 → 14.5; lengths include its 1-unit square caps.
 */

/** The control: 48dp touch target, owns every local the parts read. */
export const checkboxVariants = cva(
  [
    // Layout. The control's box is the touch target; the 18dp container sits
    // centred inside it, the 40dp state layer around the container.
    "relative isolate inline-flex size-[var(--md-comp-checkbox-touch-target-size,3rem)] shrink-0 cursor-pointer items-center justify-center align-middle [-webkit-tap-highlight-color:transparent] forced-colors:forced-color-adjust-none",
    "[--_focus:var(--md-comp-checkbox-focus-indicator-color,var(--md-sys-color-secondary))] [--_ow:var(--md-comp-checkbox-outline-width,0.125rem)] [--_sls:var(--md-comp-checkbox-state-layer-size,2.5rem)]",
    MOTION,
    STATE,
    STATE_LAYER,
    // Timing. `--_still` (disabled) freezes everything — MD3 never animates
    // into or out of disabled; reduced motion keeps color fades but drops the
    // spatial draw/morph.
    "[--_ed:var(--_still,var(--md-comp-checkbox-exit-effects-duration,137ms))] [--_ee:var(--_fx-fast)] [--_mt:0s_linear_100ms] [--_sd:var(--_still,var(--_reduced,var(--md-comp-checkbox-spatial-duration,412ms)))] motion-reduce:[--_reduced:0s]",
    // Color chains (see the file comment). `--_accent` comes from `color`.
    "[--_outline:var(--_fc-outline,var(--_ol-dis,var(--_ol-err,var(--_ol-hover,var(--md-comp-checkbox-outline-color,var(--md-sys-color-on-surface-variant))))))]",
    "[--_fill:var(--_fc-fill,var(--_fill-dis,var(--_fill-err,var(--md-comp-checkbox-selected-container-color,var(--_accent)))))]",
    "[--_on:var(--_fc-mark,var(--_mark-dis,var(--_mark-err,var(--md-comp-checkbox-selected-icon-color,var(--_on-accent)))))]",
    "[--_st-sel:var(--md-comp-checkbox-selected-container-color,var(--_accent))] [--_st-unsel:var(--md-sys-color-on-surface)] group-active/selection-field:[--_st-sel:var(--md-sys-color-on-surface)] group-active/selection-field:[--_st-unsel:var(--md-comp-checkbox-selected-container-color,var(--_accent))] active:[--_st-sel:var(--md-sys-color-on-surface)] active:[--_st-unsel:var(--md-comp-checkbox-selected-container-color,var(--_accent))]",
    "group-hover/selection-field:[--_ol-hover:var(--md-comp-checkbox-hover-outline-color,var(--md-sys-color-on-surface))] hover:[--_ol-hover:var(--md-comp-checkbox-hover-outline-color,var(--md-sys-color-on-surface))] active:[--_ol-hover:var(--md-comp-checkbox-hover-outline-color,var(--md-sys-color-on-surface))] has-focus-visible:[--_ol-hover:var(--md-comp-checkbox-hover-outline-color,var(--md-sys-color-on-surface))]",
    // Unselected resting values (painted roles + the mark parked as a check
    // with zero length, so checking draws it from the short tip).
    "[--_box-bg:transparent] [--_box-border:var(--_outline)] [--_mark:transparent] [--_md-on:14.728] [--_md:0] [--_mg:1.182] [--_mr:-45deg] [--_mx:7.2px] [--_my:11.7px] [--_state:var(--_st-err,var(--_st-unsel))]",
    // Selected (checked or indeterminate).
    "[&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_box-bg:var(--_fill)] [&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_box-border:var(--_fill)] [&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_ed:var(--_still,var(--md-comp-checkbox-effects-duration,212ms))] [&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_ee:var(--_fx)] [&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_mark:var(--_on)] [&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_md:var(--_md-on)] [&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_mt:var(--_sd)_var(--_spatial)] [&:is([data-indeterminate],:has(>input:checked),:has(>input:indeterminate))]:[--_state:var(--_st-err,var(--_st-sel))]",
    // Indeterminate: the L lies flat, short leg retracted — a centred dash.
    "[&:is([data-indeterminate],:has(>input:indeterminate))]:[--_md-on:11] [&:is([data-indeterminate],:has(>input:indeterminate))]:[--_mg:6] [&:is([data-indeterminate],:has(>input:indeterminate))]:[--_mr:0deg] [&:is([data-indeterminate],:has(>input:indeterminate))]:[--_mx:3.5px] [&:is([data-indeterminate],:has(>input:indeterminate))]:[--_my:9px]",
    // Error — `error` prop / `aria-invalid`, or a `required` box the user left
    // unchecked (`:user-invalid`, only after interaction or a submit attempt).
    "[&:has(>input:is([aria-invalid=true],:user-invalid))]:[--_fill-err:var(--md-comp-checkbox-error-color,var(--md-sys-color-error))] [&:has(>input:is([aria-invalid=true],:user-invalid))]:[--_mark-err:var(--md-comp-checkbox-error-icon-color,var(--md-sys-color-on-error))] [&:has(>input:is([aria-invalid=true],:user-invalid))]:[--_ol-err:var(--md-comp-checkbox-error-color,var(--md-sys-color-error))] [&:has(>input:is([aria-invalid=true],:user-invalid))]:[--_st-err:var(--md-comp-checkbox-error-color,var(--md-sys-color-error))]",
    // Disabled (prop or an ancestor `<fieldset disabled>`).
    "[&:has(>input:disabled)]:cursor-default [&:has(>input:disabled)]:[--_fill-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>input:disabled)]:[--_mark-dis:var(--md-sys-color-surface)] [&:has(>input:disabled)]:[--_ol-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>input:disabled)]:[--_sl-off:0%] [&:has(>input:disabled)]:[--_still:0s]",
    // Windows High Contrast: opt out of the forced palette (it would erase the
    // fill and, with it, the state) and paint with system color pairs.
    "forced-colors:[--_fc-fill:CanvasText] forced-colors:[--_fc-mark:Canvas] forced-colors:[--_fc-outline:CanvasText] forced-colors:[&:has(>input:disabled)]:[--_fc-fill:GrayText] forced-colors:[&:has(>input:disabled)]:[--_fc-outline:GrayText]",
  ],
  {
    variants: {
      /**
       * The selected container + check role pair. MD3 specifies `primary`; the
       * alternatives are fixed, contrast-safe MD3 pairs.
       */
      color: {
        primary:
          "[--_accent:var(--md-sys-color-primary)] [--_on-accent:var(--md-sys-color-on-primary)]",
        secondary:
          "[--_accent:var(--md-sys-color-secondary)] [--_on-accent:var(--md-sys-color-on-secondary)]",
        tertiary:
          "[--_accent:var(--md-sys-color-tertiary)] [--_on-accent:var(--md-sys-color-on-tertiary)]",
      },
    },
    defaultVariants: { color: "primary" },
  },
);

/**
 * The label row (`<label>`) used when `label` is set: the whole row toggles the
 * box, previews its state layer on hover/press, and dims with it when disabled.
 */
export const checkboxFieldVariants = cva(
  "group/selection-field inline-flex max-w-full cursor-pointer items-start align-middle select-none [-webkit-tap-highlight-color:transparent] has-disabled:cursor-default",
  {
    variants: {
      /** Which side of the box the text sits on, in logical terms (RTL-aware). */
      labelPosition: {
        end: "flex-row",
        start: "flex-row-reverse",
      },
    },
    defaultVariants: { labelPosition: "end" },
  },
);

/** The native input: invisible, but it *is* the 48dp hit target and the focus. */
export const INPUT =
  "absolute inset-0 z-[1] m-0 size-full cursor-[inherit] appearance-none rounded-none opacity-0 outline-none";

/**
 * The 18dp container. The outline is a negative-offset `outline` and the fill
 * is clipped to the content box, so they never overlap — a selected, disabled
 * box (38% outline + 38% fill) stays one even tint, as in Compose's `drawBox`.
 */
export const CONTAINER =
  "pointer-events-none relative box-border size-[var(--md-comp-checkbox-container-size,1.125rem)] rounded-[var(--md-comp-checkbox-container-shape,0.125rem)] bg-[var(--_box-bg)] bg-clip-content p-[var(--_ow)] outline-[length:var(--_ow)] -outline-offset-[var(--_ow)] outline-[color:var(--_box-border)] outline-solid [transition:outline-color_var(--_ed)_var(--_ee),background-color_var(--_ed)_var(--_ee)]";

/** The SVG canvas: the full 18-unit container, so the mark scales with it. */
export const ICON = "absolute inset-0 size-full overflow-visible";

/** The checkmark / dash path (see the file comment for the geometry). */
export const MARK =
  "[stroke-dasharray:var(--_md)_40] [stroke-dashoffset:calc(var(--_mg)*-1)] stroke-[color:var(--_mark)] [transform:translate(var(--_mx),var(--_my))_rotate(var(--_mr))] [transform-box:view-box] [transform-origin:0_0] [transition:transform_var(--_mt),stroke-dashoffset_var(--_mt),stroke-dasharray_var(--_mt),stroke_var(--_ed)_var(--_ee)]";

/** Where the centred ripple lives: the 40dp state-layer disc. */
export const RIPPLE = "inset-0 m-auto size-[var(--_sls)] rounded-full";

/**
 * The text column. Its block padding centres the first line on the box (48dp
 * target − 20dp line) / 2, so multi-line labels and supporting text hang from
 * the first line instead of re-centring the box.
 */
export const TEXT =
  "flex min-w-0 flex-col py-[calc((var(--md-comp-checkbox-touch-target-size,3rem)_-_1.25rem)/2)]";

/** The label: MD3 body-medium in `on-surface`, dimmed with the control. */
export const LABEL =
  "text-body-medium text-on-surface group-has-disabled/selection-field:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] forced-colors:group-has-disabled/selection-field:text-[color:GrayText]";

/** Supporting text: body-small `on-surface-variant`, `error` when invalid. */
export const SUPPORTING_TEXT =
  "text-body-small text-on-surface-variant group-has-disabled/selection-field:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] group-has-[input:is([aria-invalid=true],:user-invalid):enabled]/selection-field:text-error forced-colors:group-has-disabled/selection-field:text-[color:GrayText]";
