import { cva } from "class-variance-authority";

import {
  ENTER,
  EXIT,
  FORCED_COLORS,
  MOTION,
  SIZE,
  TRANSITION,
} from "../config";

/*
 * Material Design 3 **badge** (m3.material.io/components/badges): a small `error`
 * dot, or a `label-small` pill carrying a count, anchored to the upper trailing
 * corner of an icon. It's a static, non-interactive indicator — no state layer,
 * no focus ring — so the craft is in the geometry and the motion:
 *
 * - **Geometry is driven by locals** (`--_h`, `--_r`, `--_px`, `--_ox`, `--_oy`
 *   from config.ts `SIZE`). The base classes read them, so `small` ⇄ `large`
 *   swaps values on the *same* element and every property morphs together.
 * - **Height + min-width** (never a fixed width) make one digit a perfect circle
 *   and let longer counts grow; `tabular-nums` keeps the width steady while a
 *   count ticks.
 * - **Finite radii** (`3dp` / `8dp`, exactly half the height) instead of
 *   `rounded-full`, whose `calc(infinity * 1px)` can't interpolate smoothly.
 * - **Anchored** badges are positioned with **logical** insets
 *   (`inset-inline-start`), so RTL mirrors them with no extra code, and their
 *   `scale` grows out of the corner that touches the icon.
 *
 * Tokens: `--md-comp-badge-color`, `-label-text-color`, `-small-size`,
 * `-small-shape`, `-small-offset-x`, `-small-offset-y`, `-large-size`,
 * `-large-shape`, `-large-padding`, `-large-offset-x`, `-large-offset-y`,
 * `-spatial-easing`, `-spatial-duration`, `-effects-easing`, `-effects-duration`.
 */

export const badgeVariants = cva(
  `box-border inline-flex h-[var(--_h)] min-w-[var(--_h)] shrink-0 items-center justify-center rounded-[var(--_r)] bg-[var(--md-comp-badge-color,var(--_bg))] px-[var(--_px)] align-middle text-label-small whitespace-nowrap text-[color:var(--md-comp-badge-label-text-color,var(--_fg))] tabular-nums select-none ${MOTION} ${TRANSITION} ${ENTER} ${FORCED_COLORS}`,
  {
    variants: {
      /** `small` = the 6dp dot; `large` = the 16dp labelled pill. */
      size: SIZE,
      /**
       * Container + label role pair. MD3 defaults to `error`; the alternatives
       * are fixed, contrast-safe MD3 pairs for brand or status badges.
       */
      color: {
        error:
          "[--_bg:var(--md-sys-color-error)] [--_fg:var(--md-sys-color-on-error)]",
        primary:
          "[--_bg:var(--md-sys-color-primary)] [--_fg:var(--md-sys-color-on-primary)]",
        secondary:
          "[--_bg:var(--md-sys-color-secondary)] [--_fg:var(--md-sys-color-on-secondary)]",
        tertiary:
          "[--_bg:var(--md-sys-color-tertiary)] [--_fg:var(--md-sys-color-on-tertiary)]",
      },
      /**
       * Which upper corner of the anchor the badge sits on, in **logical**
       * terms: `top-end` (MD3 default — right in LTR, left in RTL) or
       * `top-start`. Only applies when the badge wraps an anchor.
       */
      placement: {
        "top-end": "",
        "top-start": "",
      },
      /** Internal: set by the view when the badge wraps an anchor. */
      anchored: {
        false: "relative",
        true: "pointer-events-none absolute top-[calc(var(--_oy)_-_var(--_h))] z-[1]",
      },
      /** Internal: hidden (`invisible`, or a `0` without `showZero`). */
      hidden: {
        false: "",
        true: EXIT,
      },
    },
    compoundVariants: [
      // The leading edge sits `--_ox` inside the anchor's trailing edge and the
      // badge grows outward from there (MD3: "width expands, but keeps the same
      // placement"). Scale grows from the corner that touches the icon.
      {
        anchored: true,
        placement: "top-end",
        class:
          "start-[calc(100%_-_var(--_ox))] origin-bottom-left rtl:origin-bottom-right",
      },
      {
        anchored: true,
        placement: "top-start",
        class:
          "end-[calc(100%_-_var(--_ox))] origin-bottom-right rtl:origin-bottom-left",
      },
    ],
    defaultVariants: {
      size: "large",
      color: "error",
      placement: "top-end",
      anchored: false,
      hidden: false,
    },
  },
);

/**
 * The anchor wrapper: a shrink-wrapped positioning context around the icon, so
 * the badge's offsets are measured from the **icon's** box (as MD3 specifies),
 * not from the whole button or navigation item around it.
 */
export const badgeAnchorVariants = cva("relative", {
  variants: {
    /** `false` when `asChild` slots onto the consumer's own element. */
    wrapper: {
      true: "inline-flex shrink-0 align-middle",
      false: "",
    },
  },
  defaultVariants: { wrapper: true },
});
