import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type inputVariants } from "./input.variants";

export interface InputProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** The floating label text. */
  label?: string;
  /** Leading icon (ignored when `asChild`). */
  startIcon?: React.ReactNode;
  /** Trailing icon (ignored when `asChild`). */
  endIcon?: React.ReactNode;
  /** Supporting text displayed below the field. */
  helperText?: string;
  /** Error text displayed below the field (shown only when error is true). */
  errorText?: string;
  /** Render styles onto the child element (e.g. a `<textarea>`) via Radix `Slot`. */
  asChild?: boolean;
}
