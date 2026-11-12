import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type CardSubheadProps } from "./card.types";
import { CARD_SUBHEAD, LINE_CLAMP } from "./card.variants";

/** MD3 card subhead — a byline, a tagged location, a price, a timestamp. */
const CardSubhead = ({
  className,
  style,
  maxLines,
  asChild = false,
  ...props
}: CardSubheadProps) => {
  const Comp = (asChild ? Slot.Root : "p") as React.ElementType;

  return (
    <Comp
      data-slot="card-subhead"
      className={cn(
        CARD_SUBHEAD,
        maxLines !== undefined && LINE_CLAMP,
        className,
      )}
      style={
        maxLines === undefined
          ? style
          : ({ ...style, "--_c-lines": maxLines } as React.CSSProperties)
      }
      {...props}
    />
  );
};

export default CardSubhead;
