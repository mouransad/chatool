import type * as React from "react";

import type { ListDensity, ListVariant } from "../config";

export type { ListDensity, ListVariant } from "../config";

/** How a `List` manages selection. `"none"` = a plain list (`role="list"`). */
export type ListSelectionMode = "none" | "single" | "multiple";

/** What a list does with the arrow keys. */
export type ListNavigation = "roving" | "tab";

/** Where a row's selection control sits. */
export type ListItemControlPosition = "start" | "end";

/** How a row aligns its leading / trailing content on the cross axis. */
export type ListItemAlign = "auto" | "center" | "top";

/** What moved, reported by `onReorder`. */
export interface ListReorderEvent {
  /** Index the item started at (among the list's items, dividers excluded). */
  from: number;
  /** Index it should move to. Apply it with `arrayMove(items, from, to)`. */
  to: number;
  /** The moved item's `value`, when it has one. */
  value: string | undefined;
  /** What moved it. */
  source: "pointer" | "keyboard";
}

/**
 * Screen-reader messages for reordering. Each receives the item's label (its
 * `textValue` or headline text) and its 1-based position / the item count.
 */
export interface ListReorderAnnouncements {
  /** Picked up with the keyboard. */
  grab?: (label: string, position: number, total: number) => string;
  /** Moved one step. */
  move?: (label: string, position: number, total: number) => string;
  /** Dropped. */
  drop?: (label: string, position: number, total: number) => string;
  /** Cancelled (Escape) — back where it started. */
  cancel?: (label: string, position: number, total: number) => string;
  /** The drag handle's usage hint (`aria-describedby`). */
  instructions?: string;
}

interface ListBaseProps extends Omit<
  React.ComponentProps<"ul">,
  "defaultValue" | "onChange"
> {
  /**
   * MD3 Expressive list style — a visual choice that never changes behavior.
   * `standard` (default): flush items, transparent at rest. `segmented`: 2dp
   * gaps, `surface-container` items with 16dp outer / 4dp inner corners.
   */
  variant?: ListVariant;
  /**
   * MD3 density step: `0` (default), `-1`, `-2`, `-3` — each takes 4dp off
   * every item's height (desktop / pointer-dense layouts). Inherited by items.
   */
  density?: ListDensity;
  /**
   * Draw a 1dp `outline-variant` divider between items (16dp insets). MD3:
   * limit dividers to **uncontained** (standard) lists — segmented lists use
   * their gaps. For a single divider use `ListDivider`.
   */
  dividers?: boolean;
  /**
   * Keyboard model. `"roving"` (default, MD3): the list is **one** Tab stop —
   * the selected item, else the first — and ↑↓←→ move between every action in
   * reading order (wrapping), Home / End jump to the ends, Space / Enter
   * activate. `"tab"`: leave the browser's Tab order alone (each action is its
   * own Tab stop). A `listbox` (`selectionMode`) is always roving.
   */
  navigation?: ListNavigation;
  /** Wrap from the last item to the first (and back). Default `true` (MD3). */
  loop?: boolean;
  /**
   * Make the items reorderable: drag a `ListItemDragHandle` (pointer / touch),
   * or focus it and press Space / Enter to pick the item up, ↑ / ↓ to move it,
   * Space / Enter to drop, Escape to cancel. Alt + ↑ / ↓ on any focused item
   * moves it one step. The list never reorders itself — apply `onReorder`.
   */
  reorderable?: boolean;
  /** Called when an item is dropped in a new place (see `reorderable`). */
  onReorder?: (event: ListReorderEvent) => void;
  /** Override / translate the reorder screen-reader messages. */
  reorderAnnouncements?: ListReorderAnnouncements;
  /**
   * Disables the whole list: a listbox's options turn `aria-disabled`; any
   * other list becomes `inert` (no pointer, no focus) and dims its rows.
   */
  disabled?: boolean;
  /**
   * Render onto your own list element via Radix `Slot` (e.g. `<ol>`) — it
   * receives the list's props, classes and behavior; its children are the
   * items.
   */
  asChild?: boolean;
  /** Ref to the list element. */
  ref?: React.Ref<HTMLUListElement>;
}

/** A plain list: non-interactive, single-action or multi-action items. */
interface ListNoSelectionProps extends ListBaseProps {
  /** How the list manages selection. Default `"none"` (`role="list"`). */
  selectionMode?: "none";
  value?: never;
  defaultValue?: never;
  onValueChange?: never;
  required?: never;
  selectionFollowsFocus?: never;
  name?: never;
  form?: never;
}

interface ListSelectableProps extends ListBaseProps {
  /**
   * Keep at least one item selected: the last selected item can't be
   * deselected, and an empty list blocks form submission (`name`).
   */
  required?: boolean;
  /**
   * Submit the selection with a `<form>`: one hidden `<input name value>` per
   * selected item.
   */
  name?: string;
  /** Associates the hidden inputs with a `<form>` elsewhere, by id. */
  form?: string;
}

/**
 * A single-select list — `role="listbox"` of `option`s (MD3 web). Items need
 * a `value`.
 */
interface ListSingleProps extends ListSelectableProps {
  /** One item at a time; selecting another moves the selection. */
  selectionMode: "single";
  /** Controlled selection: the selected item's `value`, or `null`. */
  value?: string | null;
  /** Uncontrolled initial selection. */
  defaultValue?: string | null;
  /** Called with the new selection (`null` when it's cleared). */
  onValueChange?: (value: string | null) => void;
  /**
   * Move the selection with the focus (APG "selection follows focus") instead
   * of waiting for Space / Enter / a click.
   */
  selectionFollowsFocus?: boolean;
}

/**
 * A multi-select list — `role="listbox"` + `aria-multiselectable`. Space /
 * Enter / click toggle, Shift + ↑ / ↓ extend, Ctrl / ⌘ + A selects all.
 */
interface ListMultipleProps extends ListSelectableProps {
  /** Every item toggles independently. */
  selectionMode: "multiple";
  /** Controlled selection: the selected items' `value`s. */
  value?: string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string[];
  /** Called with the new selection. */
  onValueChange?: (value: string[]) => void;
  selectionFollowsFocus?: never;
}

export type ListProps =
  | ListNoSelectionProps
  | ListSingleProps
  | ListMultipleProps;

/** Per-part class overrides for a row. */
export interface ListItemClassNames {
  /** The primary action / label / content element. */
  content?: string;
  /** The leading slot. */
  leading?: string;
  /** The text column. */
  text?: string;
  /** The overline. */
  overline?: string;
  /** The headline. */
  headline?: string;
  /** The supporting text. */
  supportingText?: string;
  /** The trailing slot. */
  trailing?: string;
  /** The trailing supporting text. */
  trailingSupportingText?: string;
  /** The selection-control slot. */
  control?: string;
}

/** The content props shared by `ListItem` and `ListItemExpandable`. */
export interface ListItemContentProps {
  /**
   * The headline (MD3 "label text") — body-large. Also accepted as
   * `headline`.
   */
  children?: React.ReactNode;
  /** The headline, when you'd rather not pass it as `children`. */
  headline?: React.ReactNode;
  /** Text above the headline — label-small, `on-surface-variant`. */
  overline?: React.ReactNode;
  /**
   * Secondary text under the headline — body-medium, `on-surface-variant`.
   * MD3: keep it to one to three lines (see `supportingTextLines`).
   */
  supportingText?: React.ReactNode;
  /**
   * Meta text at the trailing edge (a price, count, date, shortcut) —
   * label-small.
   */
  trailingSupportingText?: React.ReactNode;
  /**
   * The leading element: a `ListItemIcon`, `ListItemAvatar`, `ListItemImage`,
   * `ListItemVideo`, a bare `<svg>` (sized to 20dp for you), a `Badge`-
   * anchored icon, …
   */
  leading?: React.ReactNode;
  /**
   * The trailing element: a `ListItemIcon`, an `IconButton` (a secondary
   * action — it stays separately clickable), a `Badge`, a
   * `ListItemDragHandle`, …
   */
  trailing?: React.ReactNode;
  /**
   * Line count for the min height (56 / 72 / 88dp) and the top alignment of
   * three-line rows. Derived from `overline` / `supportingText` /
   * `supportingTextLines`; set it when composing custom content.
   */
  lines?: 1 | 2 | 3;
  /**
   * Cross-axis alignment. `"auto"` (default): centred, top-aligned for three
   * lines (Compose's breakpoint).
   */
  align?: ListItemAlign;
  /** Truncate the headline after this many lines (with an ellipsis). */
  headlineLines?: number;
  /**
   * Truncate the supporting text after this many lines (MD3: one to three).
   * `2` or more also makes the row three-line.
   */
  supportingTextLines?: number;
  /** Per-part class overrides. */
  classNames?: ListItemClassNames;
}

export interface ListItemProps
  extends
    Omit<
      React.ComponentProps<"li">,
      "children" | "onClick" | "value" | "title" | "type"
    >,
    ListItemContentProps {
  /**
   * Make the row a **link** (single-action list): the whole row navigates.
   * Pair with `target` / `rel` through `actionProps`.
   */
  href?: string;
  /**
   * Make the row a **button** (single-action list): the whole row runs it.
   * A trailing `IconButton` stays a separate, secondary action
   * (multi-action list).
   */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** The button's `type` (makes the row a button). Default `"button"`. */
  type?: "button" | "submit" | "reset";
  /**
   * Render the primary action onto your single child — e.g.
   * `<ListItem asChild><Link href="/inbox">Inbox</Link></ListItem>` (the
   * child's children become the headline).
   */
  asChild?: boolean;
  /**
   * Extra props for the primary action element (`aria-*`, `target`, `rel`,
   * `form`, `formAction`, `data-*`, a `ref`, …).
   */
  actionProps?: Record<string, unknown> & { ref?: React.Ref<HTMLElement> };
  /**
   * A selection control — `<Checkbox />`, `<Radio />` or `<Switch />` from
   * `@chatool/ui`. The row becomes its `<label>`: the whole row toggles the
   * native input, the headline + supporting text name it, it submits with a
   * form, and a checked control selects the row (MD3). Its own state layer /
   * ripple / focus ring defer to the row's.
   */
  control?: React.ReactElement;
  /**
   * Which edge the control sits on. Default `"start"` (MD3 / Compose:
   * leading checkbox or radio); use `"end"` for a switch or a trailing
   * checkbox.
   */
  controlPosition?: ListItemControlPosition;
  /**
   * MD3 **selected** state (`secondary-container`, 16dp corners). On a link /
   * button row it also sets `aria-current` (`"page"` / `"true"`). A control
   * row is selected while its control is checked — pass `false` to opt out
   * (e.g. a settings switch). In a listbox the list owns selection.
   */
  selected?: boolean;
  /**
   * MD3 disabled state: content at 38%, no state layer. Disables the action /
   * the control / the option.
   */
  disabled?: boolean;
  /**
   * MD3 **dragged** state (`tertiary-container`, elevation 4) — for your own
   * drag-and-drop; `reorderable` lists set it for you.
   */
  dragged?: boolean;
  /**
   * The item's identity: makes it an `option` in a `selectionMode` list, and
   * reports it in `onReorder`.
   */
  value?: string;
  /**
   * Plain-text label for typeahead and reorder announcements when the
   * headline isn't plain text.
   */
  textValue?: string;
  /** Ref to the `<li>`. */
  ref?: React.Ref<HTMLLIElement>;
}

export interface ListItemExpandableProps
  extends
    Omit<
      React.ComponentProps<"li">,
      "children" | "onToggle" | "title" | "value"
    >,
    Omit<ListItemContentProps, "children"> {
  /** The headline (MD3 "label text") of the expanding row. */
  headline: React.ReactNode;
  /** The nested items revealed when expanded (`ListItem`s, dividers, …). */
  children?: React.ReactNode;
  /** Controlled open state (keep it in sync from `onOpenChange`). */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Called when the row expands / collapses. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Replace the Expressive chevron-in-a-circle indicator (or `false` to hide
   * it).
   */
  expandIcon?: React.ReactNode;
  /**
   * MD3 disabled state: content at 38%, and the row can't toggle or take
   * focus (`inert` + `aria-disabled` — a `<summary>` has no native
   * `disabled`).
   */
  disabled?: boolean;
  /** Plain-text label for reorder announcements. */
  textValue?: string;
  /** Item identity reported in `onReorder`. */
  value?: string;
  /** Ref to the wrapper `<li>`. */
  ref?: React.Ref<HTMLLIElement>;
}

export interface ListItemIconProps extends React.ComponentProps<"span"> {
  /**
   * Hide the icon from assistive tech. Default `true` — list icons are
   * decorative cues next to the headline (MD3).
   */
  decorative?: boolean;
}

export interface ListItemAvatarProps extends React.ComponentProps<"span"> {
  /** Image source; omit for a monogram (`children`). */
  src?: string;
  /** Image alt text. Default `""` (decorative — the headline names the row). */
  alt?: string;
  /** Extra props for the `<img>` (`srcSet`, `loading`, …). */
  imgProps?: React.ComponentProps<"img">;
}

export interface ListItemImageProps extends React.ComponentProps<"span"> {
  /** Image source; or pass your own `<img>` / `<Image>` as `children`. */
  src?: string;
  /** Image alt text. Default `""` (decorative). */
  alt?: string;
  /** Extra props for the `<img>`. */
  imgProps?: React.ComponentProps<"img">;
}

export interface ListItemVideoProps extends React.ComponentProps<"span"> {
  /** MD3 thumbnail size: `small` 100×56dp (default) or `large` 114×64dp. */
  size?: "small" | "large";
  /** A thumbnail image source; or pass a `<video>` / `<img>` as `children`. */
  src?: string;
  /** Thumbnail alt text. Default `""` (decorative). */
  alt?: string;
  /** Extra props for the `<img>`. */
  imgProps?: React.ComponentProps<"img">;
}

export interface ListItemDragHandleProps extends Omit<
  React.ComponentProps<"button">,
  "type"
> {
  /** Accessible label. Default `"Reorder"`. */
  label?: string;
  /** Replace the `drag_handle` glyph. */
  icon?: React.ReactNode;
}

export interface ListDividerProps extends React.ComponentProps<"li"> {
  /**
   * MD3 divider inset. Default `"middle"` (Compose's 16dp / 16dp list divider
   * space); `"none"` spans the full width.
   */
  inset?: "none" | "start" | "end" | "middle";
  /** Divider weight. Default `"regular"` (1dp). */
  weight?: "regular" | "heavy";
  /**
   * `true` (default): decorative (`role="none"`). `false`: a real separator
   * between groups.
   */
  decorative?: boolean;
}
