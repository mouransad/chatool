import { cva } from "class-variance-authority";

import { DISABLED, STATE_LAYER } from "../config";
import {
  type FabResponsive,
  type FabSize,
  type FabWindowClass,
} from "./fab.types";

/*
 * Material Design 3 **Expressive** FAB + extended FAB — one element that can be
 * an icon-only FAB, an extended FAB, or morph between the two.
 *
 * Sources (researched live): m3.material.io FAB / extended FAB specs,
 * guidelines + accessibility; Compose `material3` `FloatingActionButton.kt`,
 * `FabBaselineTokens` / `FabMediumTokens` / `FabLargeTokens`,
 * `ExtendedFab{Small,Medium,Large}Tokens`, `FabPrimaryContainerTokens`,
 * `ExpressiveMotionTokens`; Material Web `labs/gb/components/fab` tokens.
 *
 * | size     | container | corner | icon | extended padding | icon↔label | label type     |
 * | -------- | --------- | ------ | ---- | ---------------- | ---------- | -------------- |
 * | `small`  | 56dp      | 16dp   | 24dp | 16dp             | 8dp        | Title Medium   |
 * | `medium` | 80dp      | 20dp   | 28dp | 26dp             | 12dp       | Title Large    |
 * | `large`  | 96dp      | 28dp   | 36dp | 28dp             | 16dp       | Headline Small |
 *
 * (Compose notes `FabLargeTokens.IconSize` = 32dp "is incorrect" and uses 36dp,
 * matching the m3.material.io measurements.) Corners are the shape-scale roles
 * `corner-large` / `corner-large-increased` / `corner-extra-large`, read from
 * `--md-sys-shape-*` with the spec value as fallback.
 *
 * **Geometry as locals.** Every size-dependent value is a local custom property
 * (`--_h` height, `--_ic` icon, `--_pad` extended padding, `--_gap`
 * icon↔label space, `--_r` corner), so a size change — including a responsive
 * one at a window-class breakpoint — swaps the locals and **morphs** height,
 * corner, padding and icon on one spring.
 *
 * **One element, two forms.** An icon-only FAB *is* a collapsed extended FAB:
 * `COLLAPSED` sets the inline padding to `(height − icon) / 2` (a square
 * container, icon centered) and folds the label's width + opacity to 0. The
 * label lives in a clipping wrapper whose width is its measured px width (from
 * the `fab-label` client island) times `--chatool-fab-expansion`, an expansion progress the
 * container springs between 1 and 0 — so expand ⇄ collapse animates a real
 * length on the spring, overshoot and all, like Compose's `lerp(minWidth,
 * expandedWidth, progress)`. The label stays in the DOM, so a collapsed
 * extended FAB keeps its visible label as its accessible name.
 *
 * Tailwind only generates classes it can see as **complete literals**, so the
 * responsive maps below are spelled out in full.
 */

/**
 * M3 Expressive motion as CSS `linear()` easings sampled from the real springs
 * in Compose's `ExpressiveMotionTokens` (mass 1, solved analytically, sampled to
 * a 0.2% settle threshold) — the same curves the badge and overlays use:
 *
 * - **Fast spatial** — `spring(dampingRatio = 0.6, stiffness = 800)`, 350ms,
 *   ~9.5% overshoot. Compose animates the extended FAB's width
 *   (`MotionSchemeKeyTokens.FastSpatial`) and the show/hide scale
 *   (`animateFloatingActionButton`) on it; here it also drives padding,
 *   corner, height and icon-size morphs.
 * - **Fast effects** — `spring(1, 3800)`, 140ms, no overshoot. The label's
 *   fade, show/hide opacity, colors and elevation.
 *
 * Override per app or per FAB with `--md-comp-fab-spatial-easing` /
 * `-spatial-duration` / `-effects-easing` / `-effects-duration`. Under
 * `prefers-reduced-motion` spatial motion is instant; fades remain.
 */
const MOTION =
  "[--_spatial:var(--md-comp-fab-spatial-easing,linear(0,0.054,0.185,0.352,0.527,0.69,0.827,0.934,1.011,1.06,1.086,1.095,1.091,1.079,1.063,1.047,1.031,1.018,1.007,1,0.995,0.992,0.991,0.991,0.992,0.994,0.995,0.997,1))] [--_sd:var(--md-comp-fab-spatial-duration,350ms)] [--_effects:var(--md-comp-fab-effects-easing,linear(0,0.102,0.293,0.481,0.635,0.751,0.833,0.891,0.929,0.954,0.971,0.982,0.988,0.993,0.996,0.997,1))] [--_ed:var(--md-comp-fab-effects-duration,140ms)] motion-reduce:[--_sd:0s]";

/** The container's transition: geometry on the spatial spring, the rest on effects. */
const TRANSITION =
  "[transition:--chatool-fab-expansion_var(--_sd)_var(--_spatial),padding_var(--_sd)_var(--_spatial),height_var(--_sd)_var(--_spatial),min-width_var(--_sd)_var(--_spatial),border-radius_var(--_sd)_var(--_spatial),font-size_var(--_sd)_var(--_spatial),line-height_var(--_sd)_var(--_spatial),scale_var(--_sd)_var(--_spatial),opacity_var(--_ed)_var(--_effects),box-shadow_var(--_ed)_var(--_effects),background-color_var(--_ed)_var(--_effects),color_var(--_ed)_var(--_effects)]";

/**
 * MD3 focus indicator: a 3dp `secondary` outline, 2dp outside the container,
 * following its corner (overridable via `--md-comp-fab-focus-color`). An
 * outline (not a ring) so it never competes with the elevation shadow.
 */
const FOCUS =
  "outline-none focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--md-comp-fab-focus-color,var(--md-sys-color-secondary))]";

/**
 * Windows High Contrast / forced colors: the container fill and shadow are
 * dropped by the UA, so draw a `ButtonText` border to keep the shape visible
 * (as Material Web does).
 */
const FORCED_COLORS =
  "forced-colors:border forced-colors:border-solid forced-colors:border-[ButtonText]";

/**
 * Entrance — "when a FAB animates on screen, it expands outward from a central
 * point" (MD3). On first render, and whenever it's re-inserted (e.g. a new
 * `key` per tab, which MD3 asks for), it springs up from 20% scale (Compose's
 * `ShowHideTargetScale`) while fading in. Pure CSS (`@starting-style`).
 */
const ENTRANCE = "starting:scale-[0.2] starting:opacity-0";

const BASE = `relative isolate inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap align-middle [-webkit-tap-highlight-color:transparent] h-[var(--_h)] min-w-[var(--_h)] px-[var(--_pi,var(--_pad))] rounded-[var(--md-comp-fab-container-shape,var(--_r))] bg-[var(--md-comp-fab-container-color,var(--_bg))] text-[color:var(--md-comp-fab-label-text-color,var(--_fg))] [--_state:var(--md-comp-fab-icon-color,var(--_fg))] ${MOTION} ${TRANSITION} ${STATE_LAYER} ${FOCUS} ${DISABLED} ${FORCED_COLORS} ${ENTRANCE}`;

/** Window-class breakpoints above `compact` (MD3: 600 / 840 / 1200 / 1600dp). */
type Breakpoint = Exclude<FabWindowClass, "compact">;
const BREAKPOINTS: Breakpoint[] = ["medium", "expanded", "large", "extraLarge"];

/** Geometry locals + label typescale per size (see the table above). */
const SIZE: Record<FabSize, string> = {
  small:
    "[--_h:3.5rem] [--_ic:1.5rem] [--_pad:1rem] [--_gap:0.5rem] [--_r:var(--md-sys-shape-corner-large,1rem)] text-title-medium font-[family-name:var(--md-sys-typescale-title-medium-font)]",
  medium:
    "[--_h:5rem] [--_ic:1.75rem] [--_pad:1.625rem] [--_gap:0.75rem] [--_r:var(--md-sys-shape-corner-large-increased,1.25rem)] text-title-large font-[family-name:var(--md-sys-typescale-title-large-font)]",
  large:
    "[--_h:6rem] [--_ic:2.25rem] [--_pad:1.75rem] [--_gap:1rem] [--_r:var(--md-sys-shape-corner-extra-large,1.75rem)] text-headline-small font-[family-name:var(--md-sys-typescale-headline-small-font)]",
};

const SIZE_AT: Record<Breakpoint, Record<FabSize, string>> = {
  medium: {
    small:
      "min-[600px]:[--_h:3.5rem] min-[600px]:[--_ic:1.5rem] min-[600px]:[--_pad:1rem] min-[600px]:[--_gap:0.5rem] min-[600px]:[--_r:var(--md-sys-shape-corner-large,1rem)] min-[600px]:text-title-medium min-[600px]:font-[family-name:var(--md-sys-typescale-title-medium-font)]",
    medium:
      "min-[600px]:[--_h:5rem] min-[600px]:[--_ic:1.75rem] min-[600px]:[--_pad:1.625rem] min-[600px]:[--_gap:0.75rem] min-[600px]:[--_r:var(--md-sys-shape-corner-large-increased,1.25rem)] min-[600px]:text-title-large min-[600px]:font-[family-name:var(--md-sys-typescale-title-large-font)]",
    large:
      "min-[600px]:[--_h:6rem] min-[600px]:[--_ic:2.25rem] min-[600px]:[--_pad:1.75rem] min-[600px]:[--_gap:1rem] min-[600px]:[--_r:var(--md-sys-shape-corner-extra-large,1.75rem)] min-[600px]:text-headline-small min-[600px]:font-[family-name:var(--md-sys-typescale-headline-small-font)]",
  },
  expanded: {
    small:
      "min-[840px]:[--_h:3.5rem] min-[840px]:[--_ic:1.5rem] min-[840px]:[--_pad:1rem] min-[840px]:[--_gap:0.5rem] min-[840px]:[--_r:var(--md-sys-shape-corner-large,1rem)] min-[840px]:text-title-medium min-[840px]:font-[family-name:var(--md-sys-typescale-title-medium-font)]",
    medium:
      "min-[840px]:[--_h:5rem] min-[840px]:[--_ic:1.75rem] min-[840px]:[--_pad:1.625rem] min-[840px]:[--_gap:0.75rem] min-[840px]:[--_r:var(--md-sys-shape-corner-large-increased,1.25rem)] min-[840px]:text-title-large min-[840px]:font-[family-name:var(--md-sys-typescale-title-large-font)]",
    large:
      "min-[840px]:[--_h:6rem] min-[840px]:[--_ic:2.25rem] min-[840px]:[--_pad:1.75rem] min-[840px]:[--_gap:1rem] min-[840px]:[--_r:var(--md-sys-shape-corner-extra-large,1.75rem)] min-[840px]:text-headline-small min-[840px]:font-[family-name:var(--md-sys-typescale-headline-small-font)]",
  },
  large: {
    small:
      "min-[1200px]:[--_h:3.5rem] min-[1200px]:[--_ic:1.5rem] min-[1200px]:[--_pad:1rem] min-[1200px]:[--_gap:0.5rem] min-[1200px]:[--_r:var(--md-sys-shape-corner-large,1rem)] min-[1200px]:text-title-medium min-[1200px]:font-[family-name:var(--md-sys-typescale-title-medium-font)]",
    medium:
      "min-[1200px]:[--_h:5rem] min-[1200px]:[--_ic:1.75rem] min-[1200px]:[--_pad:1.625rem] min-[1200px]:[--_gap:0.75rem] min-[1200px]:[--_r:var(--md-sys-shape-corner-large-increased,1.25rem)] min-[1200px]:text-title-large min-[1200px]:font-[family-name:var(--md-sys-typescale-title-large-font)]",
    large:
      "min-[1200px]:[--_h:6rem] min-[1200px]:[--_ic:2.25rem] min-[1200px]:[--_pad:1.75rem] min-[1200px]:[--_gap:1rem] min-[1200px]:[--_r:var(--md-sys-shape-corner-extra-large,1.75rem)] min-[1200px]:text-headline-small min-[1200px]:font-[family-name:var(--md-sys-typescale-headline-small-font)]",
  },
  extraLarge: {
    small:
      "min-[1600px]:[--_h:3.5rem] min-[1600px]:[--_ic:1.5rem] min-[1600px]:[--_pad:1rem] min-[1600px]:[--_gap:0.5rem] min-[1600px]:[--_r:var(--md-sys-shape-corner-large,1rem)] min-[1600px]:text-title-medium min-[1600px]:font-[family-name:var(--md-sys-typescale-title-medium-font)]",
    medium:
      "min-[1600px]:[--_h:5rem] min-[1600px]:[--_ic:1.75rem] min-[1600px]:[--_pad:1.625rem] min-[1600px]:[--_gap:0.75rem] min-[1600px]:[--_r:var(--md-sys-shape-corner-large-increased,1.25rem)] min-[1600px]:text-title-large min-[1600px]:font-[family-name:var(--md-sys-typescale-title-large-font)]",
    large:
      "min-[1600px]:[--_h:6rem] min-[1600px]:[--_ic:2.25rem] min-[1600px]:[--_pad:1.75rem] min-[1600px]:[--_gap:1rem] min-[1600px]:[--_r:var(--md-sys-shape-corner-extra-large,1.75rem)] min-[1600px]:text-headline-small min-[1600px]:font-[family-name:var(--md-sys-typescale-headline-small-font)]",
  },
};

const COLLAPSED =
  "[--_pi:calc((var(--_h)_-_var(--_ic))_/_2)] [--chatool-fab-expansion:0] [--_lw:0px] [--_lo:0]";

const EXPANSION_AT: Record<
  Breakpoint,
  Record<"collapsed" | "expanded", string>
> = {
  medium: {
    collapsed:
      "min-[600px]:[--_pi:calc((var(--_h)_-_var(--_ic))_/_2)] min-[600px]:[--chatool-fab-expansion:0] min-[600px]:[--_lw:0px] min-[600px]:[--_lo:0]",
    expanded:
      "min-[600px]:[--_pi:initial] min-[600px]:[--chatool-fab-expansion:1] min-[600px]:[--_lw:initial] min-[600px]:[--_lo:initial]",
  },
  expanded: {
    collapsed:
      "min-[840px]:[--_pi:calc((var(--_h)_-_var(--_ic))_/_2)] min-[840px]:[--chatool-fab-expansion:0] min-[840px]:[--_lw:0px] min-[840px]:[--_lo:0]",
    expanded:
      "min-[840px]:[--_pi:initial] min-[840px]:[--chatool-fab-expansion:1] min-[840px]:[--_lw:initial] min-[840px]:[--_lo:initial]",
  },
  large: {
    collapsed:
      "min-[1200px]:[--_pi:calc((var(--_h)_-_var(--_ic))_/_2)] min-[1200px]:[--chatool-fab-expansion:0] min-[1200px]:[--_lw:0px] min-[1200px]:[--_lo:0]",
    expanded:
      "min-[1200px]:[--_pi:initial] min-[1200px]:[--chatool-fab-expansion:1] min-[1200px]:[--_lw:initial] min-[1200px]:[--_lo:initial]",
  },
  extraLarge: {
    collapsed:
      "min-[1600px]:[--_pi:calc((var(--_h)_-_var(--_ic))_/_2)] min-[1600px]:[--chatool-fab-expansion:0] min-[1600px]:[--_lw:0px] min-[1600px]:[--_lo:0]",
    expanded:
      "min-[1600px]:[--_pi:initial] min-[1600px]:[--chatool-fab-expansion:1] min-[1600px]:[--_lw:initial] min-[1600px]:[--_lo:initial]",
  },
};

/**
 * MD3 FAB color styles. The state layer is painted in the icon color (MD3:
 * "make sure the state layer color is the same as the icon color").
 */
const COLOR = {
  "primary-container":
    "[--_bg:var(--md-sys-color-primary-container)] [--_fg:var(--md-sys-color-on-primary-container)]",
  "secondary-container":
    "[--_bg:var(--md-sys-color-secondary-container)] [--_fg:var(--md-sys-color-on-secondary-container)]",
  "tertiary-container":
    "[--_bg:var(--md-sys-color-tertiary-container)] [--_fg:var(--md-sys-color-on-tertiary-container)]",
  primary:
    "[--_bg:var(--md-sys-color-primary)] [--_fg:var(--md-sys-color-on-primary)]",
  secondary:
    "[--_bg:var(--md-sys-color-secondary)] [--_fg:var(--md-sys-color-on-secondary)]",
  tertiary:
    "[--_bg:var(--md-sys-color-tertiary)] [--_fg:var(--md-sys-color-on-tertiary)]",
} as const;

/**
 * Elevation per state (Compose `FabPrimaryContainerTokens` /
 * `loweredElevation` / `bottomAppBarFabElevation`): resting · hovered ·
 * focused · pressed = 3 · 4 · 3 · 3 (`default`), 1 · 2 · 1 · 1 (`lowered`),
 * 0 everywhere (`none`).
 */
const ELEVATION = {
  default:
    "shadow-elevation-3 hover:shadow-elevation-4 focus-visible:shadow-elevation-3 active:shadow-elevation-3",
  lowered:
    "shadow-elevation-1 hover:shadow-elevation-2 focus-visible:shadow-elevation-1 active:shadow-elevation-1",
  none: "shadow-none",
} as const;

/**
 * Fixed placement with MD3's 16dp margins (`--md-comp-fab-margin`), pushed clear
 * of notches / home indicators via `env(safe-area-inset-*)` (needs
 * `viewport-fit=cover` to be non-zero). `end` / `start` are logical, so the FAB
 * sits at the trailing edge in RTL too.
 */
const PLACEMENT_BASE =
  "fixed z-[var(--md-comp-fab-z-index,10)] bottom-[calc(var(--md-comp-fab-margin,1rem)_+_env(safe-area-inset-bottom,0px))]";
const PLACEMENT = {
  "bottom-end": `${PLACEMENT_BASE} end-[calc(var(--md-comp-fab-margin,1rem)_+_env(safe-area-inset-right,0px))] rtl:end-[calc(var(--md-comp-fab-margin,1rem)_+_env(safe-area-inset-left,0px))]`,
  "bottom-start": `${PLACEMENT_BASE} start-[calc(var(--md-comp-fab-margin,1rem)_+_env(safe-area-inset-left,0px))] rtl:start-[calc(var(--md-comp-fab-margin,1rem)_+_env(safe-area-inset-right,0px))]`,
  "bottom-center": `${PLACEMENT_BASE} left-1/2 -translate-x-1/2`,
} as const;

/**
 * Hidden (`visible={false}`): shrink toward the center to 20% while fading out
 * — Compose's `animateFloatingActionButton` — and stop taking pointer input.
 * (The view also makes it `inert`.)
 */
const HIDDEN = "pointer-events-none scale-[0.2] opacity-0";

/**
 * The FAB container. `size` is the **compact** (base) size; responsive sizes
 * and expansion are layered on by {@link fabResponsiveClasses}. `collapsed`
 * squares the container around the icon (icon-only FAB, or an extended FAB
 * with `expanded={false}`).
 */
export const fabVariants = cva(BASE, {
  variants: {
    size: SIZE,
    color: COLOR,
    elevation: ELEVATION,
    placement: PLACEMENT,
    collapsed: { true: COLLAPSED, false: "" },
    visible: { true: "", false: HIDDEN },
  },
  defaultVariants: {
    size: "medium",
    color: "primary-container",
    elevation: "default",
    collapsed: false,
    visible: true,
  },
});

/** Icon slot: sized by the `--_ic` local; its size morphs with the container. */
export const fabIconClass =
  "inline-flex size-[var(--_ic)] shrink-0 items-center justify-center text-[color:var(--md-comp-fab-icon-color,var(--_fg))] [transition:width_var(--_sd)_var(--_spatial),height_var(--_sd)_var(--_spatial),color_var(--_ed)_var(--_effects)] [&>svg]:size-full";

const isResponsiveObject = <T>(
  value: FabResponsive<T> | undefined,
): value is Partial<Record<FabWindowClass, T>> =>
  typeof value === "object" && value !== null;

/** The compact (base) value of a possibly-responsive prop. */
export const baseValue = <T>(
  value: FabResponsive<T> | undefined,
  fallback: T,
): T =>
  isResponsiveObject(value) ? (value.compact ?? fallback) : (value ?? fallback);

/**
 * Breakpoint classes for responsive `size` / `expanded` objects — each window
 * class from `medium` up re-sets the geometry locals (and expansion) in a
 * `min-width` media query, so it's all CSS: Server-Component-safe, no
 * hydration flash, and every change morphs on the spring.
 */
export const fabResponsiveClasses = ({
  size,
  expanded,
  collapsible,
}: {
  size?: FabResponsive<FabSize>;
  expanded?: FabResponsive<boolean>;
  /** Only an extended FAB with an icon can collapse. */
  collapsible: boolean;
}): string => {
  const classes: string[] = [];
  for (const bp of BREAKPOINTS) {
    if (isResponsiveObject(size) && size[bp]) {
      classes.push(SIZE_AT[bp][size[bp]]);
    }
    if (collapsible && isResponsiveObject(expanded)) {
      const value = expanded[bp];
      if (value !== undefined) {
        classes.push(EXPANSION_AT[bp][value ? "expanded" : "collapsed"]);
      }
    }
  }
  return classes.join(" ");
};
