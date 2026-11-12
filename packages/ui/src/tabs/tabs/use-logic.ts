"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";

import {
  createSwipeBus,
  getTabs,
  isEnabledTab,
  type TabsContextValue,
} from "./tabs-context";
import {
  type TabsActivationMode,
  type TabsChangeDetails,
  type TabsChangeReason,
} from "./tabs.types";

interface UseLogicOptions {
  value: string | undefined;
  defaultValue: string | undefined;
  onValueChange:
    | ((value: string, details: TabsChangeDetails) => void)
    | undefined;
  activationMode: TabsActivationMode;
  ref: Ref<HTMLDivElement> | undefined;
}

const assignRef = <T>(ref: Ref<T> | undefined, node: T | null) => {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
};

/**
 * `Tabs` behavior: the selection (controlled or not), the direction of the
 * last change (for panel transitions), stable ids, and the swipe channel
 * between swipeable panels and the tab list.
 */
export const useLogic = ({
  value,
  defaultValue,
  onValueChange,
  activationMode,
  ref,
}: UseLogicOptions) => {
  const baseId = useId();
  const controlled = value !== undefined;
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue ?? null);
  const selected = controlled ? value : ownValue;
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [swipe] = useState(createSwipeBus);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  // Latest values for the stable `select` callback.
  const latest = useRef({ selected, controlled, onValueChange });
  latest.current = { selected, controlled, onValueChange };

  const select = useCallback((next: string, reason: TabsChangeReason) => {
    const {
      selected: current,
      controlled: isControlled,
      onValueChange: report,
    } = latest.current;
    if (next === current) return;
    const root = rootRef.current;
    if (root) {
      const order = getTabs(root).map((tab) => tab.dataset.value);
      const from = current === null ? -1 : order.indexOf(current);
      const to = order.indexOf(next);
      setDirection(from === -1 || to === -1 ? 0 : to > from ? 1 : -1);
    }
    if (!isControlled) setOwnValue(next);
    report?.(next, { reason });
  }, []);

  // MD3: one tab is always active. Without a value, pick the first enabled tab
  // once the tabs exist (no `onValueChange`: nothing was chosen).
  useEffect(() => {
    if (controlled || ownValue !== null || !rootRef.current) return;
    const first = getTabs(rootRef.current).find(isEnabledTab);
    if (first?.dataset.value) setOwnValue(first.dataset.value);
  }, [controlled, ownValue]);

  const context = useMemo<TabsContextValue>(
    () => ({
      value: selected,
      select,
      activationMode,
      baseId,
      direction,
      swipe,
    }),
    [selected, select, activationMode, baseId, direction, swipe],
  );

  return { context, setRef };
};
