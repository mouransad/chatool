"use client";

import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};

export default Button;
