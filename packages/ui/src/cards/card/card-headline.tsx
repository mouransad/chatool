import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type CardHeadlineProps } from "./card.types";
import { LINE_CLAMP, cardHeadlineVariants } from "./card.variants";

/**
 * MD3 card headline — the card's subject (an album, an article, a place).
 * Renders an `<h3>` so screen-reader users can jump between cards by heading;
 * use `asChild` to pick the level that fits your page outline. Put a
 * `CardPrimaryAction` inside it to make the whole card clickable.
 */
const CardHeadline = ({
  className,
  style,
  size,
  maxLines,
  asChild = false,
  ...props
}: CardHeadlineProps) => {
  const Comp = (asChild ? Slot.Root : "h3") as React.ElementType;

  return (
    <Comp
      data-slot="card-headline"
      className={cn(
        cardHeadlineVariants({ size }),
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

export default CardHeadline;
