import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type ButtonGroupProps } from "./button-group.types";
import { buttonGroupVariants } from "./button-group.variants";

/**
 * MD3 Expressive button group — an invisible container that arranges its `Button`
 * / `IconButton` children and adds the group interaction. This module carries
 * **no client directive**: the interaction is pure CSS, so it's a Server-Component
 * layout (works in any framework) that owns no selection state — each child keeps
 * its own `selected` / `aria-pressed`.
 *
 * - **standard** — children stay flexible; **pressing one expands it and compresses
 *   its neighbors** (the Expressive squish), all in CSS.
 * - **connected** — a tight 2dp cluster. Children keep their own default radius;
 *   the **selected** child morphs via its own smooth round→square animation. A
 *   single-/multi-select segmented control is just a connected group of toggle
 *   buttons. The group never overrides a child's border-radius, so the morph stays
 *   smooth (between finite radii).
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
