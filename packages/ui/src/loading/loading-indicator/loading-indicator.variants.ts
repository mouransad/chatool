import { cva } from "class-variance-authority";

/*
 * Material 3 Expressive loading indicator. Painted roles read a
 * `--md-comp-loading-indicator-*` token first, then the variant's `--_*` local.
 * The default size is the spec's 48dp; sizes come from the `size` prop or any
 * `size-*` utility, and the 38/48 active-indicator ratio holds at all of them.
 */
export const loadingIndicatorVariants = cva(
  "size-12 motion-reduce:data-[indeterminate]:animate-pulse inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--md-comp-loading-indicator-container-color,var(--_bg))] fill-[var(--md-comp-loading-indicator-active-indicator-color,var(--_fg))]",
  {
    variants: {
      contained: {
        true: "[--_bg:var(--md-sys-color-primary-container)]",
        false: "[--_bg:transparent]",
      },
      color: {
        primary: "",
        inherit: "[--_fg:currentColor]",
      },
    },
    compoundVariants: [
      {
        contained: true,
        color: "primary",
        class: "[--_fg:var(--md-sys-color-on-primary-container)]",
      },
      {
        contained: false,
        color: "primary",
        class: "[--_fg:var(--md-sys-color-primary)]",
      },
    ],
    defaultVariants: { contained: false, color: "primary" },
  },
);
