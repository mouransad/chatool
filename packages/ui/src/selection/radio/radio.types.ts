import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type radioFieldVariants, type radioVariants } from "./radio.variants";

export interface RadioProps
  extends
    Omit<React.ComponentProps<"input">, "type" | "children" | "color" | "size">,
    VariantProps<typeof radioVariants>,
    VariantProps<typeof radioFieldVariants> {
  /**
   * Error state: `error` ring/dot and `aria-invalid="true"`. MD3 defines no
   * error radio; this mirrors the checkbox. Passing `aria-invalid` works the
   * same, and a `required` group the user leaves empty shows it by itself
   * (`:user-invalid`). Inside a `RadioGroup`, prefer the group's `error`.
   */
  error?: boolean;
  /**
   * Visible label. When set, the radio renders inside a `<label>` row so the
   * text names it and selects it too. Omit it for a bare radio and name it
   * with `aria-label` / `aria-labelledby` / your own `<label htmlFor>`.
   */
  label?: React.ReactNode;
  /**
   * Secondary text under the label (e.g. what the option costs or does),
   * wired to the input's `aria-describedby`. Turns `error` color while the
   * radio is invalid. Requires `label`.
   */
  supportingText?: React.ReactNode;
  /**
   * Classes for the radio control (the 48dp target). `className` goes on the
   * outermost element — the label row when `label` is set, otherwise the
   * control itself.
   */
  controlClassName?: string;
  /** Ref to the native `<input type="radio">` (forms, focus, validation). */
  ref?: React.Ref<HTMLInputElement>;
}
