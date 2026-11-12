"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** `closed` while entering hasn't started or exiting is underway. */
export type PresenceStatus = "open" | "closed";

/** Unmount anyway if an exit animation never reports back (hidden tab, …). */
const EXIT_FALLBACK = 1000;

/**
 * Keeps an overlay **mounted exactly as long as it is on screen**, exit
 * animation included, and tells it when to play each one:
 *
 * 1. `open` turns true → `mounted` (render the overlay, in its `closed` look).
 * 2. Once it's `ready` (positioned), the closed styles are flushed and
 *    `status` flips to `open` in the same frame, so CSS **transitions** run
 *    from the closed look. No `@starting-style` needed, so entrances animate
 *    in every browser.
 * 3. `open` turns false → `status` is `closed` again. The exit plays, and only
 *    when the animations on `nodeRef` have finished does `mounted` turn false.
 *
 * Reopening mid-exit just flips `status` back; transitions reverse from where
 * they are. Put `nodeRef` on the element that animates.
 */
export const usePresence = (open: boolean, ready = true) => {
  const [mounted, setMounted] = useState(open);
  const [status, setStatus] = useState<PresenceStatus>("closed");
  const nodeRef = useRef<HTMLDivElement | null>(null);

  // Derived during render, so mounting and the start of an exit never wait
  // for an effect (no frame where a closed overlay still looks open).
  if (open && !mounted) setMounted(true);
  if (!open && status === "open") setStatus("closed");

  useLayoutEffect(() => {
    if (!open || !ready || !mounted) return;
    // Reading layout commits the closed styles; flipping the state right after
    // is what makes the browser transition from them.
    void nodeRef.current?.offsetWidth;
    setStatus("open");
  }, [open, ready, mounted]);

  useEffect(() => {
    if (open || !mounted) return;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setMounted(false);
    };

    const node = nodeRef.current;
    if (!node || typeof node.getAnimations !== "function") {
      finish();
      return;
    }

    // `getAnimations()` flushes styles first, so the exit transitions that the
    // `closed` state just started are already in the list.
    void Promise.allSettled(
      node.getAnimations().map((animation) => animation.finished),
    ).then(finish);
    const timer = window.setTimeout(finish, EXIT_FALLBACK);

    return () => {
      settled = true;
      window.clearTimeout(timer);
    };
  }, [open, mounted]);

  return { mounted, status, nodeRef };
};
