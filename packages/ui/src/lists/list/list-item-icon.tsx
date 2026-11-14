import { cn } from "@chatool/utils";

import { type ListItemIconProps } from "./list.types";
import { listItemIconVariants } from "./list.variants";

/**
 * A list item's **leading / trailing icon** box at the M3 Expressive 20dp
 * (`ItemLeadingIconExpressiveSize` / `ItemTrailingIconExpressiveSize`). The
 * icon fills it and takes the slot's color role (`on-surface-variant`, or the
 * selected / dragged / disabled role). Decorative by default (MD3: the icon is
 * a visual cue for the headline). Wrap it in a `Badge` to badge it.
 */
const ListItemIcon = ({
  className,
  decorative = true,
  ...props
}: ListItemIconProps) => (
  <span
    data-slot="list-item-icon"
    aria-hidden={decorative || undefined}
    className={cn(listItemIconVariants(), className)}
    {...props}
  />
);

export default ListItemIcon;
