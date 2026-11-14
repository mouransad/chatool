import { cn } from "@chatool/utils";

import { type ListItemVideoProps } from "./list.types";
import { listItemVideoVariants } from "./list.variants";

/**
 * A list item's **leading video** thumbnail — MD3's small 100×56dp or large
 * 114×64dp frame (`ItemSmallLeadingVideo*` / `ItemLargeLeadingVideo*`) with
 * `corner-small` corners. Holds a `<video>` or a thumbnail `<img>` (cover-
 * fitted) plus any overlay you add (a duration badge, a play glyph). MD3:
 * "leading video thumbnails can open a video player or even play within the
 * list".
 */
const ListItemVideo = ({
  className,
  size,
  src,
  alt = "",
  imgProps,
  children,
  ...props
}: ListItemVideoProps) => (
  <span
    data-slot="list-item-video"
    className={cn(listItemVideoVariants({ size }), className)}
    {...props}
  >
    {src === undefined ? null : (
      <img src={src} alt={alt} draggable={false} {...imgProps} />
    )}
    {children}
  </span>
);

export default ListItemVideo;
