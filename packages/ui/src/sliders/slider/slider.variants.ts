import { cva } from "class-variance-authority";

import {
  COLORS,
  DISABLED_COLORS,
  FORCED_COLORS,
  GEOMETRY,
  MOTION,
  SIZES,
} from "../config";

/*
 * Material Design 3 **Expressive slider** (m3.material.io/components/sliders),
 * ported from Compose `SliderTokens` / `SliderDefaults.drawTrack` and
 * MDC-Android's `Widget.Material3Expressive.Slider.*` (see `../config.ts` for
 * every number).
 *
 * **One layout for both orientations.** A vertical slider turns its root into
 * `writing-mode: vertical-lr; direction: rtl`, so the *inline* axis runs
 * bottom → top. Every part is placed with **logical** properties only
 * (`inset-inline-start`, `inline-size`, `inset-block`, logical corner radii),
 * so the same rules lay out horizontal LTR, horizontal RTL, vertical, and
 * `inverted` (which just flips `direction`) with no per-case math. Leaf
 * content (icons, the value indicator) switches back to `horizontal-tb` so it
 * stays upright.
 *
 * **Positions are pure CSS.** The view sets `--_f<i>` (the handle's 0…1
 * fraction) and `--_k<i>` (1 → the stop-aligned placement) inline; the root
 * turns them into `--_c<i>`, the handle centre along the track, and every
 * segment / stop / icon is a `calc()` of those. So the server render (and an
 * un-hydrated page) already shows the right picture.
 *
 * **Motion.** Value *jumps* (track click, keys, a controlled update) glide on
 * the Expressive default-spatial spring; while dragging (`data-dragging`)
 * everything follows the pointer 1:1. The handle squeezes 4dp → 2dp on the
 * fast-spatial spring when pressed or keyboard-focused, and the value
 * indicator pops on the same spring. Reduced motion keeps the fades only.
 */

/** The root: sizing, every token local, and the handle-centre formulas. */
export const sliderVariants = cva(
  [
    "group/slider relative isolate shrink-0 cursor-pointer select-none [-webkit-tap-highlight-color:transparent]",
    GEOMETRY,
    MOTION,
    COLORS,
    DISABLED_COLORS,
    FORCED_COLORS,
    "[&:is([data-disabled],:has(input:disabled))]:cursor-default",
    // Handle centres along the track (see slider-math.ts `computeLayout`).
    "[--_c0:calc(var(--_k0,0)_*_var(--_r)_+_var(--_f0,0)*(100%_-_2_*_var(--_k0,0)_*_var(--_r)))] [--_c1:calc(var(--_k1,0)_*_var(--_r)_+_var(--_f1,1)*(100%_-_2_*_var(--_k1,0)_*_var(--_r)))]",
  ],
  {
    variants: {
      /** MD3 Expressive size: XS (default) … XL. */
      size: SIZES,
      orientation: {
        horizontal:
          "min-w-32 block h-[max(var(--_hh),var(--_tt))] w-full touch-pan-y",
        // Bottom → top along the inline axis; width = the touch target.
        vertical:
          "h-50 inline-block w-[max(var(--_hh),var(--_tt))] touch-pan-x align-middle [direction:rtl] [writing-mode:vertical-lr]",
      },
      /** Reverses the direction (max at the start / top). */
      inverted: { true: "", false: "" },
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        inverted: true,
        class: "[direction:rtl] rtl:[direction:ltr]",
      },
      { orientation: "vertical", inverted: true, class: "[direction:ltr]" },
    ],
    defaultVariants: { size: "xs", orientation: "horizontal", inverted: false },
  },
);

/** The track box: the full length minus half a handle at each end. */
export const TRACK =
  "pointer-events-none absolute [inset-block:0] [inset-inline:calc(var(--_hw)/2)] [column-gap:var(--_gap)] [row-gap:var(--_r)]";

/**
 * One track segment (active or inactive), from `--_a` to `--_b` along the
 * track. The corners at the track's ends are `--_r`; the ones facing a handle
 * (or a centered slider's centre) are the 2dp inside corner.
 */
export const SEGMENT =
  "absolute [inset-block:0] [margin-block:auto] [block-size:var(--_th)] [inset-inline-start:var(--_a)] [inline-size:max(0px,calc(var(--_b)_-_var(--_a)))] rounded-[var(--_ri)] data-[outer=start]:[border-end-start-radius:var(--_r)] data-[outer=start]:[border-start-start-radius:var(--_r)] data-[outer=end]:[border-end-end-radius:var(--_r)] data-[outer=end]:[border-start-end-radius:var(--_r)] data-[kind=active]:bg-[var(--_active)] data-[kind=inactive]:bg-[var(--_inactive)] data-hidden:opacity-0 [transition-duration:412ms,412ms,212ms,137ms] [transition-property:inset-inline-start,inline-size,background-color,opacity] [transition-timing-function:var(--_spatial),var(--_spatial),var(--_fx),var(--_fx-fast)] group-data-dragging/slider:[transition-duration:0s,0s,212ms,137ms] motion-reduce:[transition-duration:0s,0s,212ms,137ms]";

/** A stop indicator dot (4dp) — the shared shape. */
const DOT =
  "pointer-events-none absolute [inset-block:0] [margin-block:auto] size-[var(--_stop)] rounded-full";

/** The stop at a segment's outer end (centred in the rounded cap). */
export const END_STOP = `${DOT} bg-[var(--_stop-on-inactive)] data-[at=end]:[inset-inline-end:calc(var(--_r)_-_var(--_stop)/2)] data-[at=start]:[inset-inline-start:calc(var(--_r)_-_var(--_stop)/2)]`;

/** A stop indicator for one allowed value (`stops`), inset by the corner. */
export const STOP = `${DOT} z-[1] [inset-inline-start:calc(var(--_r)_+_var(--_t)*(100%_-_2_*_var(--_r))_-_var(--_stop)/2)] data-[on=active]:bg-[var(--_stop-on-active)] data-[on=inactive]:bg-[var(--_stop-on-inactive)] data-hidden:opacity-0 [transition:background-color_212ms_var(--_fx),opacity_137ms_var(--_fx-fast)]`;

/**
 * An inset icon's box (icon + 10dp padding each side), placed at `--_ia`.
 * Two copies exist — one riding the active track's start, one riding the
 * inactive track's start just past the handle — and they cross-fade as the
 * active track grows past / shrinks below the box (MD3: "when there's not
 * enough space for the icon on the active track … the icon moves to the
 * inactive track").
 */
export const ICON =
  "pointer-events-none absolute z-[1] [inset-block:0] [margin-block:auto] flex items-center justify-center [block-size:var(--_icon)] [inline-size:calc(var(--_icon)_+_2_*_var(--_ipad))] [inset-inline-start:var(--_ia)] data-[on=active]:text-[color:var(--_icon-on-active)] data-[on=inactive]:text-[color:var(--_icon-on-inactive)] data-hidden:opacity-0 [transition-duration:412ms,137ms,212ms] [transition-property:inset-inline-start,opacity,color] [transition-timing-function:var(--_spatial),var(--_fx-fast),var(--_fx)] group-data-dragging/slider:[transition-duration:0s,137ms,212ms] motion-reduce:[transition-duration:0s,137ms,212ms]";

/** The upright glyph inside an inset icon box. */
export const ICON_GLYPH =
  "flex size-[var(--_icon)] shrink-0 items-center justify-center text-[length:var(--_icon)] [writing-mode:horizontal-tb] [&>svg]:size-full [&>svg]:shrink-0";

/**
 * A handle's slot: a `--_hw`-wide, handle-tall box centred on `--_c`. It
 * owns the per-thumb state locals: `--_hwc` (current handle width), `--_ring`
 * (focus ring width) and `--_vi` (value indicator 0 / 1).
 */
export const THUMB =
  "absolute z-[2] [inset-block:0] [margin-block:auto] flex items-center justify-center [block-size:var(--_hh)] [inline-size:var(--_hw)] [inset-inline-start:calc(var(--_c)_-_var(--_hw)/2)] [transition:inset-inline-start_412ms_var(--_spatial)] group-data-dragging/slider:transition-none motion-reduce:transition-none [--_hwc:var(--_hw)] [--_ring:0px] [--_vi:0] data-pressed:z-[3] data-pressed:[--_hwc:var(--_hwp)] has-focus-visible:z-[3] has-focus-visible:[--_hwc:var(--_hwp)] has-focus-visible:[--_ring:var(--md-comp-slider-focus-indicator-thickness,0.1875rem)] data-[indicator=always]:[--_vi:1] data-[indicator=auto]:data-pressed:[--_vi:1] data-[indicator=auto]:has-focus-visible:[--_vi:1]";

/** The visible handle: a full-round bar that squeezes 4dp → 2dp on press / focus. */
export const HANDLE =
  "block shrink-0 [block-size:100%] [inline-size:var(--_hwc)] rounded-full bg-[var(--_handle)] outline-[length:var(--_ring)] outline-offset-2 outline-[color:var(--_focus)] outline-solid [transition:inline-size_348ms_var(--_spatial-fast),background-color_212ms_var(--_fx)] motion-reduce:[transition:background-color_212ms_var(--_fx)]";

/**
 * The native `<input type="range">` — invisible, inert to the pointer, but
 * covering the handle and its gaps so a screen reader's focus outline lands
 * on the handle. It owns focus, the keyboard, form submission and the
 * accessibility tree (incl. iOS VoiceOver / TalkBack swipe-to-adjust).
 */
export const INPUT =
  "pointer-events-none absolute m-0 appearance-none opacity-0 [inset-block:0] [inset-inline:calc(-1_*_var(--_g))]";

/** Positions the value indicator `--_vis` beyond the handle's block-start. */
export const VALUE_INDICATOR_ANCHOR =
  "pointer-events-none absolute flex justify-center [inset-block-end:calc(100%_+_var(--_vis))] [inset-inline:0]";

/**
 * The MD3 value indicator: a 48×44dp `inverse-surface` pill with a
 * `label-large` value (MDC `Widget.Material3.Slider.Label`: 10dp side
 * padding, 12dp above/below a 20dp line). It pops from the handle on the
 * fast-spatial spring.
 */
export const VALUE_INDICATOR =
  "flex h-11 min-w-12 shrink-0 origin-bottom items-center justify-center rounded-full bg-[var(--md-comp-slider-value-indicator-container-color,var(--md-sys-color-inverse-surface))] px-2.5 text-label-large whitespace-nowrap text-[color:var(--md-comp-slider-value-indicator-label-text-color,var(--md-sys-color-inverse-on-surface))] [opacity:var(--_vi)] [scale:calc(0.4_+_0.6_*_var(--_vi))] [unicode-bidi:plaintext] [writing-mode:horizontal-tb] [transition:scale_348ms_var(--_spatial-fast),opacity_137ms_var(--_fx-fast)] group-data-[orientation=vertical]/slider:origin-right motion-reduce:[scale:1] forced-colors:border forced-colors:border-[CanvasText]";
