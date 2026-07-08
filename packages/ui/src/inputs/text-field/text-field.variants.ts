import { cva } from "class-variance-authority";

import { CONTAINER_BASE, CONTAINER_DISABLED } from "../config";

/*
 * Material Design 3 TextField variants.
 * Supports filled and outlined styles, with error, size, and disabled states.
 * Customization is supported via `--md-comp-text-field-*` variables falling back to global `--md-sys-*`.
 */
export const textFieldVariants = cva(
  `${CONTAINER_BASE} ${CONTAINER_DISABLED} text-[color:var(--md-comp-text-field-text-color,var(--md-sys-color-on-surface))]`,
  {
    variants: {
      variant: {
        filled:
          "border-b border-b-[color:var(--md-comp-text-field-outline-color,var(--md-sys-color-on-surface-variant))] bg-[var(--md-comp-text-field-container-color,var(--md-sys-color-surface-container-highest))] focus-within:border-b-2 focus-within:border-b-[color:var(--md-comp-text-field-focus-color,var(--md-sys-color-primary))] hover:border-b-[color:var(--md-sys-color-on-surface)]",
        outlined:
          "border border-[color:var(--md-comp-text-field-outline-color,var(--md-sys-color-outline))] focus-within:border-2 focus-within:border-[color:var(--md-comp-text-field-focus-color,var(--md-sys-color-primary))] hover:border-[color:var(--md-sys-color-on-surface)]",
      },
      size: {
        xs: "h-10 rounded-t-md text-body-medium",
        s: "h-14 rounded-t-lg text-body-large",
      },
      error: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "outlined",
        size: "xs",
        class: "rounded-md",
      },
      {
        variant: "outlined",
        size: "s",
        class: "rounded-lg",
      },
      // Error states
      {
        variant: "filled",
        error: true,
        class:
          "border-b-[color:var(--md-comp-text-field-error-color,var(--md-sys-color-error))] focus-within:border-b-[color:var(--md-comp-text-field-error-color,var(--md-sys-color-error))] hover:border-b-[color:var(--md-comp-text-field-error-color,var(--md-sys-color-error))]",
      },
      {
        variant: "outlined",
        error: true,
        class:
          "border-[color:var(--md-comp-text-field-error-color,var(--md-sys-color-error))] focus-within:border-[color:var(--md-comp-text-field-error-color,var(--md-sys-color-error))] hover:border-[color:var(--md-comp-text-field-error-color,var(--md-sys-color-error))]",
      },
    ],
    defaultVariants: {
      variant: "filled",
      size: "s",
      error: false,
    },
  },
);
