import { cn } from "@chatool/utils";

import { type ListItemDragHandleProps } from "./list.types";
import { listItemDragHandleVariants } from "./list.variants";

/** Material Symbols `drag_handle` (960 grid). */
const DRAG_HANDLE = "M160-360v-80h640v80H160Zm0-160v-80h640v80H160Z";

/**
 * The **reorder handle** of an item in a `reorderable` `List` — the MD3
 * `drag_handle` glyph in a 40dp round target. A **Server Component** (a plain
 * `<button>`): the list delegates every pointer and key event to it, so the
 * handle needs no client code of its own. Drag it with a pointer / finger, or
 * focus it and press Space / Enter to pick the item up, ↑ / ↓ to move, Space /
 * Enter to drop and Escape to cancel; the list announces each step and points
 * the handle's `aria-describedby` at the instructions.
 */
const ListItemDragHandle = ({
  className,
  label = "Reorder",
  icon,
  ...props
}: ListItemDragHandleProps) => (
  <button
    type="button"
    data-slot="list-item-drag-handle"
    aria-label={label}
    className={cn(listItemDragHandleVariants(), className)}
    {...props}
  >
    {icon ?? (
      <svg
        viewBox="0 -960 960 960"
        fill="currentColor"
        aria-hidden
        focusable="false"
      >
        <path d={DRAG_HANDLE} />
      </svg>
    )}
  </button>
);

export default ListItemDragHandle;
