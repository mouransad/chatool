import { cva } from "class-variance-authority";

import {
  BASE,
  DISABLED,
  FOCUS_RING,
  STATE_LAYER,
  type ButtonSize,
  labelSize,
  pressCorner,
  squareCorner,
} from "../config";

const SIZES: ButtonSize[] = ["xs", "s", "m", "l", "xl"];

/**
 * Per (shape × size) corners: `round` rests as a pill (`rounded-full` on the
 * shape variant) and presses to `pressCorner.round`; `square` rests at
 * `squareCorner` and presses to the smaller `pressCorner.square`.
 */
const cornerCompounds = SIZES.flatMap((size) => [
  { shape: "round" as const, size, class: pressCorner.round[size] },
  {
    shape: "square" as const,
    size,
    class: `${squareCorner[size]} ${pressCorner.square[size]}`,
  },
]);

/*
 * Material Design 3 common button. Per the MD3 spec, **color is fixed per style**
 * (filled → primary, tonal → secondary container, elevated → surface +
 * primary, outlined/text → primary) — there is no free color choice. Five sizes
 * (XS–XL), round/square shape with a press shape-morph, and a per-component
 * `--md-comp-button-*` override layer. See docs/conventions/material-design.md.
 */
export const buttonVariants = cva(
  `${BASE} ${STATE_LAYER} ${FOCUS_RING} ${DISABLED} bg-[var(--md-comp-button-container-color,var(--_bg))] text-[color:var(--md-comp-button-label-text-color,var(--_fg))]`,
  {
    variants: {
      variant: {
        filled:
          "[--_bg:var(--md-sys-color-primary)] [--_fg:var(--md-sys-color-on-primary)] [--_state:var(--md-sys-color-on-primary)] hover:shadow-elevation-1",
        tonal:
          "[--_bg:var(--md-sys-color-secondary-container)] [--_fg:var(--md-sys-color-on-secondary-container)] [--_state:var(--md-sys-color-on-secondary-container)] hover:shadow-elevation-1",
        elevated:
          "shadow-elevation-1 [--_bg:var(--md-sys-color-surface-container-low)] [--_fg:var(--md-sys-color-primary)] [--_state:var(--md-sys-color-primary)] hover:shadow-elevation-2",
        outlined:
          "border border-[color:var(--md-comp-button-outline-color,var(--md-sys-color-outline))] [--_bg:transparent] [--_fg:var(--md-sys-color-primary)] [--_state:var(--md-sys-color-primary)]",
        text: "[--_bg:transparent] [--_fg:var(--md-sys-color-primary)] [--_state:var(--md-sys-color-primary)]",
      },
      size: labelSize,
      shape: {
        round: "rounded-full",
        square: "",
      },
    },
    compoundVariants: cornerCompounds,
    defaultVariants: {
      variant: "filled",
      size: "s",
      shape: "round",
    },
  },
);
