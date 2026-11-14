"use client";

import { useCallback, useEffect, useRef } from "react";
import type * as React from "react";
import { flushSync } from "react-dom";

import {
  HANDLE_SELECTOR,
  ITEM_SELECTOR,
  getItemLabel,
  getItems,
  ownerList,
} from "./list-context";
import {
  type ListReorderAnnouncements,
  type ListReorderEvent,
} from "./list.types";

/** Default (English) reorder messages — override with `reorderAnnouncements`. */
const MESSAGES: Required<ListReorderAnnouncements> = {
  grab: (label, position, total) =>
    `${label}, picked up. Position ${position} of ${total}. Press the up and down arrow keys to move it, Space or Enter to drop it, Escape to cancel.`,
  move: (label, position, total) =>
    `${label}, moved to position ${position} of ${total}.`,
  drop: (label, position, total) =>
    `${label}, dropped at position ${position} of ${total}.`,
  cancel: (label, position, total) =>
    `Reorder cancelled. ${label} is back at position ${position} of ${total}.`,
  instructions:
    "Press Space or Enter to pick the item up, the up and down arrow keys to move it, Space or Enter to drop it, or Escape to cancel. Alt plus the up or down arrow key moves an item one step.",
};

/** Pointer distance from a scroll edge that starts auto-scrolling (px). */
const SCROLL_EDGE = 48;
/** Fastest auto-scroll step (px per frame). */
const SCROLL_SPEED = 18;
/** Upper bound for the drop animation, if `transitionend` never fires. */
const SETTLE_TIMEOUT = 600;

interface DragState {
  item: HTMLElement;
  handle: HTMLElement;
  items: HTMLElement[];
  from: number;
  to: number;
  pointerId: number;
  startY: number;
  lastY: number;
  /** The list's top (viewport) when the drag started. */
  rootTop: number;
  /** Each item's top / height in list coordinates at the start. */
  tops: number[];
  heights: number[];
  gap: number;
  scroller: Element;
  frame: number;
  cleanup: () => void;
}

interface GrabState {
  item: HTMLElement;
  handle: HTMLElement;
  /** Where the item was when it was picked up (for Escape). */
  origin: number;
}

interface UseReorderOptions {
  enabled: boolean;
  rootRef: React.RefObject<HTMLElement | null>;
  onReorder: ((event: ListReorderEvent) => void) | undefined;
  announcements: ListReorderAnnouncements | undefined;
  /** Speak a message through the list's live region. */
  announce: (message: string) => void;
  /** The id of the hidden instructions node (handles' `aria-describedby`). */
  instructionsId: string;
}

/** The nearest ancestor that scrolls vertically (or the page). */
const findScroller = (element: Element): Element => {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      /(auto|scroll|overlay)/.test(overflowY) &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
  }
  return document.scrollingElement ?? document.documentElement;
};

/** Run once the element's `translate` transition ends (or a timeout). */
const onSettled = (element: HTMLElement, done: () => void) => {
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    element.removeEventListener("transitionend", onEnd);
    clearTimeout(timer);
    done();
  };
  const onEnd = (event: TransitionEvent) => {
    if (event.target === element && event.propertyName === "translate") {
      finish();
    }
  };
  element.addEventListener("transitionend", onEnd);
  const timer = setTimeout(finish, SETTLE_TIMEOUT);
};

/**
 * Reordering for a `reorderable` `List` — pointer drag on a
 * `ListItemDragHandle` and the keyboard (grab / move / drop / cancel, plus
 * Alt + ↑ / ↓), with screen-reader announcements.
 *
 * The list **never reorders its own children** (React owns them): every move
 * calls `onReorder` inside `flushSync`, so the consumer's new order is in the
 * DOM before the next line runs, then FLIPs the rows from where they were to
 * where they landed on the list's fast-spatial transition.
 *
 * - **Pointer**: the picked-up row follows the pointer (MD3 dragged state —
 *   `tertiary-container`, elevation 4, 16dp corners) while its siblings slide
 *   out of the way and the vacated slot shows the drop zone; the list scrolls
 *   when the pointer nears an edge; Escape cancels.
 * - **Keyboard**: Space / Enter on a handle picks the row up (it keeps the
 *   dragged look); ↑ / ↓ move it one step at a time (each step is a real
 *   `onReorder`, so the order is never "pending"); Space / Enter / Tab drop;
 *   Escape puts it back.
 */
export const useReorder = ({
  enabled,
  rootRef,
  onReorder,
  announcements,
  announce,
  instructionsId,
}: UseReorderOptions) => {
  const latest = useRef({ onReorder, announcements });
  latest.current = { onReorder, announcements };
  const dragRef = useRef<DragState | null>(null);
  const grabRef = useRef<GrabState | null>(null);
  /** `true` while React is moving rows (a move blurs the focused handle). */
  const movingRef = useRef(false);

  const message = useCallback(
    (
      kind: "grab" | "move" | "drop" | "cancel",
      item: HTMLElement,
      index: number,
    ) => {
      const root = rootRef.current;
      const total = root ? getItems(root).length : 0;
      const format = latest.current.announcements?.[kind] ?? MESSAGES[kind];
      return format(getItemLabel(item, index), index + 1, total);
    },
    [rootRef],
  );

  /**
   * Ask the consumer to move `item` from `from` to `to` and flush the render.
   * Returns the item's index afterwards (unchanged if the move was ignored).
   */
  const commit = useCallback(
    (
      item: HTMLElement,
      from: number,
      to: number,
      source: ListReorderEvent["source"],
    ) => {
      const root = rootRef.current;
      if (!root || from === to) return from;
      movingRef.current = true;
      try {
        flushSync(() =>
          latest.current.onReorder?.({
            from,
            to,
            value: item.dataset.value,
            source,
          }),
        );
      } finally {
        movingRef.current = false;
      }
      return getItems(root).indexOf(item);
    },
    [rootRef],
  );

  /** FLIP: animate each row from its `before` top to where it is now. */
  const flip = useCallback(
    (rows: HTMLElement[], before: Map<HTMLElement, number>) => {
      const moved: HTMLElement[] = [];
      for (const row of rows) {
        const top = before.get(row);
        if (top === undefined || !row.isConnected) continue;
        const delta = top - row.getBoundingClientRect().top;
        if (Math.abs(delta) < 0.5) continue;
        row.style.transition = "none";
        row.style.translate = `0 ${delta}px`;
        moved.push(row);
      }
      if (moved.length === 0) return;
      void rootRef.current?.offsetHeight; // commit the inverted position
      for (const row of moved) {
        row.style.transition = "";
        row.style.translate = "";
      }
    },
    [rootRef],
  );

  /** Move an item one or more steps (keyboard), keeping focus where it was. */
  const moveBy = useCallback(
    (item: HTMLElement, delta: number, announceMove = true) => {
      const root = rootRef.current;
      if (!root) return -1;
      const rows = getItems(root);
      const from = rows.indexOf(item);
      const to = Math.max(0, Math.min(rows.length - 1, from + delta));
      if (from < 0 || to === from) return from;
      const before = new Map(
        rows.map((row) => [row, row.getBoundingClientRect().top]),
      );
      const focused = document.activeElement;
      const index = commit(item, from, to, "keyboard");
      flip(getItems(root), before);
      // React re-inserts moved rows, which drops focus: put it back.
      if (
        focused instanceof HTMLElement &&
        focused.isConnected &&
        document.activeElement !== focused
      ) {
        focused.focus({ preventScroll: true });
      }
      item.scrollIntoView?.({ block: "nearest" });
      if (announceMove) announce(message("move", item, index));
      return index;
    },
    [announce, commit, flip, message, rootRef],
  );

  // ---- Keyboard ------------------------------------------------------------

  const drop = useCallback(() => {
    const grab = grabRef.current;
    if (!grab) return;
    grabRef.current = null;
    delete grab.item.dataset.dragged;
    const root = rootRef.current;
    const index = root ? getItems(root).indexOf(grab.item) : 0;
    announce(message("drop", grab.item, index));
  }, [announce, message, rootRef]);

  const cancel = useCallback(() => {
    const grab = grabRef.current;
    if (!grab) return;
    grabRef.current = null;
    const root = rootRef.current;
    const index = root ? getItems(root).indexOf(grab.item) : grab.origin;
    const back =
      index === grab.origin
        ? index
        : moveBy(grab.item, grab.origin - index, false);
    delete grab.item.dataset.dragged;
    announce(message("cancel", grab.item, back));
  }, [announce, message, moveBy, rootRef]);

  /** Returns `true` when the event was a reorder key (already handled). */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const root = rootRef.current;
      if (!enabled || !root || event.defaultPrevented) return false;
      const { key } = event;
      const grab = grabRef.current;

      if (grab) {
        if (key === "ArrowUp" || key === "ArrowDown") {
          event.preventDefault();
          moveBy(grab.item, key === "ArrowUp" ? -1 : 1);
          return true;
        }
        if (key === " " || key === "Enter") {
          event.preventDefault();
          drop();
          return true;
        }
        if (key === "Escape") {
          event.preventDefault();
          event.stopPropagation(); // don't close an enclosing dialog
          cancel();
          return true;
        }
        if (key === "Tab") drop();
        return key !== "Tab";
      }

      const target = event.target as HTMLElement;
      const handle = target.closest<HTMLElement>(HANDLE_SELECTOR);
      if (
        handle &&
        ownerList(handle) === root &&
        (key === " " || key === "Enter") &&
        !event.repeat &&
        !handle.matches(":disabled")
      ) {
        const item = handle.closest<HTMLElement>(ITEM_SELECTOR);
        if (!item || item.parentElement !== root) return false;
        event.preventDefault();
        const origin = getItems(root).indexOf(item);
        grabRef.current = { item, handle, origin };
        item.dataset.dragged = "";
        announce(message("grab", item, origin));
        return true;
      }

      if (
        event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        (key === "ArrowUp" || key === "ArrowDown")
      ) {
        const item = target.closest<HTMLElement>(ITEM_SELECTOR);
        if (!item || item.parentElement !== root) return false;
        event.preventDefault();
        moveBy(item, key === "ArrowUp" ? -1 : 1);
        return true;
      }
      return false;
    },
    [announce, cancel, drop, enabled, message, moveBy, rootRef],
  );

  /** Focus leaving a picked-up handle drops it (but not React's own moves). */
  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const grab = grabRef.current;
      if (!grab || movingRef.current || event.target !== grab.handle) return;
      queueMicrotask(() => {
        if (grabRef.current === grab && document.activeElement !== grab.handle)
          drop();
      });
    },
    [drop],
  );

  // ---- Pointer -------------------------------------------------------------

  const placeDropZone = useCallback(
    (state: DragState) => {
      const root = rootRef.current;
      if (!root) return;
      const { from, to, tops, heights } = state;
      const top =
        to > from ? tops[to]! + heights[to]! - heights[from]! : tops[to]!;
      root.style.setProperty("--_dz-y", `${top}px`);
      root.style.setProperty("--_dz-h", `${heights[from]}px`);
    },
    [rootRef],
  );

  const update = useCallback(
    (state: DragState) => {
      const root = rootRef.current;
      if (!root) return;
      const { item, items, from, tops, heights } = state;
      const last = items.length - 1;
      const drift = root.getBoundingClientRect().top - state.rootTop;
      const min = tops[0]! - tops[from]!;
      const max = tops[last]! + heights[last]! - heights[from]! - tops[from]!;
      const dy = Math.max(
        min,
        Math.min(max, state.lastY - state.startY - drift),
      );
      item.style.translate = `0 ${dy}px`;

      const center = tops[from]! + dy + heights[from]! / 2;
      let to = from;
      for (let index = from + 1; index <= last; index++) {
        if (center > tops[index]! + heights[index]! / 2) to = index;
      }
      for (let index = from - 1; index >= 0; index--) {
        if (center < tops[index]! + heights[index]! / 2) to = index;
      }
      const shift = heights[from]! + state.gap;
      items.forEach((row, index) => {
        if (index === from) return;
        const offset =
          index > from && index <= to
            ? -shift
            : index < from && index >= to
              ? shift
              : 0;
        row.style.translate = offset === 0 ? "" : `0 ${offset}px`;
      });
      if (to !== state.to) {
        state.to = to;
        placeDropZone(state);
      }
    },
    [placeDropZone, rootRef],
  );

  const endDrag = useCallback(
    (keep: boolean) => {
      const state = dragRef.current;
      const root = rootRef.current;
      if (!state || !root) return;
      dragRef.current = null;
      cancelAnimationFrame(state.frame);
      state.cleanup();

      const { item, items, from } = state;
      const to = keep ? state.to : from;
      const visualTop = item.getBoundingClientRect().top;
      for (const row of items) {
        row.style.transition = "none";
        row.style.translate = "";
      }
      delete root.dataset.reordering;
      const index = to === from ? from : commit(item, from, to, "pointer");

      // FLIP the dropped row from under the pointer into its slot.
      const delta = visualTop - item.getBoundingClientRect().top;
      if (Math.abs(delta) >= 0.5) item.style.translate = `0 ${delta}px`;
      void root.offsetHeight;
      for (const row of items) row.style.transition = "";
      delete item.dataset.dragging;
      item.style.translate = "";
      if (Math.abs(delta) >= 0.5) {
        onSettled(item, () => delete item.dataset.dragged);
      } else {
        delete item.dataset.dragged;
      }
      announce(message(keep ? "drop" : "cancel", item, index));
    },
    [announce, commit, message, rootRef],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const root = rootRef.current;
      if (
        !enabled ||
        !root ||
        event.button !== 0 ||
        !event.isPrimary ||
        dragRef.current ||
        grabRef.current
      ) {
        return;
      }
      const handle = (event.target as Element).closest<HTMLElement>(
        HANDLE_SELECTOR,
      );
      if (!handle || ownerList(handle) !== root || handle.matches(":disabled"))
        return;
      const item = handle.closest<HTMLElement>(ITEM_SELECTOR);
      if (!item || item.parentElement !== root) return;

      event.preventDefault(); // no text selection, no native drag
      const items = getItems(root);
      const rootTop = root.getBoundingClientRect().top;
      const rects = items.map((row) => row.getBoundingClientRect());
      const from = items.indexOf(item);

      const onMove = (move: PointerEvent) => {
        if (move.pointerId !== state.pointerId) return;
        state.lastY = move.clientY;
        update(state);
      };
      const onUp = (up: PointerEvent) => {
        if (up.pointerId === state.pointerId) endDrag(true);
      };
      const onCancel = () => endDrag(false);
      const onKey = (key: KeyboardEvent) => {
        if (key.key !== "Escape") return;
        key.preventDefault();
        key.stopPropagation();
        endDrag(false);
      };

      const state: DragState = {
        item,
        handle,
        items,
        from,
        to: from,
        pointerId: event.pointerId,
        startY: event.clientY,
        lastY: event.clientY,
        rootTop,
        tops: rects.map((rect) => rect.top - rootTop),
        heights: rects.map((rect) => rect.height),
        gap: Number.parseFloat(getComputedStyle(root).rowGap) || 0,
        scroller: findScroller(root),
        frame: 0,
        cleanup: () => {
          handle.removeEventListener("pointermove", onMove);
          handle.removeEventListener("pointerup", onUp);
          handle.removeEventListener("pointercancel", onCancel);
          handle.removeEventListener("lostpointercapture", onCancel);
          window.removeEventListener("keydown", onKey, true);
          if (handle.hasPointerCapture(state.pointerId)) {
            handle.releasePointerCapture(state.pointerId);
          }
        },
      };
      dragRef.current = state;

      handle.setPointerCapture(event.pointerId);
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onCancel);
      handle.addEventListener("lostpointercapture", onCancel);
      window.addEventListener("keydown", onKey, true);

      root.dataset.reordering = "";
      item.dataset.dragged = "";
      item.dataset.dragging = "";
      placeDropZone(state);

      // Auto-scroll while the pointer rests near an edge of the scroller.
      const tick = () => {
        if (dragRef.current !== state) return;
        const page =
          state.scroller === document.scrollingElement ||
          state.scroller === document.documentElement;
        const bounds = page
          ? { top: 0, bottom: window.innerHeight }
          : state.scroller.getBoundingClientRect();
        let step = 0;
        if (state.lastY < bounds.top + SCROLL_EDGE) {
          step = -SCROLL_SPEED * (1 - (state.lastY - bounds.top) / SCROLL_EDGE);
        } else if (state.lastY > bounds.bottom - SCROLL_EDGE) {
          step =
            SCROLL_SPEED * (1 - (bounds.bottom - state.lastY) / SCROLL_EDGE);
        }
        if (step !== 0) {
          state.scroller.scrollBy(
            0,
            Math.max(-SCROLL_SPEED, Math.min(SCROLL_SPEED, step)),
          );
          update(state);
        }
        state.frame = requestAnimationFrame(tick);
      };
      state.frame = requestAnimationFrame(tick);
    },
    [enabled, endDrag, placeDropZone, rootRef, update],
  );

  // Point every handle at the instructions (handles come and go).
  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    const sync = () => {
      for (const handle of root.querySelectorAll<HTMLElement>(
        HANDLE_SELECTOR,
      )) {
        if (ownerList(handle) !== root) continue;
        const ids = (handle.getAttribute("aria-describedby") ?? "")
          .split(" ")
          .filter(Boolean);
        if (!ids.includes(instructionsId)) {
          handle.setAttribute(
            "aria-describedby",
            [...ids, instructionsId].join(" "),
          );
        }
      }
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [enabled, instructionsId, rootRef]);

  // Never leave a drag dangling if the list unmounts mid-gesture.
  useEffect(
    () => () => {
      const state = dragRef.current;
      if (state) {
        cancelAnimationFrame(state.frame);
        state.cleanup();
      }
    },
    [],
  );

  return {
    onKeyDown,
    onBlur,
    onPointerDown,
    instructions: announcements?.instructions ?? MESSAGES.instructions,
  };
};
