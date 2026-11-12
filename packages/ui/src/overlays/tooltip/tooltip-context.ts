"use client";

import { createContext } from "react";

import { type TooltipTiming } from "./tooltip.types";

/** What a `TooltipProvider` hands the tooltips below it. All optional. */
export interface TooltipContextValue extends TooltipTiming {
  container?: HTMLElement | null;
}

/**
 * MD3's timing, used wherever neither the tooltip nor a provider says
 * otherwise:
 *
 * - `showDelay` 500ms: MD3 leaves the hover delay open; this is MDC-web's
 *   `SHOW_DELAY_MS` and Android's long-press timeout.
 * - `hideDelay` 1500ms: "Both plain and rich tooltips disappear 1.5 seconds
 *   after navigating away from the target region."
 * - `touchShowDelay` 500ms: "tap and hold the element on mobile".
 * - `touchHideDelay` 1500ms: Compose's `BasicTooltipDefaults.TooltipDuration`.
 * - `skipDelay` 300ms: how long after a tooltip closes the next one still
 *   opens without waiting.
 */
export const TOOLTIP_TIMING: Required<TooltipTiming> = {
  showDelay: 500,
  hideDelay: 1500,
  skipDelay: 300,
  touchShowDelay: 500,
  touchHideDelay: 1500,
};

/**
 * The tooltip context. Tooltips work without a provider (the default value is
 * empty and they fall back to {@link TOOLTIP_TIMING}).
 */
const TooltipContext = createContext<TooltipContextValue>({});

export default TooltipContext;
