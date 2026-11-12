import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type CardContentProps } from "./card.types";
import { CARD_CONTENT } from "./card.variants";

/**
 * MD3 card content block — groups the headline, subhead and supporting text.
 * It grows to fill the card, so the actions of equal-height cards in a grid
 * line up along the bottom.
 */
const CardContent = ({
  className,
  asChild = false,
  ...props
}: CardContentProps) => {
  const Comp = (asChild ? Slot.Root : "div") as React.ElementType;

  return (
    <Comp
      data-slot="card-content"
      className={cn(CARD_CONTENT, className)}
      {...props}
    />
  );
};

export default CardContent;
