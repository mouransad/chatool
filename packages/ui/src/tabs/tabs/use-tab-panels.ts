"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type Ref,
} from "react";

import { PANEL_SELECTOR, TabsContext, isRtl, missing } from "./tabs-context";
import { cancelSpringScroll, springScrollBy } from "./tabs-motion";

interface UseTabPanelsOptions {
  swipeable: boolean;
  ref: Ref<HTMLDivElement> | undefined;
}

const assignRef = <T>(ref: Ref<T> | undefined, node: T | null) => {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
};

/** `useLayoutEffect` on the client, nothing on the server (no SSR warning). */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Fallback "scroll ended" delay where `scrollend` isn't supported. */
const SETTLE_MS = 120;

/** The pager's own panels, in order. */
const getPanels = (root: HTMLElement) =>
  [...root.children].filter((child): child is HTMLElement =>
    child.matches(PANEL_SELECTOR),
  );

/**
 * Swipeable `TabPanels`: a native, scroll-snapping horizontal pager (touch
 * swipe, trackpad, Shift + wheel) kept in sync with the selection.
 *
 * - **Swipe → tabs**: every scroll frame tells the tab list where the pager
 *   is (a fractional panel index) so the indicator follows the finger; when
 *   the scroll settles on another panel, its tab is selected (`"swipe"`).
 * - **Tabs → pager**: selecting a tab springs the pager to its panel on the
 *   default-spatial spring, with snapping paused so the browser doesn't fight
 *   the animation. Reduced motion jumps.
 */
export const useTabPanels = ({ swipeable, ref }: UseTabPanelsOptions) => {
  const tabs = useContext(TabsContext) ?? missing("TabPanels");
  const { value, select, swipe } = tabs;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  /** A programmatic scroll is running — don't treat it as a swipe. */
  const driving = useRef(false);
  const latest = useRef({ value, select });
  latest.current = { value, select };

  /** Spring (or jump) the pager to `value`'s panel. */
  const goTo = useCallback((target: string | null, instant: boolean) => {
    const root = rootRef.current;
    if (!root || target === null) return;
    const panel = getPanels(root).find((p) => p.dataset.value === target);
    if (!panel) return;
    const delta =
      panel.getBoundingClientRect().left - root.getBoundingClientRect().left;
    if (Math.abs(delta) < 1) return;
    driving.current = true;
    root.style.scrollSnapType = "none";
    springScrollBy(root, delta, {
      rtl: isRtl(root),
      instant,
      onDone: () => {
        root.style.removeProperty("scroll-snap-type");
        driving.current = false;
      },
    });
  }, []);

  // First paint: show the selected panel without animating.
  useIsomorphicLayoutEffect(() => {
    if (swipeable) goTo(latest.current.value, true);
  }, [swipeable, goTo]);

  // Selection changed (a tab, the keyboard, or the app): follow it. After a
  // swipe the pager is already there and `goTo` does nothing.
  const previous = useRef(value);
  useEffect(() => {
    if (!swipeable || previous.current === value) return;
    previous.current = value;
    goTo(value, false);
  }, [swipeable, value, goTo]);

  useEffect(() => {
    const root = rootRef.current;
    if (!swipeable || !root) return;

    const hasScrollEnd = "onscrollend" in root;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      clearTimeout(timer);
      if (driving.current) return;
      const panels = getPanels(root);
      const width = root.clientWidth || 1;
      const index = Math.round(Math.abs(root.scrollLeft) / width);
      const next = panels[index]?.dataset.value;
      const { value: current, select: choose } = latest.current;
      if (next !== undefined && next !== current) choose(next, "swipe");
      else swipe.emit(null);
    };
    const onScroll = () => {
      if (driving.current) return;
      const panels = getPanels(root);
      const width = root.clientWidth || 1;
      swipe.emit({
        position: Math.abs(root.scrollLeft) / width,
        values: panels.map((panel) => panel.dataset.value ?? ""),
      });
      if (!hasScrollEnd) {
        clearTimeout(timer);
        timer = setTimeout(settle, SETTLE_MS);
      }
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", settle);
    // Keep the selected panel aligned when the pager is resized.
    const observer = new ResizeObserver(() => {
      if (!driving.current) goTo(latest.current.value, true);
    });
    observer.observe(root);
    return () => {
      clearTimeout(timer);
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", settle);
      observer.disconnect();
      cancelSpringScroll(root);
    };
  }, [swipeable, swipe, goTo]);

  return { setRef };
};
