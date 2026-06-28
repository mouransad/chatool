import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type iconButtonVariants } from "./icon-button.variants";

export interface IconButtonProps
  extends
    Omit<React.ComponentProps<"button">, "color">,
    VariantProps<typeof iconButtonVariants> {
  /** Render styles onto the child element (e.g. an `<a>`) via Radix `Slot`. */
  asChild?: boolean;
  /** Show a spinner in place of the icon and block interaction. */
  loading?: boolean;
  /** Override the default spinner. */
  loadingIndicator?: React.ReactNode;
  /** Controlled selected state — turns it into a toggle icon button. */
  selected?: boolean;
  /** Uncontrolled initial selected state — turns it into a toggle. */
  defaultSelected?: boolean;
  /** Called when the toggle selection changes. */
  onSelectedChange?: (selected: boolean) => void;
}
