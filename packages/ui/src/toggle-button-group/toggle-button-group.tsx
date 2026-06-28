"use client";

import { useMemo } from "react";
import { ToggleGroup } from "radix-ui";
import { cn } from "@chatool/utils";

import { ToggleButtonGroupContext } from "./toggle-button-group.context";
import { toggleButtonGroupVariants } from "./toggle-button-group.variants";
import { type ToggleButtonGroupProps } from "./toggle-button-group.types";

const ToggleButtonGroup = ({
  className,
  color,
  size,
  children,
  ...props
}: ToggleButtonGroupProps) => {
  const shared = useMemo(() => ({ color, size }), [color, size]);

  return (
    <ToggleButtonGroupContext.Provider value={shared}>
      <ToggleGroup.Root
        data-slot="toggle-button-group"
        className={cn(
          toggleButtonGroupVariants({ orientation: props.orientation }),
          className,
        )}
        {...props}
      >
        {children}
      </ToggleGroup.Root>
    </ToggleButtonGroupContext.Provider>
  );
};

export default ToggleButtonGroup;
