"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type Ref,
} from "react";

import {
  CHIP_SELECTOR,
  type ChipSetContextValue,
  getChipEntry,
  getChipLast,
  getChips,
  isForwardKey,
} from "./chip-set-context";
import { type ChipSetSelectionMode } from "./chip-set.types";

interface UseLogicOptions {
  selectionMode: ChipSetSelectionMode;
  value: string | string[] | null | undefined;
  defaultValue: string | string[] | null | undefined;
  onValueChange: ((value: never) => void) | undefined;
  required: boolean;
  disabled: boolean;
  onRemove: ((value: string) => void) | undefined;
  loop: boolean;
  ref: Ref<HTMLDivElement> | undefined;
}

const toList = (value: string | string[] | null | undefined): string[] =>
  value === undefined || value === null
    ? []
    : Array.isArray(value)
      ? value
      : [value];

/** Every action element a chip renders (focusable or not). */
const ACTIONS =
  ":scope > [data-slot=chip-primary], :scope > [data-slot=chip-remove]";

/**
 * `ChipSet` behavior: selection state (controlled or not), the WAI-ARIA APG
 * **toolbar** keyboard model, and a **roving tabindex** so the whole set is a
 * single Tab stop. All focus work is imperative on the DOM the chips render
 * (`data-slot` hooks), so chips stay server-rendered shells and nothing
 * re-renders while focus moves.
 */
export const useLogic = ({
  selectionMode,
  value,
  defaultValue,
  onValueChange,
  required,
  disabled,
  onRemove,
  loop,
  ref,
}: UseLogicOptions) => {
  const multiple = selectionMode === "multiple";
  const selectable = selectionMode !== "none";
  const controlled = value !== undefined;

  const [ownValue, setOwnValue] = useState<string[]>(() =>
    toList(defaultValue),
  );
  const selected = controlled ? toList(value) : ownValue;

  const rootRef = useRef<HTMLDivElement | null>(null);
  /** The action that owns the set's Tab stop. */
  const stopRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const context = useMemo<ChipSetContextValue>(
    () => ({
      selectable,
      disabled,
      onRemove,
      isSelected: (chipValue) => selected.includes(chipValue),
      toggle: (chipValue, next) => {
        const has = selected.includes(chipValue);
        if (has === next) return;
        let list: string[];
        if (next) list = multiple ? [...selected, chipValue] : [chipValue];
        else {
          // `required`: the last selected chip can't be deselected.
          if (required && selected.length <= 1) return;
          list = selected.filter((item) => item !== chipValue);
        }
        if (!controlled) setOwnValue(list);
        const report = onValueChange as
          | ((value: string[] | string | null) => void)
          | undefined;
        report?.(multiple ? list : (list[0] ?? null));
      },
    }),
    [
      selectable,
      disabled,
      onRemove,
      selected,
      multiple,
      required,
      controlled,
      onValueChange,
    ],
  );

  /**
   * Roving tabindex: exactly one action in the set is tabbable. It's the
   * focused action, else the last one that had focus (a remove button hands
   * the stop back to its chip's primary action), else the first selected chip
   * (APG: focus the selected item), else the first enabled chip.
   */
  const syncTabStop = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const chips = getChips(root);
    const active = document.activeElement;

    let stop: HTMLElement | null = null;
    const focusedChip =
      active instanceof HTMLElement && root.contains(active)
        ? active.closest<HTMLElement>(CHIP_SELECTOR)
        : null;
    if (focusedChip && chips.includes(focusedChip))
      stop = active as HTMLElement;

    if (!stop) {
      const remembered = stopRef.current;
      const chip = remembered?.closest(CHIP_SELECTOR);
      if (
        remembered?.isConnected &&
        chip &&
        chips.includes(chip as HTMLElement)
      )
        stop = getChipEntry(chip);
    }
    if (!stop) {
      const first =
        chips.find(
          (chip) =>
            chip.querySelector(":scope > [data-selected]") &&
            getChipEntry(chip),
        ) ?? chips.find((chip) => getChipEntry(chip));
      stop = first ? getChipEntry(first) : null;
    }

    for (const chip of chips) {
      for (const action of chip.querySelectorAll<HTMLElement>(ACTIONS)) {
        const tabIndex = action === stop ? 0 : -1;
        if (action.tabIndex !== tabIndex) action.tabIndex = tabIndex;
      }
    }
    stopRef.current = stop;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    syncTabStop();
    // Chips come and go (input chips), get disabled or selected: re-pick the
    // stop. `tabindex` itself isn't observed, so syncing never loops.
    const observer = new MutationObserver(syncTabStop);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled", "data-selected"],
    });
    return () => observer.disconnect();
  }, [syncTabStop]);

  const onFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) syncTabStop();
    },
    [syncTabStop],
  );

  const onBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget;
      if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
        // Leaving the set: a remove button gives the stop back to its chip.
        queueMicrotask(syncTabStop);
      }
    },
    [syncTabStop],
  );

  /**
   * APG toolbar keys. ←/→ (mirrored in RTL) walk every action in reading
   * order: forward lands on the next chip's primary action, backward on the
   * previous chip's last action (its remove button), like Material Web. Home /
   * End jump to the first / last chip. Disabled chips are skipped; soft-disabled
   * chips stay reachable. Moves *inside* a chip (primary ⇄ remove) are handled
   * by the chip itself before the event bubbles here.
   */
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const { key } = event;
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (key !== "ArrowLeft" &&
          key !== "ArrowRight" &&
          key !== "Home" &&
          key !== "End")
      ) {
        return;
      }
      const root = event.currentTarget;
      const current = (event.target as Element).closest<HTMLElement>(
        CHIP_SELECTOR,
      );
      const chips = getChips(root).filter(
        (chip) => chip === current || getChipEntry(chip),
      );
      // Only chips' own actions navigate (a text field in the set keeps its keys).
      if (!current || !chips.includes(current)) return;

      const first = chips[0];
      const last = chips[chips.length - 1];
      let target: HTMLElement | null = null;
      if (key === "Home") target = first ? getChipEntry(first) : null;
      else if (key === "End") target = last ? getChipLast(last) : null;
      else {
        const forward = isForwardKey(key, root);
        const from = chips.indexOf(current);
        let to = from + (forward ? 1 : -1);
        if (to < 0 || to >= chips.length) {
          if (!loop) return;
          to = (to + chips.length) % chips.length;
        }
        const next = chips[to];
        if (to === from || !next) return;
        target = forward ? getChipEntry(next) : getChipLast(next);
      }
      if (!target || target === document.activeElement) return;
      event.preventDefault();
      target.focus();
    },
    [loop],
  );

  return { context, selected, setRef, onFocus, onBlur, onKeyDown };
};
