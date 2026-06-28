import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type buttonVariants } from "./button.variants";

export type ButtonLoadingPosition = "start" | "center" | "end";

export interface ButtonProps
  // `color` is omitted from the native attrs — it's our palette variant instead.
  extends
    Omit<React.ComponentProps<"button">, "color">,
    VariantProps<typeof buttonVariants> {
  /** Render styles onto the child element (e.g. an `<a>`) via Radix `Slot`. */
  asChild?: boolean;
  /** Leading icon (ignored when `asChild`). */
  startIcon?: React.ReactNode;
  /** Trailing icon (ignored when `asChild`). */
  endIcon?: React.ReactNode;
  /** Show a spinner and block interaction without dimming the button. */
  loading?: boolean;
  /** Where the spinner sits relative to the label. Default `center`. */
  loadingPosition?: ButtonLoadingPosition;
  /** Override the default spinner. */
  loadingIndicator?: React.ReactNode;
}
