"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  type RichTooltipOpenChangeDetails,
  type RichTooltipState,
  type RichTooltipStateOptions,
} from "./rich-tooltip.types";

const PROGRAMMATIC: RichTooltipOpenChangeDetails = { reason: "programmatic" };

/**
 * A rich tooltip's open state as an object, like Compose's
 * `rememberTooltipState()`. Hand it to `<RichTooltip state={…}>` and drive the
 * tooltip from anywhere: `show()` from an onboarding tour, `dismiss()` after a
 * save, `toggle()` from a help button.
 *
 * ```tsx
 * const tip = useRichTooltipState();
 * <RichTooltip state={tip} trigger="manual" supportingText="…">…</RichTooltip>
 * <Button onClick={tip.show}>What's new?</Button>
 * ```
 */
export const useRichTooltipState = ({
  defaultOpen = false,
  onOpenChange,
}: RichTooltipStateOptions = {}): RichTooltipState => {
  const [open, setOpenState] = useState(defaultOpen);
  const callback = useRef(onOpenChange);
  useLayoutEffect(() => {
    callback.current = onOpenChange;
  });
  // The open value only ever changes through `setOpen`, so this mirror is
  // always current, and the methods can read it without changing identity.
  const current = useRef(defaultOpen);

  const setOpen = useCallback(
    (next: boolean, details: RichTooltipOpenChangeDetails = PROGRAMMATIC) => {
      if (current.current === next) return;
      current.current = next;
      setOpenState(next);
      callback.current?.(next, details);
    },
    [],
  );
  const show = useCallback(() => setOpen(true), [setOpen]);
  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen(!current.current), [setOpen]);

  return useMemo(
    () => ({ open, show, dismiss, toggle, setOpen }),
    [open, show, dismiss, toggle, setOpen],
  );
};
