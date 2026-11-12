"use client";

import {
  use,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { describe } from "../describe";
import { getOverlayRoot } from "../top-layer";
import { usePresence } from "../use-presence";
import { useOverlayPosition } from "../use-position";
import TooltipContext, { TOOLTIP_TIMING } from "./tooltip-context";
import {
  createTooltipController,
  type TooltipLive,
} from "./tooltip-controller";
import { claimTooltip, releaseTooltip } from "./tooltip-manager";
import {
  type TooltipOpenChangeDetails,
  type TooltipOpenChangeReason,
  type TooltipProps,
} from "./tooltip.types";

type LogicOptions = Pick<
  TooltipProps,
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "disabled"
  | "persistent"
  | "caret"
  | "side"
  | "align"
  | "offset"
  | "alignOffset"
  | "collisionPadding"
  | "flip"
  | "showDelay"
  | "hideDelay"
  | "skipDelay"
  | "touchShowDelay"
  | "touchHideDelay"
  | "container"
> & {
  /** Resolved variant: decides the default placement and the caret inset. */
  rich: boolean;
  /** There is something to show. */
  hasContent: boolean;
  /**
   * Plain-text description to expose through a hidden node before the tooltip
   * ever opens (see `describe.ts`); `undefined` when it isn't needed.
   */
  description: string | undefined;
};

/** Where the tooltip renders and which way its text runs. */
interface Environment {
  root: HTMLElement;
  dir: "ltr" | "rtl";
}

/**
 * The tooltip's logic: open state (controlled or not), the interaction
 * controller, presence (enter / exit), positioning and the "one tooltip at a
 * time" rule. The view only renders what this returns.
 */
export const useLogic = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  persistent = false,
  caret = false,
  rich,
  hasContent,
  description,
  side,
  align,
  offset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  flip = true,
  showDelay,
  hideDelay,
  skipDelay,
  touchShowDelay,
  touchHideDelay,
  container,
}: LogicOptions) => {
  const provider = use(TooltipContext);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const inactive = disabled || !hasContent;
  const open = (openProp ?? uncontrolledOpen) && !inactive;

  const anchorRef = useRef<HTMLElement | null>(null);
  const positionerRef = useRef<HTMLDivElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const descriptionId = useId();

  // The controller reads this on every event, so its listeners are bound once
  // and still always see the latest props.
  const live = useRef<TooltipLive>({
    open,
    persistent,
    disabled: inactive,
    ...TOOLTIP_TIMING,
    setOpen: () => {},
  });
  useLayoutEffect(() => {
    live.current = {
      open,
      persistent,
      disabled: inactive,
      showDelay: showDelay ?? provider.showDelay ?? TOOLTIP_TIMING.showDelay,
      hideDelay: hideDelay ?? provider.hideDelay ?? TOOLTIP_TIMING.hideDelay,
      skipDelay: skipDelay ?? provider.skipDelay ?? TOOLTIP_TIMING.skipDelay,
      touchShowDelay:
        touchShowDelay ??
        provider.touchShowDelay ??
        TOOLTIP_TIMING.touchShowDelay,
      touchHideDelay:
        touchHideDelay ??
        provider.touchHideDelay ??
        TOOLTIP_TIMING.touchHideDelay,
      setOpen: (
        next: boolean,
        reason: TooltipOpenChangeReason,
        event?: Event,
      ) => {
        if (openProp === undefined) {
          // Reflect it at once, so a second event in the same tick sees it.
          live.current.open = next;
          setUncontrolledOpen(next);
        }
        const details: TooltipOpenChangeDetails = { reason, event };
        onOpenChange?.(next, details);
      },
    };
  });

  const [controller] = useState(() =>
    createTooltipController(() => live.current),
  );
  useEffect(() => () => controller.dispose(), [controller]);

  // A tooltip that can no longer show (disabled, emptied) forgets it was open.
  useEffect(() => {
    if (inactive) setUncontrolledOpen(false);
  }, [inactive]);

  // Ref callbacks with cleanup (React 19): listeners live exactly as long as
  // the node, with no state and no re-render.
  const attachAnchor = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      anchorRef.current = node;
      const unbind = controller.bindAnchor(node);
      return () => {
        unbind();
        anchorRef.current = null;
      };
    },
    [controller],
  );

  const attachPositioner = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      positionerRef.current = node;
      const unbind = controller.bindSurface(node);
      return () => {
        unbind();
        positionerRef.current = null;
      };
    },
    [controller],
  );

  // While open: Escape, outside presses and focus leaving.
  useEffect(() => {
    if (!open) return;
    return controller.whileOpen();
  }, [open, controller]);

  // Only one transient tooltip at a time (MD3). Persistent ones stand apart:
  // they stay "until a person interacts with another UI element".
  useEffect(() => {
    if (!open || persistent) return;
    const entry = { close: () => controller.close("replaced") };
    claimTooltip(entry);
    return () => releaseTooltip(entry);
  }, [open, persistent, controller]);

  // A description that exists before the tooltip ever opens.
  useEffect(() => {
    const anchor = anchorRef.current;
    if (description === undefined || !anchor) return;
    return describe(anchor, descriptionId, description);
  }, [description, descriptionId]);

  // Mount → place → enter; exit → unmount.
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [placed, setPlaced] = useState(false);
  const presence = usePresence(open, placed);
  const { mounted } = presence;
  const portalContainer =
    container === undefined ? provider.container : container;

  useLayoutEffect(() => {
    if (!mounted) {
      setEnvironment(null);
      return;
    }
    const anchor = anchorRef.current;
    setEnvironment({
      root: portalContainer ?? getOverlayRoot(anchor),
      dir:
        anchor && getComputedStyle(anchor).direction === "rtl" ? "rtl" : "ltr",
    });
  }, [mounted, portalContainer]);

  useOverlayPosition({
    active: mounted && environment !== null,
    anchorRef,
    floatingRef: positionerRef,
    caretRef,
    side: side ?? (rich ? "bottom" : "top"),
    align: align ?? (rich ? "after" : "center"),
    // With a caret, the gap is measured from its tip.
    offset,
    alignOffset,
    padding: collisionPadding,
    flip,
    // Keep the caret clear of the container's corner radius (12dp / 4dp).
    caretInset: caret ? (rich ? 12 : 4) : 0,
    onPlacedChange: setPlaced,
    onAnchorHidden: () => {
      // Nothing to point at any more. Persistent tooltips just hide until the
      // anchor is back (`data-anchor-hidden`).
      if (!persistent) controller.close("anchor-hidden");
    },
  });

  return {
    open,
    mounted,
    status: presence.status,
    popupRef: presence.nodeRef,
    environment,
    attachAnchor,
    attachPositioner,
    caretRef,
    descriptionId,
  };
};
