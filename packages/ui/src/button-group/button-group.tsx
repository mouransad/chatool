"use client";

import { useMemo } from "react";
import { cn } from "@chatool/utils";

import { ButtonGroupContext } from "../internal/group-context";
import { buttonGroupVariants } from "./button-group.variants";
import { type ButtonGroupProps } from "./button-group.types";

const ButtonGroup = ({
  className,
  orientation,
  variant,
  buttonVariant,
  color,
  size,
  children,
  ...props
}: ButtonGroupProps) => {
  const shared = useMemo(
    () => ({ variant: buttonVariant, color, size }),
    [buttonVariant, color, size],
  );

  return (
    <ButtonGroupContext.Provider value={shared}>
      <div
        role="group"
        data-slot="button-group"
        className={cn(buttonGroupVariants({ orientation, variant }), className)}
        {...props}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
};

export default ButtonGroup;
