"use client";

import { createContext } from "react";

import { type TabsVariant } from "../config";
import {
  type TabsActivationMode,
  type TabsChangeReason,
  type TabsIconPosition,
  type TabsIndicatorMotion,
  type TabsLayout,
  type TabPanelsTransition,
} from "./tabs.types";

/**
 * Where a swipe is between two panels: `position` is a fractional index into
 * `values` (the panels' values in order), e.g. `1.25` = a quarter of the way
 * from the 2nd panel to the 3rd. `null` = the swipe ended; drop any offset.
 */
export type TabsSwipe = { position: number; values: string[] } | null;

/** A tiny synchronous event channel — swipe frames must not re-render React. */
export interface TabsSwipeBus {
  emit: (swipe: TabsSwipe) => void;
  subscribe: (listener: (swipe: TabsSwipe) => void) => () => void;
}

export const createSwipeBus = (): TabsSwipeBus => {
  const listeners = new Set<(swipe: TabsSwipe) => void>();
  return {
    emit: (swipe) => {
      for (const listener of listeners) listener(swipe);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

/** What `Tabs` hands its list, tabs and panels. */
export interface TabsContextValue {
  /** The selected tab's value (`null` before anything is selected). */
  value: string | null;
  /** Select a tab. No-op when it's already selected. */
  select: (value: string, reason: TabsChangeReason) => void;
  activationMode: TabsActivationMode;
  /** Prefix for tab / panel ids. */
  baseId: string;
  /** Direction of the last change: `1` forward, `-1` backward, `0` none yet. */
  direction: -1 | 0 | 1;
  /** Swipeable panels → tab list (indicator follows the finger). */
  swipe: TabsSwipeBus;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

/** What `TabList` hands its tabs. */
export interface TabListContextValue {
  variant: TabsVariant;
  layout: TabsLayout;
  iconPosition: TabsIconPosition;
  indicatorMotion: TabsIndicatorMotion;
  /** The tab that owns the list's single Tab stop. */
  tabStop: string | null;
  /** A tab received focus (it takes the Tab stop while focused). */
  onTabFocus: (value: string) => void;
}

export const TabListContext = createContext<TabListContextValue | null>(null);

/** What `TabPanels` hands its panels. */
export interface TabPanelsContextValue {
  swipeable: boolean;
  transition: TabPanelsTransition;
  /** `true` once the user changed tabs — enter transitions only play then. */
  animate: boolean;
}

export const TabPanelsContext = createContext<TabPanelsContextValue | null>(
  null,
);

/** Throw a readable error when a part is used outside `Tabs`. */
export const missing = (part: string): never => {
  throw new Error(`<${part}> must be rendered inside <Tabs>.`);
};

/**
 * A DOM-safe id fragment for a tab value. Deterministic (server = client) and
 * collision-free: anything outside `[A-Za-z0-9-]` is escaped by char code.
 */
const encode = (value: string) =>
  value.replace(/[^A-Za-z0-9-]/g, (c) => `_${c.charCodeAt(0).toString(36)}`);

export const getTabId = (baseId: string, value: string) =>
  `${baseId}-tab-${encode(value)}`;

export const getPanelId = (baseId: string, value: string) =>
  `${baseId}-panel-${encode(value)}`;

/* ----------------------------- DOM helpers ------------------------------ */

export const TAB_SELECTOR = "[data-slot=tab]";
export const TAB_LIST_SELECTOR = "[data-slot=tab-list]";
export const TABS_SELECTOR = "[data-slot=tabs]";
export const INDICATOR_SELECTOR = "[data-slot=tab-indicator]";
export const PANEL_SELECTOR = "[data-slot=tab-panel]";

/** Tabs owned by `root` (a tab list, or a `Tabs` root) — nested sets excluded. */
export const getTabs = (root: Element) => {
  const owner = root.matches(TAB_LIST_SELECTOR)
    ? TAB_LIST_SELECTOR
    : TABS_SELECTOR;
  return [...root.querySelectorAll<HTMLElement>(TAB_SELECTOR)].filter(
    (tab) => tab.closest(owner) === root,
  );
};

/** A tab that can take focus and be selected. */
export const isEnabledTab = (tab: Element) =>
  !tab.matches(":disabled") && tab.getAttribute("aria-disabled") !== "true";

/** The tab element for `value` among `root`'s tabs. */
export const findTab = (root: Element, value: string | null) =>
  value === null
    ? undefined
    : getTabs(root).find((tab) => tab.dataset.value === value);

/** A tab's active indicator. */
export const getIndicator = (tab: Element | undefined) =>
  tab?.querySelector<HTMLElement>(INDICATOR_SELECTOR) ?? null;

/** `element` is laid out right-to-left. */
export const isRtl = (element: Element) =>
  getComputedStyle(element).direction === "rtl";
