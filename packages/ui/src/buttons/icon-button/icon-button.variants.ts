import { cva } from "class-variance-authority";

import {
  BASE,
  DISABLED,
  FOCUS_RING,
  STATE_LAYER,
  type ButtonSize,
  iconButtonSize,
  pressCorner,
  roundCorner,
  squareCorner,
} from "../config";

const SIZES: ButtonSize[] = ["xs", "s", "m", "l", "xl"];

/**
 * Per (shape × selected × size) corners. Unselected `round` rests at the finite
 * half-height radius (a perfect circle on the square container) and presses to
 * `pressCorner.round`; `square` rests at `squareCorner`. **MD3 toggle morph:** a
 * selected `round` button squares off (rests at `squareCorner`) to signal the
 * "on" state — the resting radius itself flips, so it interpolates smoothly via
 * BASE's `border-radius` transition. Both rest at finite radii so the morph never
 * snaps (see config.ts).
 */
const cornerCompounds = SIZES.flatMap((size) => [
  {
    shape: "round" as const,
    selected: false,
    size,
    class: `${roundCorner[size]} ${pressCorner.round[size]}`,
  },
  {
    shape: "round" as const,
    selected: true,
    size,
    class: `${squareCorner[size]} ${pressCorner.square[size]}`,
  },
  {
    shape: "square" as const,
    selected: false,
    size,
    class: `${squareCorner[size]} ${pressCorner.square[size]}`,
  },
  {
    shape: "square" as const,
    selected: true,
    size,
    class: `${squareCorner[size]} ${pressCorner.square[size]}`,
  },
]);

/*
 * Material Design 3 icon button — an **icon-only**, square-container member of the
 * button family. Four styles (standard / filled / tonal / outlined), the XS–XL
 * size scale (square via `iconButtonSize`), round/square shape with a press
 * shape-morph, and a `--md-comp-icon-button-*` override layer. Like the common
 * button, **color is fixed per style**; `selected` (the MD3 toggle state) is
 * conveyed by the round→square shape-morph plus a per-style selected treatment
 * (standard swaps its icon to `primary`). Painted roles read a
 * `--md-comp-icon-button-*` token with a `--md-sys-*` fallback so apps can
 * re-theme. See docs/conventions/material-design.md.
 */
export const iconButtonVariants = cva(
  `${BASE} ${STATE_LAYER} ${FOCUS_RING} ${DISABLED} bg-[var(--md-comp-icon-button-container-color,var(--_bg))] text-[color:var(--md-comp-icon-button-icon-color,var(--_fg))]`,
  {
    variants: {
      variant: {
        standard:
          "[--_bg:transparent] [--_fg:var(--md-sys-color-on-surface-variant)] [--_state:var(--md-sys-color-on-surface-variant)] data-[selected]:[--_fg:var(--md-sys-color-primary)] data-[selected]:[--_state:var(--md-sys-color-primary)]",
        filled:
          "[--_bg:var(--md-sys-color-primary)] [--_fg:var(--md-sys-color-on-primary)] [--_state:var(--md-sys-color-on-primary)] hover:shadow-elevation-1",
        tonal:
          "[--_bg:var(--md-sys-color-secondary-container)] [--_fg:var(--md-sys-color-on-secondary-container)] [--_state:var(--md-sys-color-on-secondary-container)] hover:shadow-elevation-1",
        outlined:
          "border border-[color:var(--md-comp-icon-button-outline-color,var(--md-sys-color-outline))] [--_bg:transparent] [--_fg:var(--md-sys-color-on-surface-variant)] [--_state:var(--md-sys-color-on-surface-variant)] data-[selected]:border-transparent data-[selected]:[--_bg:var(--md-sys-color-inverse-surface)] data-[selected]:[--_fg:var(--md-sys-color-inverse-on-surface)] data-[selected]:[--_state:var(--md-sys-color-inverse-on-surface)]",
      },
      size: iconButtonSize,
      shape: {
        round: "",
        square: "",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: cornerCompounds,
    defaultVariants: {
      variant: "standard",
      size: "s",
      shape: "round",
      selected: false,
    },
  },
);
