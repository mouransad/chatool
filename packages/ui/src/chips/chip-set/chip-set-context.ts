"use client";

import { createContext } from "react";

/**
 * What a `ChipSet` hands its chips. Only behavior lives here (selection,
 * disabled, removal); every visual is CSS, so the server-rendered chip shell
 * never reads it — only the chip's client actions island does.
 */
export interface ChipSetContextValue {
  /** `true` when the set manages selection (`selectionMode` single/multiple). */
  selectable: boolean;
  /** Whether the chip with this `value` is selected in the set. */
  isSelected: (value: string) => boolean;
  /** Ask the set to select / deselect the chip with this `value`. */
  toggle: (value: string, selected: boolean) => void;
  /** Disables every chip in the set. */
  disabled: boolean;
  /** The set's removal callback (makes its input chips removable). */
  onRemove: ((value: string) => void) | undefined;
}

/**
 * The chip-set context. Its own internal `tsdown` entry (no public subpath), so
 * the `chip` actions island and the `chip-set` bundle import **one** shared
 * instance — and the DOM helpers below, which both need for keyboard focus.
 */
const ChipSetContext = createContext<ChipSetContextValue | null>(null);

export default ChipSetContext;

/** A chip container. */
export const CHIP_SELECTOR = "[data-slot=chip]";
/** A chip set root. */
export const CHIP_SET_SELECTOR = "[data-slot=chip-set]";

/** An element that can take keyboard focus right now. */
const FOCUSABLE =
  "button:not(:disabled), a[href], input:not(:disabled), [contenteditable=true]";

const focusable = (element: Element | null): element is HTMLElement =>
  element instanceof HTMLElement && element.matches(FOCUSABLE);

/** The chip's primary action, if it is focusable. */
export const getChipPrimary = (chip: Element) => {
  const primary = chip.querySelector(":scope > [data-slot=chip-primary]");
  return focusable(primary) ? primary : null;
};

/** The chip's remove action, if it is focusable. */
export const getChipRemove = (chip: Element) => {
  const remove = chip.querySelector(":scope > [data-slot=chip-remove]");
  return focusable(remove) ? remove : null;
};

/**
 * Where keyboard focus **enters** a chip: its primary action, or the remove
 * button of a remove-only chip. `null` for a disabled chip (skipped by arrow
 * keys; a soft-disabled chip stays focusable).
 */
export const getChipEntry = (chip: Element) =>
  getChipPrimary(chip) ?? getChipRemove(chip);

/** The chip's last focusable action (its remove button when it has one). */
export const getChipLast = (chip: Element) =>
  getChipRemove(chip) ?? getChipPrimary(chip);

/** The chips that belong to `root` (a nested set keeps its own). */
export const getChips = (root: Element) =>
  [...root.querySelectorAll<HTMLElement>(CHIP_SELECTOR)].filter(
    (chip) =>
      !root.matches(CHIP_SET_SELECTOR) ||
      chip.closest(CHIP_SET_SELECTOR) === root,
  );

/** Whether `key` moves forward in `element`'s writing direction. */
export const isForwardKey = (key: string, element: Element) =>
  getComputedStyle(element).direction === "rtl"
    ? key === "ArrowLeft"
    : key === "ArrowRight";

/** How long to wait for an app to actually unmount a removed chip. */
const REMOVAL_WAIT_MS = 5000;

/**
 * Run a removal and keep keyboard focus alive. If focus was inside `chip`, it
 * moves to the next chip (or the previous one when it was the last) as soon as
 * the app unmounts the chip — immediately, or after its own exit animation.
 * Nothing happens if the app keeps the chip or something else takes focus.
 */
export const removeChip = (chip: HTMLElement, run: () => void) => {
  const hadFocus = chip.contains(document.activeElement);
  const scope = chip.closest(CHIP_SET_SELECTOR) ?? chip.parentElement;
  const chips = scope ? getChips(scope) : [];
  const index = chips.indexOf(chip);
  const candidates = [
    ...chips.slice(index + 1),
    ...chips.slice(0, Math.max(index, 0)).reverse(),
  ];

  run();
  if (!hadFocus || index === -1) return;

  /** Returns `true` once there's nothing left to wait for. */
  const restore = () => {
    if (chip.isConnected) return false;
    const active = document.activeElement;
    // Focus already moved somewhere real (the app or the user did it).
    if (active && active !== document.body && active.isConnected) return true;
    for (const candidate of candidates) {
      const entry = candidate.isConnected ? getChipEntry(candidate) : null;
      if (entry) {
        entry.focus();
        break;
      }
    }
    return true;
  };

  if (restore()) return;
  const observer = new MutationObserver(() => {
    if (restore()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), REMOVAL_WAIT_MS);
};
