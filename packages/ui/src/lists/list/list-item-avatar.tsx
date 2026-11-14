import { cn } from "@chatool/utils";

import { type ListItemAvatarProps } from "./list.types";
import { listItemAvatarVariants } from "./list.variants";

/**
 * A list item's **leading avatar** — 40dp, `corner-full`, `primary-container`
 * with a title-medium `on-primary-container` monogram (`children`), or a
 * cover-fitted image (`src`). MD3: "use an expressive, circular avatar to
 * represent a person or entity". The monogram is hidden from assistive tech —
 * the headline already names the row.
 */
const ListItemAvatar = ({
  className,
  src,
  alt = "",
  imgProps,
  children,
  ...props
}: ListItemAvatarProps) => (
  <span
    data-slot="list-item-avatar"
    className={cn(listItemAvatarVariants(), className)}
    {...props}
  >
    {src === undefined ? (
      <span aria-hidden>{children}</span>
    ) : (
      <img src={src} alt={alt} draggable={false} {...imgProps} />
    )}
  </span>
);

export default ListItemAvatar;
