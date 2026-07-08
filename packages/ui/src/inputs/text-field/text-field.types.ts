import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type textFieldVariants } from "./text-field.variants";

export interface TextFieldProps
  extends
    Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof textFieldVariants> {
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
  /** Optional character count (e.g. current length or custom string like "12/50") to show on the right of the supporting line. */
  characterCount?: string | number;
  /** Render styles onto the child element (e.g. a `<textarea>`) via Radix `Slot`. */
  asChild?: boolean;
}
