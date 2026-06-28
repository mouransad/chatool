import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type fabVariants } from "./fab.variants";

export interface FabProps
  extends
    Omit<React.ComponentProps<"button">, "color">,
    VariantProps<typeof fabVariants> {
  /** Render styles onto the child element (e.g. an `<a>`) via Radix `Slot`. */
  asChild?: boolean;
  /** Show a spinner in place of the content and block interaction. */
  loading?: boolean;
  /** Override the default spinner. */
  loadingIndicator?: React.ReactNode;
}
