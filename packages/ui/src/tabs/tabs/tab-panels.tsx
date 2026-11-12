"use client";

import { useContext, useMemo } from "react";
import { cn } from "@chatool/utils";

import {
  TabPanelsContext,
  TabsContext,
  missing,
  type TabPanelsContextValue,
} from "./tabs-context";
import { type TabPanelsProps } from "./tabs.types";
import { tabPanelsVariants } from "./tabs.variants";
import { useTabPanels } from "./use-tab-panels";

const DIRECTION = { "-1": "backward", "0": undefined, "1": "forward" } as const;

/**
 * The content area under a `TabList`: holds the `TabPanel`s. By default it
 * shows the selected panel and plays MD3's shared-axis X enter transition on
 * change (`transition`). `swipeable` turns it into MD3's swipeable content
 * area — a scroll-snapping pager the indicator follows (see
 * `use-tab-panels.ts`).
 */
const TabPanels = ({
  swipeable = false,
  transition = "slide",
  className,
  ref,
  children,
  ...props
}: TabPanelsProps) => {
  const tabs = useContext(TabsContext) ?? missing("TabPanels");
  const logic = useTabPanels({ swipeable, ref });

  const context = useMemo<TabPanelsContextValue>(
    () => ({ swipeable, transition, animate: tabs.direction !== 0 }),
    [swipeable, transition, tabs.direction],
  );

  return (
    <div
      ref={logic.setRef}
      data-slot="tab-panels"
      data-swipeable={swipeable || undefined}
      data-direction={DIRECTION[tabs.direction]}
      className={cn(tabPanelsVariants({ swipeable }), className)}
      {...props}
    >
      <TabPanelsContext value={context}>{children}</TabPanelsContext>
    </div>
  );
};

export default TabPanels;
