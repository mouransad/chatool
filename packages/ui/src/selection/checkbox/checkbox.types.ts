import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import {
  type checkboxFieldVariants,
  type checkboxVariants,
} from "./checkbox.variants";

export interface CheckboxProps
  extends
    Omit<React.ComponentProps<"input">, "type" | "children" | "color" | "size">,
    VariantProps<typeof checkboxVariants>,
    VariantProps<typeof checkboxFieldVariants> {
  /**
   * MD3 indeterminate ("mixed") state — e.g. a parent whose children are only
   * partly checked. It's visual **and** semantic (sets the native
   * `input.indeterminate`, announced as "mixed"). Treat it as controlled: the
   * browser clears it on click, and the component restores it from this prop
   * until you change it — so update it in `onChange`.
   */
  indeterminate?: boolean;
  /**
   * MD3 error state: `error` outline/container and `aria-invalid="true"`.
   * Passing `aria-invalid` yourself works the same, and a `required` box the
   * user leaves unchecked shows it automatically (`:user-invalid`).
   */
  error?: boolean;
  /**
   * Visible label. When set, the checkbox renders inside a `<label>` row so the
   * text names it and toggles it too. Omit it for a bare checkbox and name it
   * with `aria-label` / `aria-labelledby` / your own `<label htmlFor>`.
   */
  label?: React.ReactNode;
  /**
   * Secondary text under the label, wired to the input's `aria-describedby`.
   * Turns `error` color while the checkbox is invalid. Requires `label`.
   */
  supportingText?: React.ReactNode;
  /**
   * Classes for the checkbox control (the 48dp target). `className` goes on the
   * outermost element — the label row when `label` is set, otherwise the
   * control itself (both get it then).
   */
  controlClassName?: string;
  /** Ref to the native `<input type="checkbox">` (forms, focus, validation). */
  ref?: React.Ref<HTMLInputElement>;
}
