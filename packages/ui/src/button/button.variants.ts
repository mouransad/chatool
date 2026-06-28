import { cva } from "class-variance-authority";

import { BASE, DISABLED, FOCUS_RING, STATE_LAYER } from "../internal/classes";
import { colorPalette } from "../internal/colors";
import { labelSize, squareCorner } from "../internal/sizes";

/*
 * Material Design 3 common button. The `color` prop sets the palette (`--_main`
 * / `--_container` / …); the `variant` picks which roles to paint with; painted
 * roles read a `--md-comp-button-*` token first (per-component override) and fall
 * back to the computed value. State layer, focus ring, and disabled treatment
 * come from the shared fragments. See docs/conventions/material-design.md.
 */
export const buttonVariants = cva(
  `${BASE} ${STATE_LAYER} ${FOCUS_RING} ${DISABLED} bg-[var(--md-comp-button-container-color,var(--_bg))] text-[var(--md-comp-button-label-text-color,var(--_fg))]`,
  {
    variants: {
      variant: {
        filled:
          "[--_bg:var(--_main)] [--_fg:var(--_on-main)] [--_state:var(--_on-main)] hover:shadow-elevation-1",
        tonal:
          "[--_bg:var(--_container)] [--_fg:var(--_on-container)] [--_state:var(--_on-container)] hover:shadow-elevation-1",
        elevated:
          "shadow-elevation-1 [--_bg:var(--md-sys-color-surface-container-low)] [--_fg:var(--_main)] [--_state:var(--_main)] hover:shadow-elevation-2",
        outlined:
          "border border-[var(--md-comp-button-outline-color,var(--md-sys-color-outline))] [--_bg:transparent] [--_fg:var(--_main)] [--_state:var(--_main)]",
        text: "[--_bg:transparent] [--_fg:var(--_main)] [--_state:var(--_main)]",
      },
      color: colorPalette,
      size: labelSize,
      shape: {
        round: "rounded-full",
        square: "",
      },
      fullWidth: {
        true: "w-full",
      },
      disableElevation: {
        true: "shadow-none hover:shadow-none",
      },
    },
    compoundVariants: [
      { shape: "square", size: "xs", class: squareCorner.xs },
      { shape: "square", size: "s", class: squareCorner.s },
      { shape: "square", size: "m", class: squareCorner.m },
      { shape: "square", size: "l", class: squareCorner.l },
      { shape: "square", size: "xl", class: squareCorner.xl },
    ],
    defaultVariants: {
      variant: "filled",
      color: "primary",
      size: "s",
      shape: "round",
    },
  },
);
