"use client";

import { useContext } from "react";
import { cn } from "@chatool/utils";

import {
  TabPanelsContext,
  TabsContext,
  getPanelId,
  getTabId,
  missing,
} from "./tabs-context";
import { type TabPanelProps } from "./tabs.types";
import { tabPanelVariants } from "./tabs.variants";

/**
 * One tab's content — `role="tabpanel"`, labelled by its tab
 * (`aria-labelledby`) and focusable (`tabIndex={0}`, APG: so keyboard users
 * reach panels that start with plain content; pass `tabIndex={-1}` when the
 * panel's first element is itself focusable).
 *
 * Inactive panels unmount, or stay `hidden` with `keepMounted`. Inside
 * swipeable `TabPanels` every panel is laid out side by side and inactive ones
 * are `inert` (unreachable by focus and assistive tech) while still visible
 * mid-swipe.
 */
const TabPanel = ({
  value,
  keepMounted = false,
  className,
  children,
  ...props
}: TabPanelProps) => {
  const tabs = useContext(TabsContext) ?? missing("TabPanel");
  const panels = useContext(TabPanelsContext);
  const selected = tabs.value === value;
  const swipeable = panels?.swipeable ?? false;

  if (!selected && !keepMounted && !swipeable) return null;

  const enter =
    !swipeable && panels?.animate ? (panels.transition ?? "none") : "none";

  return (
    <div
      role="tabpanel"
      id={getPanelId(tabs.baseId, value)}
      aria-labelledby={getTabId(tabs.baseId, value)}
      tabIndex={0}
      hidden={!selected && !swipeable}
      inert={(!selected && swipeable) || undefined}
      data-slot="tab-panel"
      data-value={value}
      data-selected={selected || undefined}
      className={cn(
        tabPanelVariants({ swipeable, enter }),
        // Browsers that support it open the pager on the selected panel
        // before hydration.
        swipeable && selected && "[scroll-initial-target:nearest]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default TabPanel;
