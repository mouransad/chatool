"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type * as React from "react";

import { usePresence } from "../../overlays/use-presence";
import { attachSwipe } from "./swipe";
import {
  type SnackbarData,
  type SnackbarDuration,
  type SnackbarSwipeDirection,
} from "./snackbar.types";
import { resolveDuration, toMilliseconds } from "./timing";

const isFocusable = (element: HTMLElement | null): element is HTMLElement =>
  !!element &&
  element.isConnected &&
  !element.closest("[inert]") &&
  typeof element.focus === "function";

/**
 * One snackbar's life on screen: presence (enter / exit), the auto-dismiss
 * timer with its pauses, swipe-to-dismiss, Escape and focus hand-back.
 */
export const useItemLogic = ({
  data,
  open,
  hostDuration,
  hostPaused,
  pauseOnHover,
  swipeDirections,
  onExited,
}: {
  data: SnackbarData;
  open: boolean;
  hostDuration: SnackbarDuration;
  hostPaused: boolean;
  pauseOnHover: boolean;
  swipeDirections: readonly SnackbarSwipeDirection[];
  onExited: (key: string) => void;
}) => {
  const { mounted, status, nodeRef } = usePresence(open);
  const swipeRef = useRef<HTMLDivElement | null>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  const remainingRef = useRef<number | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const [swiped, setSwiped] = useState(false);

  const paused = hostPaused || (pauseOnHover && hovered) || focused || swiping;

  // ---- Timer ------------------------------------------------------------
  // A new snackbar, or an update to it, starts the clock over.
  useEffect(() => {
    if (!open) return;
    const node = nodeRef.current;
    const text =
      node?.querySelector("[data-slot=snackbar-supporting-text]")
        ?.textContent ??
      node?.textContent ??
      "";
    remainingRef.current = toMilliseconds(
      resolveDuration(dataRef.current, hostDuration),
      text,
    );
  }, [open, data.key, data.version, hostDuration, nodeRef]);

  useEffect(() => {
    if (!open || paused || remainingRef.current === null) return;
    const started = performance.now();
    const timer = window.setTimeout(() => {
      remainingRef.current = null;
      dataRef.current.dismiss("timeout");
    }, remainingRef.current);
    return () => {
      window.clearTimeout(timer);
      if (remainingRef.current !== null) {
        remainingRef.current = Math.max(
          0,
          remainingRef.current - (performance.now() - started),
        );
      }
    };
  }, [open, paused, data.key, data.version, hostDuration]);

  // ---- Swipe ------------------------------------------------------------
  const directionKey = swipeDirections.join(" ");
  useEffect(() => {
    const element = swipeRef.current;
    if (!open || !element || directionKey === "") return;
    return attachSwipe(element, {
      directions: directionKey.split(" ") as SnackbarSwipeDirection[],
      onStart: () => setSwiping(true),
      onCancel: () => setSwiping(false),
      onDismiss: () => {
        setSwiped(true);
        dataRef.current.dismiss("swipe");
      },
    });
  }, [open, directionKey, mounted]);

  // ---- Focus hand-back --------------------------------------------------
  // MD3: when an actionable snackbar that has focus goes away, focus returns
  // to where it came from (or the element that triggered the snackbar).
  useLayoutEffect(() => {
    if (open) return;
    const node = nodeRef.current;
    const active = document.activeElement;
    if (!node || !active || !node.contains(active)) return;
    const target = [returnRef.current, dataRef.current.trigger].find(
      (element) => isFocusable(element) && !node.contains(element),
    );
    target?.focus({ preventScroll: true });
  }, [open, nodeRef]);

  // ---- Unmount ------------------------------------------------------------
  useEffect(() => {
    if (!mounted) onExited(data.key);
  }, [mounted, onExited, data.key]);

  const handlers = {
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") setHovered(true);
    },
    onPointerLeave: () => setHovered(false),
    onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
      const from = event.relatedTarget;
      if (from instanceof HTMLElement && !event.currentTarget.contains(from)) {
        returnRef.current = from;
      }
      setFocused(true);
    },
    onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
      const to = event.relatedTarget;
      if (!(to instanceof Node) || !event.currentTarget.contains(to)) {
        setFocused(false);
      }
    },
    // MD3 keyboard: "Esc — Dismisses the snackbar when in focus". A layer
    // above it (its own tooltip) that consumed the key wins.
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        event.nativeEvent.isComposing
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dataRef.current.dismiss("escape");
    },
  };

  return { mounted, status, nodeRef, swipeRef, swiped, handlers };
};
