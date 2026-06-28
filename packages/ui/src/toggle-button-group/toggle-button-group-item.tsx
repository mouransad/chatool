"use client";

import { ToggleGroup } from "radix-ui";
import { cn } from "@chatool/utils";

import { useToggleButtonGroup } from "./toggle-button-group.context";
import { toggleButtonItemVariants } from "./toggle-button-group.variants";
import { type ToggleButtonGroupItemProps } from "./toggle-button-group.types";

const ToggleButtonGroupItem = ({
  className,
  children,
  ...props
}: ToggleButtonGroupItemProps) => {
  const { color, size } = useToggleButtonGroup();

  return (
    <ToggleGroup.Item
      data-slot="toggle-button-group-item"
      className={cn(toggleButtonItemVariants({ color, size }), className)}
      {...props}
    >
      {/* Leading check, revealed when the item is selected (M3 segmented look). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="hidden group-data-[state=on]:block"
      >
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
      {children}
    </ToggleGroup.Item>
  );
};

export default ToggleButtonGroupItem;
