/*
 * Shared button-family color palette.
 *
 * The `color` prop sets four generic local vars from the MD3 system tokens; each
 * component's `variant` then picks which to paint with (filled → `--_main`,
 * tonal → `--_container`, …). This collapses variant×color into `variants + colors`
 * classes — pure CSS, zero runtime. See docs/conventions/material-design.md.
 */
export type ButtonColor = "primary" | "secondary" | "tertiary" | "error";

export const colorPalette: Record<ButtonColor, string> = {
  primary:
    "[--_main:var(--md-sys-color-primary)] [--_on-main:var(--md-sys-color-on-primary)] [--_container:var(--md-sys-color-primary-container)] [--_on-container:var(--md-sys-color-on-primary-container)]",
  secondary:
    "[--_main:var(--md-sys-color-secondary)] [--_on-main:var(--md-sys-color-on-secondary)] [--_container:var(--md-sys-color-secondary-container)] [--_on-container:var(--md-sys-color-on-secondary-container)]",
  tertiary:
    "[--_main:var(--md-sys-color-tertiary)] [--_on-main:var(--md-sys-color-on-tertiary)] [--_container:var(--md-sys-color-tertiary-container)] [--_on-container:var(--md-sys-color-on-tertiary-container)]",
  error:
    "[--_main:var(--md-sys-color-error)] [--_on-main:var(--md-sys-color-on-error)] [--_container:var(--md-sys-color-error-container)] [--_on-container:var(--md-sys-color-on-error-container)]",
};
