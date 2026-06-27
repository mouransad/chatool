import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type buttonVariants } from "./button.variants";

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
