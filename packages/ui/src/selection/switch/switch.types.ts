import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import {
  type switchFieldVariants,
  type switchVariants,
} from "./switch.variants";

export interface SwitchProps
  extends
    Omit<
      React.ComponentProps<"input">,
      "type" | "role" | "children" | "color" | "size"
    >,
    VariantProps<typeof switchVariants>,
    VariantProps<typeof switchFieldVariants> {
  /**
   * MD3's icon configurations: `false` (none), `"selected"` (a check on the
   * selected handle only) or `true` (a check when on, a close "×" when off).
   * Defaults to `false`, or to what `selectedIcon` / `unselectedIcon` imply.
   */
  icons?: boolean | "selected" | null;
  /** Replaces the selected (on) icon — any node, e.g. an `@chatool/icons` icon. */
  selectedIcon?: React.ReactNode;
  /** Replaces the unselected (off) icon. Implies `icons` when that's unset. */
  unselectedIcon?: React.ReactNode;
  /**
   * Called with the new state whenever the user toggles the switch (click,
   * tap, drag, Space or Enter) — Compose's `onCheckedChange`. Runs after
   * `onChange`, which still receives the native event.
   */
  onCheckedChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /**
   * Visible label — what the switch turns on. When set, the switch renders
   * inside a `<label>` row so the text names it and toggles it too. Keep it
   * constant when the state changes (APG). Omit it for a bare switch and name
   * it with `aria-label` / `aria-labelledby` / your own `<label htmlFor>`.
   */
  label?: React.ReactNode;
  /**
   * Secondary text under the label, wired to the input's `aria-describedby`.
   * Requires `label`.
   */
  supportingText?: React.ReactNode;
  /**
   * Classes for the switch control (the track box). `className` goes on the
   * outermost element — the label row when `label` is set, otherwise the
   * control itself.
   */
  controlClassName?: string;
  /** Ref to the native `<input type="checkbox" role="switch">`. */
  ref?: React.Ref<HTMLInputElement>;
}
