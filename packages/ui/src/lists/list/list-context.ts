"use client";

import { createContext } from "react";

/**
 * What a `List` hands its items. Only **behavior** lives here (listbox
 * selection, disabled); every visual travels by CSS, so server-rendered rows
 * never read it — only the option island (`list-item-option`) does.
 */
export interface ListContextValue {
  /** `true` when the list is a listbox (`selectionMode` single / multiple). */
  selectable: boolean;
  /** `true` for `selectionMode="multiple"`. */
  multiple: boolean;
  /** Disables every option. */
  disabled: boolean;
  /** Whether the option with this `value` is selected. */
  isSelected: (value: string) => boolean;
  /** Toggle the option with this `value` (or force it with `next`). */
  toggle: (value: string, next?: boolean) => void;
}

/**
 * The list context. Its own internal `tsdown` entry (no public subpath), so
 * the `list-item-option` island and the `list-root` bundle import **one**
 * shared instance — together with the DOM helpers below, which both need.
 */
const ListContext = createContext<ListContextValue | null>(null);

export default ListContext;

/** A list root. */
export const LIST_SELECTOR = "[data-slot=list]";

/** A top-level item of a list (a row, or an expandable item's wrapper). */
export const ITEM_SELECTOR = "[data-list-item]";

/** A row's headline (typeahead + announcements read its text). */
export const HEADLINE_SELECTOR = "[data-slot=list-item-headline]";

/** A row's selection-control slot. */
export const CONTROL_SELECTOR = "[data-slot=list-item-control]";

/** A reorder drag handle. */
export const HANDLE_SELECTOR = "[data-slot=list-item-drag-handle]";

/** Everything the roving tabindex can land on in a plain (non-listbox) list. */
const FOCUSABLE =
  "a[href],button,input:not([type=hidden]),select,textarea,summary,[contenteditable=true],[data-list-focusable]";

/** An element that can't take focus right now (or isn't on screen). */
const isUnavailable = (element: HTMLElement) => {
  if (element.matches(":disabled,[aria-disabled=true]")) return true;
  if (element.closest("[inert]")) return true;
  if (typeof element.checkVisibility === "function") {
    return !element.checkVisibility({ visibilityProperty: true });
  }
  return element.getClientRects().length === 0;
};

/** The list root an element belongs to (nested lists keep their own keys). */
export const ownerList = (element: Element) =>
  element.closest<HTMLElement>(LIST_SELECTOR);

/**
 * Where arrow keys move, in reading order: the options of a listbox, or every
 * enabled, visible action of a plain list (primary actions, secondary icon
 * buttons, controls, `<summary>` rows, drag handles — MD3's multi-action
 * order). Items of a nested list belong to that list.
 */
export const getTargets = (root: HTMLElement, listbox: boolean) => {
  const candidates = root.querySelectorAll<HTMLElement>(
    listbox ? "[role=option]" : FOCUSABLE,
  );
  const targets: HTMLElement[] = [];
  for (const element of candidates) {
    if (ownerList(element) !== root || isUnavailable(element)) continue;
    targets.push(element);
  }
  return targets;
};

/** A target that marks its row as the list's "current" one (gets the stop). */
export const isCurrentTarget = (element: HTMLElement) =>
  element.matches(
    "[aria-selected=true],[aria-current]:not([aria-current=false]),input:checked",
  ) || element.closest("[data-selected=true]") !== null;

/** Text inputs keep their arrow / Home / End / letter keys. */
export const isTextEntry = (element: EventTarget | null) =>
  element instanceof HTMLElement &&
  (element.isContentEditable ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    (element instanceof HTMLInputElement &&
      !/^(checkbox|radio|button|submit|reset|image|range|color|file)$/.test(
        element.type,
      )));

/** The top-level items of a list (dividers excluded), in DOM order. */
export const getItems = (root: HTMLElement) =>
  [...root.children].filter((child): child is HTMLElement =>
    child.matches(ITEM_SELECTOR),
  );

/** A plain-text label for an item (typeahead, announcements). */
export const getItemLabel = (item: HTMLElement, index: number) =>
  item.dataset.textValue ??
  item.querySelector(HEADLINE_SELECTOR)?.textContent?.trim() ??
  `Item ${index + 1}`;
