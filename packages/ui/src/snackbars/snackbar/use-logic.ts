"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { COMPACT_MAX_WIDTH, INLINE_ACTION_MAX_WIDTH } from "../config";

// `useLayoutEffect` warns during SSR; nothing here runs on the server anyway.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? () => {} : useLayoutEffect;

/**
 * Resolves `actionOnNewLine="auto"` the way MDC-Android's
 * `SnackbarContentLayout.onMeasure` does: on a **compact** window, a message
 * that **wraps** next to an action wider than **128dp** moves the action to
 * its own line. Measured against the *inline* geometry (the text's
 * max-content width vs. the room beside the actions), so stacking never feeds
 * back into the decision and the layout can't oscillate.
 */
export const useLogic = ({
  actionOnNewLine,
  hasAction,
}: {
  actionOnNewLine: boolean | "auto";
  hasAction: boolean;
}) => {
  const auto = actionOnNewLine === "auto" && hasAction;
  const [autoStacked, setAutoStacked] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const text = textRef.current;
    const actions = actionsRef.current;
    if (!root || !text || !actions) return;

    const compact = window.innerWidth < COMPACT_MAX_WIDTH;
    const action = actions.querySelector<HTMLElement>(
      "[data-slot=snackbar-action]",
    );
    const actionWidth =
      action?.getBoundingClientRect().width ??
      actions.getBoundingClientRect().width;
    if (!compact || actionWidth <= INLINE_ACTION_MAX_WIDTH) {
      setAutoStacked(false);
      return;
    }

    // The text's natural single-line width, read without a paint.
    const { width, flex, display } = text.style;
    text.style.width = "max-content";
    text.style.flex = "none";
    text.style.display = "block";
    const natural = text.getBoundingClientRect().width;
    text.style.width = width;
    text.style.flex = flex;
    text.style.display = display;

    const style = getComputedStyle(root);
    const dismissible = root.dataset.dismissible === "true";
    // Inline: 16dp start padding, the actions, and 8 + 8dp without a ✕.
    const room =
      root.clientWidth -
      parseFloat(style.paddingInlineStart) -
      actions.getBoundingClientRect().width -
      (dismissible ? 0 : 16);
    setAutoStacked(natural > room + 0.5);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!auto) return;
    measure();
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(root);
    if (textRef.current) observer.observe(textRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [auto, measure]);

  return {
    stacked: actionOnNewLine === true || (auto && autoStacked),
    rootRef,
    textRef,
    actionsRef,
  };
};
