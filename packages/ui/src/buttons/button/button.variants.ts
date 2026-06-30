import { cva } from "class-variance-authority";

import {
  BASE,
  DISABLED,
  FOCUS_RING,
  STATE_LAYER,
  type ButtonSize,
  labelSize,
  pressCorner,
  roundCorner,
  squareCorner,
} from "../config";

const SIZES: ButtonSize[] = ["xs", "s", "m", "l", "xl"];

/**
 * Per (shape × selected × size) corners: an unselected `round` rests at the
 * finite half-height pill `roundCorner` (not `rounded-full`, which can't
 * transition smoothly) and presses to `pressCorner.round`; `square` rests at
 * `squareCorner` and presses to the smaller `pressCorner.square`. **MD3 toggle
 * morph:** a selected `round` button squares off (rests at `squareCorner`) to
 * signal the "on" state — the resting radius itself flips, interpolating smoothly
 * via BASE's `border-radius` transition.
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
 * Material Design 3 common button. Per the MD3 spec, **color is fixed per style**
 * (filled → primary, tonal → secondary container, elevated → surface +
 * primary, outlined/text → primary) — there is no free color choice. Five sizes
 * (XS–XL), round/square shape with a press shape-morph, an MD3 `selected` toggle
 * (round→square morph; `outlined` fills with inverse-surface, mirroring the icon
 * button), and a per-component `--md-comp-button-*` override layer. See
 * docs/conventions/material-design.md.
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
          "border border-[color:var(--md-comp-button-outline-color,var(--md-sys-color-outline))] [--_bg:transparent] [--_fg:var(--md-sys-color-primary)] [--_state:var(--md-sys-color-primary)] data-[selected]:border-transparent data-[selected]:[--_bg:var(--md-sys-color-inverse-surface)] data-[selected]:[--_fg:var(--md-sys-color-inverse-on-surface)] data-[selected]:[--_state:var(--md-sys-color-inverse-on-surface)]",
        text: "[--_bg:transparent] [--_fg:var(--md-sys-color-primary)] [--_state:var(--md-sys-color-primary)]",
      },
      size: labelSize,
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
      variant: "filled",
      size: "s",
      shape: "round",
      selected: false,
    },
  },
);
