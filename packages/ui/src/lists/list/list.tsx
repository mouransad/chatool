import { cn } from "@chatool/utils";

import ListRoot from "./list-root";
import { type ListProps } from "./list.types";
import { listVariants } from "./list.variants";

/**
 * MD3 Expressive **list** — "continuous, vertical indexes of text and
 * images". A thin, directive-free wrapper: it resolves the variant classes on
 * the server and hands them to `ListRoot`, the `"use client"` island that owns
 * the behavior (roving tabindex, keyboard, listbox selection, reordering).
 *
 * - **Styles** (`variant`): `standard` — flush rows, transparent at rest so the
 *   list drops onto any surface; `segmented` — 2dp gaps between filled
 *   `surface-container` rows with 16dp outer / 4dp inner corners. Both share
 *   the M3 Expressive shape morph (4 → 12dp hovered → 16dp focused / pressed /
 *   selected / dragged) on the fast-spatial spring.
 * - **Selection** (`selectionMode`): `"none"` (`role="list"`, items are
 *   non-interactive, single-action or multi-action, or carry their own
 *   Checkbox / Radio / Switch) — or `"single"` / `"multiple"`, the MD3 web
 *   **listbox** of `option`s with `value` / `defaultValue` / `onValueChange`,
 *   typeahead, Shift / Ctrl + A, `required` and form `name`.
 * - **Keyboard** (MD3): one Tab stop (the selected item, else the first), ↑↓←→
 *   between every action with wrap-around, Home / End, Space / Enter.
 * - **Reorder** (`reorderable` + `onReorder`), **density**, **dividers**.
 *
 * Give a listbox an accessible name that describes its selection
 * (`aria-label` / `aria-labelledby`), per MD3: "container label: should
 * describe selection type".
 */
const List = ({
  className,
  variant,
  density,
  dividers,
  ...props
}: ListProps) => (
  <ListRoot
    {...(props as Omit<ListProps, "density" | "dividers">)}
    variant={variant ?? "standard"}
    className={cn(
      listVariants({
        variant,
        density: density === undefined ? undefined : `${density}`,
        dividers,
      }),
      className,
    )}
  />
);

export default List;
