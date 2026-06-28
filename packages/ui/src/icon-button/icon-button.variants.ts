import { cva } from "class-variance-authority";

import { BASE, DISABLED, FOCUS_RING, STATE_LAYER } from "../internal/classes";
import { colorPalette } from "../internal/colors";
import { iconSize, squareCorner } from "../internal/sizes";

/*
 * Material Design 3 icon button — four styles (standard / filled / tonal /
 * outlined), the XS–XL size scale, three widths, and round/square shape. When
 * used as a toggle (Radix `Toggle`, `data-state="on"`) it takes the filled look
 * and morphs round → square per the M3 Expressive spec.
 */
export const iconButtonVariants = cva(
  `${BASE} ${STATE_LAYER} ${FOCUS_RING} ${DISABLED} p-0 shrink-0 bg-[var(--md-comp-icon-button-container-color,var(--_bg))] text-[var(--md-comp-icon-button-icon-color,var(--_fg))] data-[state=on]:[--_bg:var(--_main)] data-[state=on]:[--_fg:var(--_on-main)] data-[state=on]:[--_state:var(--_on-main)]`,
  {
    variants: {
      variant: {
        standard:
          "[--_bg:transparent] [--_fg:var(--_main)] [--_state:var(--_main)]",
        filled:
          "[--_bg:var(--_main)] [--_fg:var(--_on-main)] [--_state:var(--_on-main)]",
        tonal:
          "[--_bg:var(--_container)] [--_fg:var(--_on-container)] [--_state:var(--_on-container)]",
        outlined:
          "border border-[var(--md-comp-icon-button-outline-color,var(--md-sys-color-outline))] [--_bg:transparent] [--_fg:var(--_main)] [--_state:var(--_main)] data-[state=on]:border-0",
      },
      color: colorPalette,
      size: iconSize,
      width: {
        default: "",
        narrow: "px-1.5 w-auto",
        wide: "px-5 w-auto",
      },
      shape: {
        round: "rounded-full",
        square: "",
      },
    },
    compoundVariants: [
      { shape: "square", size: "xs", class: squareCorner.xs },
      { shape: "square", size: "s", class: squareCorner.s },
      { shape: "square", size: "m", class: squareCorner.m },
      { shape: "square", size: "l", class: squareCorner.l },
      { shape: "square", size: "xl", class: squareCorner.xl },
      // Toggle shape-morph: a round icon button squares its corners when selected.
      {
        shape: "round",
        class: "data-[state=on]:rounded-[var(--md-sys-shape-corner-large)]",
      },
    ],
    defaultVariants: {
      variant: "standard",
      color: "primary",
      size: "s",
      width: "default",
      shape: "round",
    },
  },
);
