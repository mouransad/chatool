"use client";

import { createContext } from "react";
import type * as React from "react";

/**
 * What a `RadioGroup` hands its radios. Only the facts a native
 * `<input type="radio">` can't learn from the DOM on its own live here; every
 * visual (color, label side, error, disabled) flows down through CSS instead,
 * so a server-rendered `Radio` shell never needs to read this.
 */
export interface RadioGroupContextValue {
  /** The shared native `name` — what makes the inputs one exclusive group. */
  name: string;
  /**
   * The controlled selection: a string selects the radio with that `value`,
   * `null` selects none. `undefined` means the group is uncontrolled.
   */
  value: string | null | undefined;
  /** The initially selected `value` of an uncontrolled group. */
  defaultValue: string | undefined;
  /** Marks every radio `required` (native "pick one" validation). */
  required: boolean | undefined;
  /** Associates every radio with a `<form>` by id. */
  form: string | undefined;
  /** Reports a user selection back to the group (`onValueChange`). */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * The radio-group context. Its own internal `tsdown` entry (no public subpath),
 * so the `radio` and `radio-group` bundles import **one** shared instance.
 */
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export default RadioGroupContext;
