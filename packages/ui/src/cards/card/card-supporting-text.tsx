import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type CardSupportingTextProps } from "./card.types";
import { CARD_SUPPORTING_TEXT, LINE_CLAMP } from "./card.variants";

/**
 * MD3 card supporting text — body content such as an article summary. MD3
 * cards don't scroll internally: clamp long text with `maxLines` and reveal the
 * rest by expanding the card or navigating to its detail view.
 */
const CardSupportingText = ({
  className,
  style,
  maxLines,
  asChild = false,
  ...props
}: CardSupportingTextProps) => {
  const Comp = (asChild ? Slot.Root : "p") as React.ElementType;

  return (
    <Comp
      data-slot="card-supporting-text"
      className={cn(
        CARD_SUPPORTING_TEXT,
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

export default CardSupportingText;
