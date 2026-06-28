import { cva } from "class-variance-authority";

import { BASE, DISABLED, FOCUS_RING, STATE_LAYER } from "../internal/classes";

/*
 * Material Design 3 Floating Action Button. Container colors use the *-container
 * roles (or surface-container-high for the surface FAB); three sizes plus an
 * `extended` form with a label; `lowered` drops the resting elevation. Painted
 * roles read `--md-comp-fab-*` first. See docs/conventions/material-design.md.
 */
export const fabVariants = cva(
  `${BASE} ${STATE_LAYER} ${FOCUS_RING} ${DISABLED} bg-[var(--md-comp-fab-container-color,var(--_bg))] text-[var(--md-comp-fab-icon-color,var(--_fg))] shadow-elevation-3 hover:shadow-elevation-4`,
  {
    variants: {
      color: {
        primary:
          "[--_bg:var(--md-sys-color-primary-container)] [--_fg:var(--md-sys-color-on-primary-container)] [--_main:var(--md-sys-color-primary)] [--_state:var(--md-sys-color-on-primary-container)]",
        secondary:
          "[--_bg:var(--md-sys-color-secondary-container)] [--_fg:var(--md-sys-color-on-secondary-container)] [--_main:var(--md-sys-color-secondary)] [--_state:var(--md-sys-color-on-secondary-container)]",
        tertiary:
          "[--_bg:var(--md-sys-color-tertiary-container)] [--_fg:var(--md-sys-color-on-tertiary-container)] [--_main:var(--md-sys-color-tertiary)] [--_state:var(--md-sys-color-on-tertiary-container)]",
        surface:
          "[--_bg:var(--md-sys-color-surface-container-high)] [--_fg:var(--md-sys-color-primary)] [--_main:var(--md-sys-color-primary)] [--_state:var(--md-sys-color-primary)]",
      },
      size: {
        sm: "size-10 [&_svg]:size-6 rounded-md",
        md: "size-14 [&_svg]:size-6 rounded-lg",
        lg: "size-24 [&_svg]:size-9 rounded-xl",
      },
      extended: {
        true: "gap-3 px-5 w-auto text-label-large",
      },
      lowered: {
        true: "shadow-elevation-1 hover:shadow-elevation-2",
      },
    },
    compoundVariants: [
      // Extended FABs keep their height but grow horizontally for the label.
      { extended: true, size: "sm", class: "h-10 size-auto" },
      { extended: true, size: "md", class: "h-14 size-auto" },
      { extended: true, size: "lg", class: "h-24 size-auto" },
    ],
    defaultVariants: {
      color: "primary",
      size: "md",
    },
  },
);
