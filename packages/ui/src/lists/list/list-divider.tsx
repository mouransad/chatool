import { cn } from "@chatool/utils";

import Divider from "../../dividers/divider/divider";
import { type ListDividerProps } from "./list.types";
import { LIST_DIVIDER } from "./list.variants";

/**
 * A **divider between list items** — the `@chatool/ui` `Divider` rendered as
 * an `<li>` (so the list stays valid markup) with Compose's list divider space
 * (`ListTokens.DividerLeadingSpace` / `DividerTrailingSpace`, 16dp each →
 * `inset="middle"`). Decorative by default (`role="none"`); pass
 * `decorative={false}` for a real separator between groups. MD3: limit
 * dividers to uncontained lists — a segmented list separates with its gaps.
 * Dividers never break a segmented list's outer corners or the arrow keys.
 */
const ListDivider = ({
  className,
  inset = "middle",
  weight,
  decorative = true,
  ...props
}: ListDividerProps) => (
  <Divider
    asChild
    inset={inset === "none" ? undefined : inset}
    weight={weight}
    decorative={decorative}
  >
    <li
      data-slot="list-divider"
      className={cn(LIST_DIVIDER, className)}
      {...props}
    />
  </Divider>
);

export default ListDivider;
