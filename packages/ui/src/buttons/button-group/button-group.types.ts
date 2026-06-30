import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type buttonGroupVariants } from "./button-group.variants";

export interface ButtonGroupProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof buttonGroupVariants> {
  /** Render styles onto the child element (e.g. a `<menu>`) via Radix `Slot`. */
  asChild?: boolean;
}
