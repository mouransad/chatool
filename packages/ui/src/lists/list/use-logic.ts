"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as React from "react";

import {
  type ListContextValue,
  getItemLabel,
  getTargets,
  isCurrentTarget,
  isTextEntry,
} from "./list-context";
import { type ListNavigation, type ListSelectionMode } from "./list.types";

/** How long typed letters keep adding to one typeahead search (APG). */
const TYPEAHEAD_TIMEOUT = 500;

interface UseLogicOptions {
  selectionMode: ListSelectionMode;
  value: string | string[] | null | undefined;
  defaultValue: string | string[] | null | undefined;
  onValueChange: ((value: never) => void) | undefined;
  required: boolean;
  disabled: boolean;
  selectionFollowsFocus: boolean;
  navigation: ListNavigation;
  loop: boolean;
  ref: React.Ref<HTMLUListElement> | undefined;
}

const toList = (value: string | string[] | null | undefined): string[] =>
  value === undefined || value === null
    ? []
    : Array.isArray(value)
      ? value
      : [value];

/** Whether ←/→ should be mirrored (RTL): → then means "previous". */
const isRtl = (element: Element) =>
  getComputedStyle(element).direction === "rtl";

/**
 * `List` behavior: listbox selection (controlled or not), the **roving
 * tabindex** that makes the list one Tab stop, and the MD3 / WAI-ARIA APG
 * keyboard model. All focus work is imperative on the DOM the items render
 * (`role="option"`, native actions), so server-rendered rows stay server-
 * rendered and nothing re-renders while focus moves.
 *
 * Keys (MD3 lists › accessibility › keyboard navigation + APG listbox):
 *
 * - **↓ / →** next, **↑ / ←** previous (mirrored in RTL), wrapping by default;
 *   **Home / End** first / last. In a plain list they walk every action in
 *   reading order — primary actions, secondary icon buttons, controls,
 *   `<summary>` rows — which is MD3's multi-action order.
 * - **Space / Enter** activate: native for links / buttons / switches /
 *   `<summary>`; Enter also toggles a checkbox / radio row (MD3), and in a
 *   listbox both toggle the focused option.
 * - Listbox extras: **typeahead**, **Shift + ↑ / ↓** (multiple: move and
 *   toggle), **Ctrl / ⌘ + A** (multiple: select all / none), and
 *   `selectionFollowsFocus` (single).
 */
export const useLogic = ({
  selectionMode,
  value,
  defaultValue,
  onValueChange,
  required,
  disabled,
  selectionFollowsFocus,
  navigation,
  loop,
  ref,
}: UseLogicOptions) => {
  const multiple = selectionMode === "multiple";
  const selectable = selectionMode !== "none";
  const roving = selectable || navigation === "roving";
  const controlled = value !== undefined;

  const [ownValue, setOwnValue] = useState<string[]>(() =>
    toList(defaultValue),
  );
  const selected = controlled ? toList(value) : ownValue;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const rootRef = useRef<HTMLUListElement | null>(null);
  /** The target that owns the list's Tab stop. */
  const stopRef = useRef<HTMLElement | null>(null);
  const typeahead = useRef({ text: "", timer: 0 });

  const setRef = useCallback(
    (node: HTMLUListElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  /** Report a new selection (and keep it, when uncontrolled). */
  const commit = useCallback(
    (list: string[]) => {
      if (!controlled) setOwnValue(list);
      selectedRef.current = list;
      const report = onValueChange as
        | ((value: string[] | string | null) => void)
        | undefined;
      report?.(multiple ? list : (list[0] ?? null));
    },
    [controlled, multiple, onValueChange],
  );

  const toggle = useCallback(
    (item: string, next?: boolean) => {
      if (disabled) return;
      const current = selectedRef.current;
      const has = current.includes(item);
      const want = next ?? !has;
      if (want === has) return;
      if (want) {
        commit(multiple ? [...current, item] : [item]);
      } else {
        // `required`: the last selected item can't be deselected.
        if (required && current.length <= 1) return;
        commit(current.filter((entry) => entry !== item));
      }
    },
    [commit, disabled, multiple, required],
  );

  const context = useMemo<ListContextValue>(
    () => ({
      selectable,
      multiple,
      disabled,
      isSelected: (item) => selected.includes(item),
      toggle,
    }),
    [disabled, multiple, selectable, selected, toggle],
  );

  /**
   * Roving tabindex: exactly one target is tabbable — the focused one, else
   * the last one that had focus, else the selected / current / checked one
   * (MD3: "focus should go to the selected list item"), else the first.
   */
  const syncTabStop = useCallback(() => {
    const root = rootRef.current;
    if (!root || !roving) return;
    const targets = getTargets(root, selectable);
    const active = document.activeElement;
    let stop: HTMLElement | null = null;
    if (active instanceof HTMLElement && targets.includes(active))
      stop = active;
    if (!stop && stopRef.current && targets.includes(stopRef.current)) {
      stop = stopRef.current;
    }
    if (!stop) stop = targets.find(isCurrentTarget) ?? targets[0] ?? null;
    // Every candidate (even unavailable ones) leaves the Tab order but `stop`.
    for (const target of targets) {
      const tabIndex = target === stop ? 0 : -1;
      if (target.tabIndex !== tabIndex) target.tabIndex = tabIndex;
    }
    stopRef.current = stop;
  }, [roving, selectable]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !roving) return;
    syncTabStop();
    // Rows come and go, open / close (`<details>`), get disabled or selected:
    // re-pick the stop. `tabindex` itself isn't observed, so it never loops.
    const observer = new MutationObserver(syncTabStop);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "disabled",
        "aria-disabled",
        "aria-selected",
        "aria-current",
        "data-selected",
        "open",
        "inert",
      ],
    });
    root.addEventListener("change", syncTabStop);
    return () => {
      observer.disconnect();
      root.removeEventListener("change", syncTabStop);
    };
  }, [roving, syncTabStop]);

  // A controlled selection change moves the stop to the new selection only
  // when the list doesn't have focus.
  useEffect(() => {
    if (!rootRef.current?.contains(document.activeElement)) {
      stopRef.current = null;
    }
    syncTabStop();
  }, [selected, syncTabStop]);

  const onFocus = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) syncTabStop();
    },
    [syncTabStop],
  );

  const focusTarget = useCallback(
    (target: HTMLElement | undefined) => {
      if (!target) return false;
      target.focus();
      if (target.ownerDocument.activeElement === target) {
        stopRef.current = target;
        syncTabStop();
      }
      target.scrollIntoView?.({ block: "nearest" });
      return true;
    },
    [syncTabStop],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const root = rootRef.current;
      if (!root || !roving || event.defaultPrevented) return;
      const { key } = event;
      const target = event.target as HTMLElement;
      if (isTextEntry(target)) return;

      const targets = getTargets(root, selectable);
      const index = targets.indexOf(target);
      // Only the list's own targets navigate (a nested list keeps its keys).
      if (index < 0) return;
      const option = selectable ? target.dataset.value : undefined;
      const modifier = event.ctrlKey || event.metaKey || event.altKey;

      // Space / Enter.
      if ((key === " " || key === "Enter") && !modifier) {
        if (option !== undefined) {
          event.preventDefault();
          if (!event.repeat) toggle(option);
          return;
        }
        // MD3: Enter activates a checkbox / radio row too (Space is native;
        // a switch handles Enter itself).
        if (
          key === "Enter" &&
          target instanceof HTMLInputElement &&
          (target.type === "checkbox" || target.type === "radio") &&
          target.getAttribute("role") !== "switch"
        ) {
          event.preventDefault();
          if (!event.repeat) target.click();
        }
        return;
      }

      // Ctrl / ⌘ + A — select all (or none, when all are selected).
      if (
        multiple &&
        (event.ctrlKey || event.metaKey) &&
        key.toLowerCase() === "a"
      ) {
        event.preventDefault();
        const values = targets
          .map((element) => element.dataset.value)
          .filter((entry): entry is string => entry !== undefined);
        const all = values.every((entry) =>
          selectedRef.current.includes(entry),
        );
        if (disabled) return;
        if (all) {
          if (!required) commit([]);
        } else {
          commit([...new Set([...selectedRef.current, ...values])]);
        }
        return;
      }

      let next: number | undefined;
      const last = targets.length - 1;
      const rtl =
        key === "ArrowLeft" || key === "ArrowRight" ? isRtl(root) : false;
      const forward =
        key === "ArrowDown" || key === (rtl ? "ArrowLeft" : "ArrowRight");
      const backward =
        key === "ArrowUp" || key === (rtl ? "ArrowRight" : "ArrowLeft");

      if (
        (forward || backward) &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        next = index + (forward ? 1 : -1);
        if (next < 0 || next > last) {
          if (!loop) {
            event.preventDefault();
            return;
          }
          next = (next + targets.length) % targets.length;
        }
      } else if (key === "Home" && !modifier) {
        next = 0;
      } else if (key === "End" && !modifier) {
        next = last;
      } else if (selectable && key.length === 1 && key !== " " && !modifier) {
        // Typeahead: jump to the next option whose label starts with what's
        // been typed in the last half-second.
        const state = typeahead.current;
        window.clearTimeout(state.timer);
        state.text += key.toLowerCase();
        state.timer = window.setTimeout(() => {
          state.text = "";
        }, TYPEAHEAD_TIMEOUT);
        const repeated = [...state.text].every(
          (char) => char === state.text[0],
        );
        const query = repeated ? state.text[0]! : state.text;
        const start = repeated || state.text.length === 1 ? index + 1 : index;
        for (let offset = 0; offset < targets.length; offset++) {
          const candidate = (start + offset) % targets.length;
          const label = getItemLabel(targets[candidate]!, candidate);
          if (label.toLowerCase().startsWith(query)) {
            next = candidate;
            break;
          }
        }
        if (next === undefined) return;
      } else {
        return;
      }

      event.preventDefault(); // no page scroll, no native radio arrows
      const destination = targets[next];
      if (!destination || destination === target) return;
      focusTarget(destination);

      const destinationValue = selectable
        ? destination.dataset.value
        : undefined;
      if (destinationValue === undefined || disabled) return;
      if (multiple && event.shiftKey && (forward || backward)) {
        toggle(destinationValue);
      } else if (!multiple && selectionFollowsFocus) {
        toggle(destinationValue, true);
      }
    },
    [
      commit,
      disabled,
      focusTarget,
      loop,
      multiple,
      required,
      roving,
      selectable,
      selectionFollowsFocus,
      toggle,
    ],
  );

  return {
    context,
    selected,
    rootRef,
    setRef,
    onFocus,
    onKeyDown,
  };
};
