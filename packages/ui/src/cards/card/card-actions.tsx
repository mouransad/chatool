import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type CardActionsProps } from "./card.types";
import { cardActionsVariants } from "./card.variants";

/**
 * MD3 card actions — buttons ("Learn more", "Add to cart"), icon buttons,
 * chips or other controls. Keep them few (MD3 examples use one or two) and put
 * them on a **container** card: an action never sits on an actionable surface
 * unless it's lifted above a stretched `CardPrimaryAction`.
 */
const CardActions = ({
  className,
  align,
  asChild = false,
  ...props
}: CardActionsProps) => {
  const Comp = (asChild ? Slot.Root : "div") as React.ElementType;

  return (
    <Comp
      data-slot="card-actions"
      className={cn(cardActionsVariants({ align }), className)}
      {...props}
    />
  );
};

export default CardActions;
