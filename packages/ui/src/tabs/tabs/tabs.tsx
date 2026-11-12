"use client";

import { cn } from "@chatool/utils";

import { TabsContext } from "./tabs-context";
import { type TabsProps } from "./tabs.types";
import { tabsVariants } from "./tabs.variants";
import { useLogic } from "./use-logic";

/**
 * MD3 tabs — "organize content across different screens and views". `Tabs` is
 * the stateful root of the WAI-ARIA APG tabs pattern: it owns the selection
 * and wires each `Tab` to its `TabPanel` (`aria-controls` /
 * `aria-labelledby`). Compose it with `TabList` + `Tab` and, optionally,
 * `TabPanels` + `TabPanel` (or render the content yourself from `value`).
 *
 * A client component (state + context) that still renders on the server: with
 * `value` / `defaultValue` the selected tab, its indicator and its panel are in
 * the first paint, before hydration.
 */
const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  activationMode = "manual",
  className,
  ref,
  children,
  ...props
}: TabsProps) => {
  const logic = useLogic({
    value,
    defaultValue,
    onValueChange,
    activationMode,
    ref,
  });

  return (
    <div
      ref={logic.setRef}
      data-slot="tabs"
      className={cn(tabsVariants(), className)}
      {...props}
    >
      <TabsContext value={logic.context}>{children}</TabsContext>
    </div>
  );
};

export default Tabs;
