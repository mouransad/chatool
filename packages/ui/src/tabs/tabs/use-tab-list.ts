"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type Ref,
} from "react";

import { type TabsVariant } from "../config";
import {
  TabsContext,
  TAB_SELECTOR,
  findTab,
  getIndicator,
  getTabs,
  isEnabledTab,
  isRtl,
  missing,
  type TabListContextValue,
  type TabsSwipe,
} from "./tabs-context";
import {
  animateIndicator,
  centerDelta,
  displaceIndicator,
  resetIndicator,
  revealDelta,
  springScrollBy,
} from "./tabs-motion";
import {
  type TabsIconPosition,
  type TabsIndicatorMotion,
  type TabsLayout,
} from "./tabs.types";

interface UseTabListOptions {
  variant: TabsVariant;
  layout: TabsLayout;
  iconPosition: TabsIconPosition;
  indicatorMotion: TabsIndicatorMotion;
  loop: boolean;
  ref: Ref<HTMLDivElement> | undefined;
}

const assignRef = <T>(ref: Ref<T> | undefined, node: T | null) => {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
};

/** Keep a focused tab this far from the scroller's edges (Material Web). */
const REVEAL_MARGIN = 48;

/** `useLayoutEffect` on the client, nothing on the server (no SSR warning). */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * `TabList` behavior — everything is imperative on the DOM the tabs render
 * (`data-slot` / `data-value` hooks), so tabs stay simple and nothing
 * re-renders while things move:
 *
 * - **APG keyboard** (horizontal tablist): ←/→ (mirrored in RTL) move focus
 *   with wrap-around, Home / End jump; disabled tabs are skipped. In
 *   `automatic` mode focus also selects. ↑/↓ are left alone so the page can
 *   scroll (APG).
 * - **One Tab stop**: the focused tab while focus is inside, else the selected
 *   tab (else the first enabled one), so Tab / Shift+Tab leave the list.
 * - **Indicator motion**: on every selection change the new indicator travels
 *   from wherever the old one is (mid-flight included).
 * - **Scrollable**: the selected tab springs to the center (Compose), a
 *   keyboard-focused tab is kept in view, and `data-overflowing` /
 *   `data-at-start` / `data-at-end` drive the scroll buttons.
 * - **Swipe**: follows swipeable panels frame by frame.
 */
export const useTabList = ({
  variant,
  layout,
  iconPosition,
  indicatorMotion,
  loop,
  ref,
}: UseTabListOptions) => {
  const tabs = useContext(TabsContext) ?? missing("TabList");
  const { value, select, activationMode, swipe } = tabs;
  const scrollable = layout === "scrollable";

  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const [focused, setFocused] = useState<string | null>(null);
  /** Takes the Tab stop when the selected tab is missing or disabled. */
  const [fallback, setFallback] = useState<string | null>(null);

  // Pick the fallback Tab stop from the DOM after every commit that could
  // change it (selection, tabs added / removed / disabled).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sync = () => {
      const current = findTab(root, value);
      const next =
        current && isEnabledTab(current)
          ? null
          : (getTabs(root).find(isEnabledTab)?.dataset.value ?? null);
      setFallback((previous) => (previous === next ? previous : next));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled"],
    });
    return () => observer.disconnect();
  }, [value]);

  const motionRef = useRef(indicatorMotion);
  motionRef.current = indicatorMotion;

  /* -------------------- selection → indicator + scroll ------------------- */

  const previous = useRef(value);
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const from = previous.current;
    previous.current = value;
    if (!root || from === value) return;

    const oldIndicator = getIndicator(findTab(root, from));
    const nextTab = findTab(root, value);
    const newIndicator = getIndicator(nextTab);
    // The old indicator's on-screen box, wherever it is right now (resting,
    // mid-flight, or displaced by a swipe) — the new one starts from there.
    const box = oldIndicator ? oldIndicator.getBoundingClientRect() : null;
    if (oldIndicator) resetIndicator(oldIndicator);
    if (newIndicator) animateIndicator(newIndicator, box, motionRef.current);

    const scroller = scrollerRef.current;
    if (scrollable && scroller && nextTab) {
      springScrollBy(scroller, centerDelta(scroller, nextTab), {
        rtl: isRtl(scroller),
      });
    }
  }, [value, scrollable]);

  // First paint of a scrollable row: bring the selected tab to the center
  // instantly (Compose scrolls on first layout too).
  useIsomorphicLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const root = rootRef.current;
    if (!scrollable || !scroller || !root) return;
    const tab = findTab(root, previous.current);
    if (tab) {
      springScrollBy(scroller, centerDelta(scroller, tab), {
        rtl: isRtl(scroller),
        instant: true,
      });
    }
  }, [scrollable]);

  /* ------------------------------ overflow -------------------------------- */

  useEffect(() => {
    const root = rootRef.current;
    const scroller = scrollerRef.current;
    if (!scrollable || !root || !scroller) return;
    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const position = Math.abs(scroller.scrollLeft);
      const set = (name: string, on: boolean) => {
        if (on) root.setAttribute(name, "");
        else root.removeAttribute(name);
      };
      set("data-overflowing", max > 1);
      set("data-at-start", position <= 1);
      set("data-at-end", position >= max - 1);
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    for (const child of scroller.children) observer.observe(child);
    const mutations = new MutationObserver(() => {
      observer.disconnect();
      observer.observe(scroller);
      for (const child of scroller.children) observer.observe(child);
      update();
    });
    mutations.observe(scroller, { childList: true });
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
      mutations.disconnect();
      for (const name of ["data-overflowing", "data-at-start", "data-at-end"]) {
        root.removeAttribute(name);
      }
    };
  }, [scrollable]);

  /** Page the row toward its start (`-1`) or end (`1`). */
  const scrollPage = useCallback((toward: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const rtl = isRtl(scroller);
    const page = scroller.clientWidth * 0.8;
    springScrollBy(scroller, toward * page * (rtl ? -1 : 1), { rtl });
  }, []);

  /* -------------------------------- swipe --------------------------------- */

  useEffect(
    () =>
      swipe.subscribe((state: TabsSwipe) => {
        const root = rootRef.current;
        const selected = root ? getIndicator(findTab(root, value)) : null;
        if (!root || !selected) return;
        if (state === null || motionRef.current === "fade") {
          resetIndicator(selected);
          return;
        }
        const { position, values } = state;
        const lower = Math.max(
          0,
          Math.min(values.length - 1, Math.floor(position)),
        );
        const upper = Math.min(values.length - 1, lower + 1);
        const a = getIndicator(findTab(root, values[lower] ?? null));
        const b = getIndicator(findTab(root, values[upper] ?? null));
        if (!a || !b) return;
        const selectedIndex = value === null ? -1 : values.indexOf(value);
        displaceIndicator(
          selected,
          a.getBoundingClientRect(),
          b.getBoundingClientRect(),
          Math.min(1, Math.max(0, position - lower)),
          motionRef.current,
          position > selectedIndex,
        );
      }),
    [swipe, value],
  );

  /* ------------------------------- keyboard ------------------------------- */

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
        TAB_SELECTOR,
      );
      const all = getTabs(root);
      if (!current || !all.includes(current)) return;
      const enabled = all.filter((tab) => tab === current || isEnabledTab(tab));
      if (enabled.length < 2) return;

      let target: HTMLElement | undefined;
      if (key === "Home") target = enabled.find(isEnabledTab);
      else if (key === "End")
        target = [...enabled].reverse().find(isEnabledTab);
      else {
        const forward = (key === "ArrowRight") !== isRtl(root);
        const from = enabled.indexOf(current);
        let to = from + (forward ? 1 : -1);
        if (to < 0 || to >= enabled.length) {
          if (!loop) return;
          to = (to + enabled.length) % enabled.length;
        }
        target = enabled[to];
      }
      event.preventDefault();
      if (!target || target === current) return;

      target.focus({ preventScroll: true });
      const scroller = scrollerRef.current;
      if (scrollable && scroller) {
        const delta = revealDelta(scroller, target, REVEAL_MARGIN);
        if (delta !== 0) {
          springScrollBy(scroller, delta, { rtl: isRtl(scroller) });
        }
      }
      if (activationMode === "automatic" && target.dataset.value) {
        select(target.dataset.value, "keyboard");
      }
    },
    [activationMode, loop, scrollable, select],
  );

  const onBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
      setFocused(null);
    }
  }, []);

  const context = useMemo<TabListContextValue>(
    () => ({
      variant,
      layout,
      iconPosition,
      indicatorMotion,
      tabStop: focused ?? fallback ?? value,
      onTabFocus: setFocused,
    }),
    [variant, layout, iconPosition, indicatorMotion, focused, fallback, value],
  );

  return { context, setRef, scrollerRef, onKeyDown, onBlur, scrollPage };
};
