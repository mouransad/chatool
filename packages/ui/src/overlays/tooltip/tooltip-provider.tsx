"use client";

import { use, useMemo } from "react";

import TooltipContext, { type TooltipContextValue } from "./tooltip-context";
import { type TooltipProviderProps } from "./tooltip.types";

/**
 * Optional app- or section-wide tooltip defaults: timing (`showDelay`,
 * `hideDelay`, `skipDelay`, `touchShowDelay`, `touchHideDelay`) and the
 * `container` tooltips render into. Tooltips work without it; a tooltip's own
 * props always win, and nested providers inherit what they don't set.
 */
const TooltipProvider = ({
  children,
  showDelay,
  hideDelay,
  skipDelay,
  touchShowDelay,
  touchHideDelay,
  container,
}: TooltipProviderProps) => {
  const parent = use(TooltipContext);

  const value = useMemo<TooltipContextValue>(
    () => ({
      showDelay: showDelay ?? parent.showDelay,
      hideDelay: hideDelay ?? parent.hideDelay,
      skipDelay: skipDelay ?? parent.skipDelay,
      touchShowDelay: touchShowDelay ?? parent.touchShowDelay,
      touchHideDelay: touchHideDelay ?? parent.touchHideDelay,
      container: container === undefined ? parent.container : container,
    }),
    [
      parent,
      showDelay,
      hideDelay,
      skipDelay,
      touchShowDelay,
      touchHideDelay,
      container,
    ],
  );

  return <TooltipContext value={value}>{children}</TooltipContext>;
};

export default TooltipProvider;
