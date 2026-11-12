import { cva } from "class-variance-authority";

import { FAST_SPATIAL, MOTION, STATE } from "../config";

/*
 * Material Design 3 **switch** (m3.material.io/components/switch), ported from
 * the MD3 token set (Compose `SwitchTokens` v0_210 / Material Web
 * `md-comp-switch` v0_192) with the **Expressive** motion of Compose's
 * `Switch` (`ThumbNode`):
 *
 * - **Geometry.** A 52×32dp track with a 2dp outline and full corners. The
 *   handle is a circle: 16dp unselected, 24dp selected or carrying an icon,
 *   28dp while pressed. A 16dp icon, a 40dp circular state layer that travels
 *   with the handle, and a 48dp touch target (the native `<input>` itself).
 *   Sizes are `rem`, so the control scales with the user's font size.
 * - **The handle's centre only ever sits at one of two points**: `trackHeight
 *   / 2` (off) or `trackWidth − trackHeight / 2` (on). Compose animates the
 *   left edge *and* the size on one spring, which moves the centre linearly
 *   between those points, so animating the centre and the size on the same
 *   spring is frame-for-frame identical. Both come from the track tokens, so a
 *   resized track keeps its handle where it belongs.
 * - **Color.** Unselected: `surface-container-highest` track with an
 *   `outline` border, `outline` handle (`on-surface-variant` on hover, focus
 *   and press), `surface-container-highest` icon. Selected: `primary` track
 *   (no border), `on-primary` handle (`primary-container` on hover, focus and
 *   press), `on-primary-container` icon. Disabled: the track at 12%, the
 *   unselected handle and both icons at 38%, the selected handle an opaque
 *   `surface`. State layer: `on-surface` off, `primary` on.
 * - **Focus.** The MD3 focus indicator — 3dp `secondary`, 2dp outside — hugs
 *   the **track** (Material Web's `md-focus-ring`, Compose's inset ring shape).
 *
 * **Expressive motion** (Compose: thumb size and offset on `FastSpatial`,
 * `SnapSpec` while pressed; nothing animates while disabled):
 *
 * - **Toggle** — the handle slides and resizes on the Expressive fast-spatial
 *   spring (damping 0.6, stiffness 800): ~9.5% overshoot, 348ms.
 * - **Press** — the handle **snaps** to 28dp (Compose's `SnapSpec`), then
 *   springs to its new size and side on release. While dragged it follows the
 *   pointer 1:1.
 * - **Color** — 67ms linear (Material Web's track/handle/icon timing).
 * - **Icons** — fade in 33ms; a lone selected check rotates in from −45° on
 *   the handle's spring (Material Web's "rotate into view").
 * - **Reduced motion** keeps the color fades but snaps the handle.
 *
 * **Everything is CSS-driven from the native input** (`:checked`,
 * `:disabled`, `:focus-visible`, `:active`), so an uncontrolled switch
 * toggles and animates before hydration and inside a Server Component, and a
 * `<fieldset disabled>` disables it visually too. The client island only adds
 * `data-pressed` (touch / keyboard press), `data-dragging` and the inline
 * `--_drag-x` while a drag is in flight.
 *
 * **Priority chains, not cascade order.** Each painted role resolves through a
 * chain of locals, e.g. `--_handle` = forced-colors › disabled › interacting ›
 * selected › rest. Every condition only *sets its own* local, so overlapping
 * states resolve the same way however Tailwind orders the rules.
 */

/** The control: the track box (with margins up to the 48dp target). */
export const switchVariants = cva(
  [
    // Layout. The host *is* the track box; block/inline margins grow its
    // margin box to the touch target so rows line up like checkbox/radio.
    "relative isolate inline-flex h-[var(--_th)] w-[var(--_tw)] shrink-0 cursor-pointer align-middle select-none [-webkit-tap-highlight-color:transparent] forced-colors:forced-color-adjust-none",
    "mx-[max(0px,calc((var(--_tt)_-_var(--_tw))/2))] my-[max(0px,calc((var(--_tt)_-_var(--_th))/2))]",
    // Geometry tokens.
    "[--_focus:var(--md-comp-switch-focus-indicator-color,var(--md-sys-color-secondary))] [--_ow:var(--md-comp-switch-track-outline-width,0.125rem)] [--_sls:var(--md-comp-switch-state-layer-size,2.5rem)] [--_th:var(--md-comp-switch-track-height,2rem)] [--_tt:var(--md-comp-switch-touch-target-size,3rem)] [--_tw:var(--md-comp-switch-track-width,3.25rem)]",
    MOTION,
    FAST_SPATIAL,
    STATE,
    // Pressed (pointer `:active`, the island's `data-pressed` for touch/keys,
    // or pressing the label row) also counts for the state layer.
    "data-pressed:[--_sl-press:calc(var(--md-sys-state-pressed-opacity,0.1)*100%)]",
    // Focus ring on the track (0 → 3dp on keyboard focus).
    "[--_ring:0px] has-focus-visible:[--_ring:var(--md-comp-switch-focus-indicator-thickness,0.1875rem)] forced-colors:[--_focus:Highlight]",
    // Handle centre (`--_cx`, from the track's inline start) → `--_x`, the
    // logical inset of the 40dp disc that carries the handle and the ripple
    // (logical, so RTL mirrors with no sign math). `--_drag-x` (px, set inline
    // by the island) wins while a drag is in flight.
    "[--_cx:var(--_drag-x,var(--_cx-sel,calc(var(--_th)/2)))] [--_x:calc(var(--_cx)_-_var(--_sls)/2)]",
    // Handle size: pressed › selected › with-icon › unselected.
    "[--_hs:var(--_hs-press,var(--_hs-sel,var(--_hs-icon,var(--md-comp-switch-unselected-handle-size,1rem))))]",
    // Timing. `--_still` (disabled) freezes everything; a press snaps the
    // handle (Compose's `SnapSpec`); reduced motion snaps it as well.
    "[--_ed:var(--_still,var(--md-comp-switch-effects-duration,67ms))] [--_hd:var(--_still,var(--_reduced,var(--_hd-press,var(--md-comp-switch-handle-duration,348ms))))] [--_he:var(--md-comp-switch-handle-easing,var(--_spatial-fast))] [--_io:var(--_still,var(--md-comp-switch-icon-fade-duration,33ms))] motion-reduce:[--_reduced:0s]",
    // Press: the handle grows to 28dp. Any press source counts.
    "group-active/selection-field:[--_hd-press:var(--md-comp-switch-pressed-handle-duration,0s)] group-active/selection-field:[--_hs-press:var(--md-comp-switch-pressed-handle-size,1.75rem)] active:[--_hd-press:var(--md-comp-switch-pressed-handle-duration,0s)] active:[--_hs-press:var(--md-comp-switch-pressed-handle-size,1.75rem)] data-pressed:[--_hd-press:var(--md-comp-switch-pressed-handle-duration,0s)] data-pressed:[--_hs-press:var(--md-comp-switch-pressed-handle-size,1.75rem)]",
    // Color chains (see the file comment). `--_a*` come from `color`.
    "[--_track:var(--_fc-track,var(--_track-dis,var(--_track-sel,var(--md-comp-switch-unselected-track-color,var(--md-sys-color-surface-container-highest)))))]",
    "[--_outline:var(--_fc-outline,var(--_ol-dis,var(--_ol-sel,var(--md-comp-switch-unselected-track-outline-color,var(--md-sys-color-outline)))))]",
    "[--_handle:var(--_fc-handle,var(--_handle-dis,var(--_handle-int,var(--_handle-sel,var(--md-comp-switch-unselected-handle-color,var(--md-sys-color-outline))))))]",
    "[--_icon:var(--_fc-icon,var(--_icon-dis,var(--_icon-sel,var(--md-comp-switch-unselected-icon-color,var(--md-sys-color-surface-container-highest)))))]",
    "[--_state:var(--_st-sel,var(--md-comp-switch-unselected-state-layer-color,var(--md-sys-color-on-surface)))]",
    // Hovered / focused / pressed handle color (MD3 uses one role for all three).
    "[--_handle-iv:var(--md-comp-switch-unselected-hover-handle-color,var(--md-sys-color-on-surface-variant))] group-hover/selection-field:[--_handle-int:var(--_handle-iv)] group-active/selection-field:[--_handle-int:var(--_handle-iv)] hover:[--_handle-int:var(--_handle-iv)] active:[--_handle-int:var(--_handle-iv)] has-focus-visible:[--_handle-int:var(--_handle-iv)] data-pressed:[--_handle-int:var(--_handle-iv)]",
    // Unselected resting values: track background inside the border (so the
    // 12% disabled fill and outline never overlap), icons parked off.
    "[--_clip:padding-box] [--_ioff:1] [--_ion:0] [--_irot:var(--_irot-off,0deg)]",
    // Selected.
    "[&:has(>input:checked)]:[--_clip:border-box] [&:has(>input:checked)]:[--_cx-sel:calc(var(--_tw)_-_var(--_th)/2)] [&:has(>input:checked)]:[--_handle-iv:var(--md-comp-switch-selected-hover-handle-color,var(--_ac))] [&:has(>input:checked)]:[--_handle-sel:var(--md-comp-switch-selected-handle-color,var(--_on-a))] [&:has(>input:checked)]:[--_hs-sel:var(--md-comp-switch-selected-handle-size,1.5rem)] [&:has(>input:checked)]:[--_icon-sel:var(--md-comp-switch-selected-icon-color,var(--_on-ac))] [&:has(>input:checked)]:[--_ioff:0] [&:has(>input:checked)]:[--_ion:1] [&:has(>input:checked)]:[--_irot:0deg] [&:has(>input:checked)]:[--_ol-sel:var(--md-comp-switch-selected-track-outline-color,transparent)] [&:has(>input:checked)]:[--_st-sel:var(--md-comp-switch-selected-state-layer-color,var(--_a))] [&:has(>input:checked)]:[--_track-sel:var(--md-comp-switch-selected-track-color,var(--_a))]",
    // Disabled (prop or an ancestor `<fieldset disabled>`): no press growth,
    // no state layer, no motion.
    "[&:has(>input:disabled)]:cursor-default [&:has(>input:disabled)]:[--_handle-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>input:disabled)]:[--_hs-press:initial] [&:has(>input:disabled)]:[--_icon-dis:color-mix(in_srgb,var(--md-sys-color-surface-container-highest)_38%,transparent)] [&:has(>input:disabled)]:[--_ol-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,transparent)] [&:has(>input:disabled)]:[--_sl-off:0%] [&:has(>input:disabled)]:[--_still:0s] [&:has(>input:disabled)]:[--_track-dis:color-mix(in_srgb,var(--md-sys-color-surface-container-highest)_12%,transparent)]",
    "[&:has(>input:checked:disabled)]:[--_handle-dis:var(--md-sys-color-surface)] [&:has(>input:checked:disabled)]:[--_icon-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [&:has(>input:checked:disabled)]:[--_ol-dis:transparent] [&:has(>input:checked:disabled)]:[--_track-dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,transparent)]",
    // While dragging, the pointer is a grabbing hand.
    "data-dragging:cursor-grabbing",
    // Windows High Contrast: opt out of the forced palette (it would erase the
    // track fill, and with it the state) and paint with system color pairs.
    "forced-colors:[--_fc-handle:CanvasText] forced-colors:[--_fc-icon:Canvas] forced-colors:[--_fc-outline:CanvasText] forced-colors:[--_fc-track:Canvas]",
    "forced-colors:[&:has(>input:checked)]:[--_fc-handle:Canvas] forced-colors:[&:has(>input:checked)]:[--_fc-icon:CanvasText] forced-colors:[&:has(>input:checked)]:[--_fc-track:CanvasText]",
    "forced-colors:[&:has(>input:checked:disabled)]:[--_fc-handle:Canvas] forced-colors:[&:has(>input:checked:disabled)]:[--_fc-icon:GrayText] forced-colors:[&:has(>input:checked:disabled)]:[--_fc-track:GrayText] forced-colors:[&:has(>input:disabled)]:[--_fc-handle:GrayText] forced-colors:[&:has(>input:disabled)]:[--_fc-outline:GrayText]",
  ],
  {
    variants: {
      /**
       * The selected role family: track, handle, hovered handle and icon
       * (`X` / `on-X` / `X-container` / `on-X-container`). MD3 specifies
       * `primary`; the alternatives are the matching fixed MD3 families.
       */
      color: {
        primary:
          "[--_a:var(--md-sys-color-primary)] [--_ac:var(--md-sys-color-primary-container)] [--_on-a:var(--md-sys-color-on-primary)] [--_on-ac:var(--md-sys-color-on-primary-container)]",
        secondary:
          "[--_a:var(--md-sys-color-secondary)] [--_ac:var(--md-sys-color-secondary-container)] [--_on-a:var(--md-sys-color-on-secondary)] [--_on-ac:var(--md-sys-color-on-secondary-container)]",
        tertiary:
          "[--_a:var(--md-sys-color-tertiary)] [--_ac:var(--md-sys-color-tertiary-container)] [--_on-a:var(--md-sys-color-on-tertiary)] [--_on-ac:var(--md-sys-color-on-tertiary-container)]",
      },
      /**
       * MD3's three configurations: no icons, an icon on the selected switch
       * only (the check rotates into view), or icons in both states (the
       * unselected handle grows to the 24dp with-icon size to hold one).
       */
      icons: {
        false: "",
        selected: "[--_irot-off:-45deg]",
        true: "[--_hs-icon:var(--md-comp-switch-with-icon-handle-size,1.5rem)]",
      },
    },
    defaultVariants: { color: "primary", icons: false },
  },
);

/**
 * The label row (`<label>`) used when `label` is set: the whole row toggles
 * the switch, previews its state layer on hover and grows its handle on press,
 * and dims with it when disabled. MD3 puts the text first in settings rows, so
 * `start` is the default.
 */
export const switchFieldVariants = cva(
  "group/selection-field inline-flex max-w-full cursor-pointer items-start gap-x-[var(--md-comp-switch-label-gap,1rem)] align-middle select-none [-webkit-tap-highlight-color:transparent] has-disabled:cursor-default",
  {
    variants: {
      /** Which side of the switch the text sits on, in logical terms (RTL-aware). */
      labelPosition: {
        start: "flex-row-reverse",
        end: "flex-row",
      },
    },
    defaultVariants: { labelPosition: "start" },
  },
);

/**
 * The native input: invisible, but it *is* the hit target (≥ 48dp, centred on
 * the track) and the focus. `pan-y` keeps vertical page scrolling on touch
 * while leaving horizontal drags to the switch.
 */
export const INPUT =
  "absolute top-1/2 left-1/2 z-[1] m-0 h-[max(100%,var(--_tt))] w-[max(100%,var(--_tt))] cursor-[inherit] appearance-none rounded-none bg-none opacity-0 outline-none [touch-action:pan-y_pinch-zoom] [translate:-50%_-50%]";

/**
 * The track. Background and border fade on the effects timing; the focus ring
 * is an outline 2dp outside it.
 */
export const TRACK =
  "pointer-events-none absolute inset-0 box-border rounded-[var(--md-comp-switch-track-shape,var(--md-sys-shape-corner-full,9999px))] border-[length:var(--_ow)] border-solid border-[color:var(--_outline)] bg-[color:var(--_track)] [background-clip:var(--_clip)] outline-[length:var(--_ring)] outline-offset-2 outline-[color:var(--_focus)] outline-solid [transition:background-color_var(--_ed)_linear,border-color_var(--_ed)_linear]";

/**
 * Where the handle's 40dp state-layer disc sits: centred on `--_cx`, sliding
 * on the handle spring. Shared by the state layer and the press ripple so both
 * travel with the handle (Compose draws its indication on the thumb).
 */
const FOLLOW =
  "absolute inset-y-0 start-[var(--_x)] end-auto my-auto size-[var(--_sls)] rounded-full";

/** The state-layer disc + handle carrier. */
export const HANDLE_CONTAINER = `${FOLLOW} pointer-events-none flex items-center justify-center bg-[color:color-mix(in_srgb,var(--_state)_var(--_sl),transparent)] [transition:inset-inline-start_var(--_hd)_var(--_he),background-color_137ms_var(--_fx-fast)]`;

/** The centred press ripple, riding along with the handle above the track. */
export const RIPPLE = `${FOLLOW} z-0 [transition:inset-inline-start_var(--_hd)_var(--_he)]`;

/** The handle: a circle whose size springs between 16 / 24 / 28dp. */
export const HANDLE =
  "relative size-[var(--_hs)] shrink-0 rounded-[var(--md-comp-switch-handle-shape,var(--md-sys-shape-corner-full,9999px))] bg-[color:var(--_handle)] [transition:width_var(--_hd)_var(--_he),height_var(--_hd)_var(--_he),background-color_var(--_ed)_linear]";

const ICON =
  "pointer-events-none absolute inset-0 m-auto flex size-[var(--md-comp-switch-icon-size,1rem)] items-center justify-center text-[color:var(--_icon)] [&>svg]:size-full";

/** The selected icon (default: a check). Rotates in when it's alone. */
export const ICON_SELECTED = `${ICON} [opacity:var(--_ion)] [transform:rotate(var(--_irot))] [transition:opacity_var(--_io)_linear,transform_var(--_hd)_var(--_he),color_var(--_ed)_linear]`;

/** The unselected icon (default: a close "×"). */
export const ICON_UNSELECTED = `${ICON} [opacity:var(--_ioff)] [transition:opacity_var(--_io)_linear,color_var(--_ed)_linear]`;

/**
 * The text column. Its block padding centres the first line on the switch
 * ((48dp target − 20dp line) / 2), so multi-line labels and supporting text
 * hang from the first line instead of re-centring the switch.
 */
export const TEXT =
  "flex min-w-0 flex-col py-[calc((var(--md-comp-switch-touch-target-size,3rem)_-_1.25rem)/2)]";

/** The label: MD3 says `on-surface` adjacent text, whatever the state. */
export const LABEL =
  "text-body-medium text-on-surface group-has-disabled/selection-field:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] forced-colors:group-has-disabled/selection-field:text-[color:GrayText]";

/** Supporting text: body-small `on-surface-variant`. */
export const SUPPORTING_TEXT =
  "text-body-small text-on-surface-variant group-has-disabled/selection-field:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] forced-colors:group-has-disabled/selection-field:text-[color:GrayText]";
