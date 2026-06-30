import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type buttonVariants } from "./button.variants";

export type ButtonLoadingPosition = "start" | "center" | "end";

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render styles onto the child element (e.g. an `<a>`) via Radix `Slot`. */
  asChild?: boolean;
  /** Leading icon (ignored when `asChild`). */
  startIcon?: React.ReactNode;
  /** Trailing icon (ignored when `asChild`). */
  endIcon?: React.ReactNode;
  /**
   * MD3 toggle state. When set (`true`/`false`) the button becomes a toggle:
   * it reflects `aria-pressed`, a round shape morphs to square while selected,
   * `outlined` fills with inverse-surface, and `selectedIcon` (if given) replaces
   * the leading icon. Keep the label constant across the toggle; omit for a plain
   * button.
   */
  selected?: boolean;
  /** Leading icon shown when `selected` is `true` (defaults to `startIcon`). */
  selectedIcon?: React.ReactNode;
  /** Show a spinner and block interaction without dimming the button. */
  loading?: boolean;
  /** Where the spinner sits relative to the label. Default `center`. */
  loadingPosition?: ButtonLoadingPosition;
  /** Override the default spinner. */
  loadingIndicator?: React.ReactNode;
}
