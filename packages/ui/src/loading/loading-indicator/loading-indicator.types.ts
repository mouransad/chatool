import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type loadingIndicatorVariants } from "./loading-indicator.variants";

export interface LoadingIndicatorProps
  extends
    Omit<React.ComponentProps<"div">, "color">,
    VariantProps<typeof loadingIndicatorVariants> {
  /**
   * Current progress. Omit for the indeterminate seven-shape loop; set it to scrub
   * the circle → burst morph by hand, e.g. while pulling to refresh.
   */
  value?: number;
  /** The `value` that means complete. Defaults to `100`. */
  max?: number;
  /** Width and height in px, clamped to the spec's 24–240. Defaults to `48`. */
  size?: number;
}
