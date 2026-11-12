import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type CardMediaProps } from "./card.types";
import { cardMediaVariants } from "./card.variants";

/**
 * MD3 card media — a thumbnail, image, illustration or video. **Full-bleed** by
 * default: it cancels the card padding on every edge it touches (orientation-
 * and position-aware) and the card's clip rounds its outer corners. `inset`
 * keeps the padding and gives it an optically-round radius instead.
 *
 * MD3's reading order puts the **heading before the image**; keep that in the
 * DOM and lift the media visually with `placement="first"`. Decorative images
 * take `alt=""`; images that carry content (a product, a color) need real alt
 * text. Avoid text over images — if you must, add a scrim for contrast.
 */
const CardMedia = ({
  className,
  inset,
  placement,
  asChild = false,
  ...props
}: CardMediaProps) => {
  const Comp = (asChild ? Slot.Root : "div") as React.ElementType;

  return (
    <Comp
      data-slot="card-media"
      className={cn(cardMediaVariants({ inset, placement }), className)}
      {...props}
    />
  );
};

export default CardMedia;
