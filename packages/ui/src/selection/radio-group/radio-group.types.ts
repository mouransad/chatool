import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type radioGroupVariants } from "./radio-group.variants";

export interface RadioGroupProps
  extends
    Omit<React.ComponentProps<"fieldset">, "color" | "defaultValue" | "form">,
    VariantProps<typeof radioGroupVariants> {
  /**
   * The native `name` shared by every radio (submitted with the form). One is
   * generated when omitted, so the radios are always one exclusive group.
   */
  name?: string;
  /**
   * Controlled selection: the `value` of the selected radio, or `null` for
   * none. Pair it with `onValueChange`.
   */
  value?: string | null;
  /** Uncontrolled initial selection. MD3: pre-select one option when you can. */
  defaultValue?: string;
  /**
   * Called with the newly selected radio's `value` when the user picks one
   * (click, tap, Space, or an arrow key).
   */
  onValueChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /**
   * Native "pick one" validation: the form can't submit until a radio is
   * selected. Also sets `aria-required` on the group, and an empty group the
   * user tried to submit turns `error` by itself (`:user-invalid`).
   */
  required?: boolean;
  /**
   * Disables every radio (native `<fieldset disabled>`): out of the tab
   * order, not submitted, MD3's 38% treatment.
   */
  disabled?: boolean;
  /** Error state for the whole group: `aria-invalid` + `error` colors. */
  error?: boolean;
  /**
   * Visible group title, rendered as the `<legend>` and used as the group's
   * accessible name. Omit it and pass `aria-label` / `aria-labelledby` instead.
   */
  label?: React.ReactNode;
  /**
   * Text under the options (a hint, or why the group is invalid), wired to the
   * group's `aria-describedby`.
   */
  supportingText?: React.ReactNode;
  /** Associates every radio with a `<form>` elsewhere in the document, by id. */
  form?: string;
  /** Classes for the element that wraps the radios (the flex flow). */
  itemsClassName?: string;
}
