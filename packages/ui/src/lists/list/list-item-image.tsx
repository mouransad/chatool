import { cn } from "@chatool/utils";

import { type ListItemImageProps } from "./list.types";
import { listItemImageVariants } from "./list.variants";

/**
 * A list item's **leading image** (thumbnail) — 56dp with the M3 Expressive
 * `corner-small` (8dp, `ItemLeadingImageExpressiveShape`) corners, cover-
 * fitted. Pass `src` or your own `<img>` / framework `<Image>` as `children`.
 */
const ListItemImage = ({
  className,
  src,
  alt = "",
  imgProps,
  children,
  ...props
}: ListItemImageProps) => (
  <span
    data-slot="list-item-image"
    className={cn(listItemImageVariants(), className)}
    {...props}
  >
    {src === undefined ? (
      children
    ) : (
      <img src={src} alt={alt} draggable={false} {...imgProps} />
    )}
  </span>
);

export default ListItemImage;
