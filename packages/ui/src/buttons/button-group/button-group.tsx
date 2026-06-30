import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type ButtonGroupProps } from "./button-group.types";
import { buttonGroupVariants } from "./button-group.variants";

/**
 * MD3 button group — an invisible container that spaces and shapes its `Button` /
 * `IconButton` children. This module carries **no client directive**: it's a pure
 * props→JSX layout container (Server-Component-safe, works in any framework) and
 * owns no selection state — each child keeps its own `selected` / `aria-pressed`.
 *
 * Accessibility: the container is a **`role="group"`** so assistive tech announces
 * the buttons as one set; pass `aria-label` (or `aria-labelledby`) to name it.
 * Each child stays an individual Tab stop (no roving focus), so keyboard users
 * Tab through the buttons as usual.
 */
const ButtonGroup = ({
  className,
  variant,
  orientation,
  asChild = false,
  ...props
}: ButtonGroupProps) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="button-group"
      role="group"
      className={cn(buttonGroupVariants({ variant, orientation }), className)}
      {...props}
    />
  );
};

export default ButtonGroup;
