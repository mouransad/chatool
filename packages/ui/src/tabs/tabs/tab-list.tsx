"use client";

import { cn } from "@chatool/utils";

import IconButton from "../../buttons/icon-button/icon-button";
import TabScrollIcon from "./tab-scroll-icon";
import { TabListContext } from "./tabs-context";
import { type TabListProps } from "./tabs.types";
import {
  tabListVariants,
  tabScrollButtonVariants,
  tabScrollerVariants,
} from "./tabs.variants";
import { useTabList } from "./use-tab-list";

/**
 * MD3 tab row — the `role="tablist"` container. It paints the `surface`
 * container and the 1dp divider, lays the tabs out `fixed` (equal sections)
 * or `scrollable`, and runs the keyboard model, the single Tab stop, the
 * indicator motion and auto-scrolling (see `use-tab-list.ts`).
 *
 * Name it with `aria-label` / `aria-labelledby` (APG); `className`, `ref` and
 * any other props go to the `tablist` element itself. Optional scroll buttons
 * are `aria-hidden` and outside the Tab order — they are a pointer affordance;
 * keyboard users move with the arrow keys and the row follows focus.
 */
const TabList = ({
  variant = "primary",
  layout = "fixed",
  alignment = "fill",
  iconPosition = "top",
  indicatorMotion = "elastic",
  divider = true,
  scrollButtons = false,
  loop = true,
  classNames,
  className,
  ref,
  onKeyDown,
  onBlur,
  children,
  ...props
}: TabListProps) => {
  const logic = useTabList({
    variant,
    layout,
    iconPosition,
    indicatorMotion,
    loop,
    ref,
  });
  const withButtons = layout === "scrollable" && scrollButtons !== false;
  const buttonClass = (edge: "start" | "end") =>
    cn(
      tabScrollButtonVariants({ edge, fineOnly: scrollButtons === "auto" }),
      classNames?.scrollButton,
    );

  return (
    <div
      ref={logic.setRef}
      role="tablist"
      aria-orientation="horizontal"
      data-slot="tab-list"
      data-variant={variant}
      data-layout={layout}
      className={cn(tabListVariants({ variant, divider }), className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        logic.onKeyDown(event);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        logic.onBlur(event);
      }}
      {...props}
    >
      {withButtons && (
        <IconButton
          aria-hidden
          tabIndex={-1}
          data-slot="tab-scroll-button"
          data-edge="start"
          className={buttonClass("start")}
          onClick={() => logic.scrollPage(-1)}
        >
          <TabScrollIcon edge="start" />
        </IconButton>
      )}
      <div
        ref={logic.scrollerRef}
        data-slot="tab-scroller"
        className={cn(
          tabScrollerVariants({ layout, alignment }),
          classNames?.scroller,
        )}
      >
        <TabListContext value={logic.context}>{children}</TabListContext>
      </div>
      {withButtons && (
        <IconButton
          aria-hidden
          tabIndex={-1}
          data-slot="tab-scroll-button"
          data-edge="end"
          className={buttonClass("end")}
          onClick={() => logic.scrollPage(1)}
        >
          <TabScrollIcon edge="end" />
        </IconButton>
      )}
    </div>
  );
};

export default TabList;
