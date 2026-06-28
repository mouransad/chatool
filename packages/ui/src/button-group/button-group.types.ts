import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type ButtonColor } from "../internal/colors";
import { type ButtonSize } from "../internal/sizes";
import { type ButtonVariant } from "../internal/group-context";
import { type buttonGroupVariants } from "./button-group.variants";

export interface ButtonGroupProps
  extends
    Omit<React.ComponentProps<"div">, "color">,
    VariantProps<typeof buttonGroupVariants> {
  /** Button style shared with children that don't set their own `variant`. */
  buttonVariant?: ButtonVariant;
  /** Color shared with children that don't set their own `color`. */
  color?: ButtonColor;
  /** Size shared with children that don't set their own `size`. */
  size?: ButtonSize;
}
