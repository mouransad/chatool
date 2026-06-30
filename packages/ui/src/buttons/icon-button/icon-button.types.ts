import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type iconButtonVariants } from "./icon-button.variants";

export interface IconButtonProps
  extends
    Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof iconButtonVariants> {
  /** The icon glyph (a single `@chatool/icons` element). Pass `aria-label` too. */
  children?: React.ReactNode;
  /**
   * MD3 toggle state. When set (`true`/`false`) the button becomes a toggle:
   * it reflects `aria-pressed`, a round shape morphs to square while selected,
   * and `selectedIcon` (if given) replaces the icon. Omit for a plain button.
   */
  selected?: boolean;
  /** Icon shown when `selected` is `true` (defaults to `children`). */
  selectedIcon?: React.ReactNode;
  /** Render styles onto the child element (e.g. an `<a>`) via Radix `Slot`. */
  asChild?: boolean;
  /** Show a spinner and block interaction without dimming the button. */
  loading?: boolean;
  /** Override the default spinner. */
  loadingIndicator?: React.ReactNode;
}
