"use client";

import {
  use,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type ReferenceElement } from "@floating-ui/dom";

import { announce } from "../announce";
import { describe } from "../describe";
import { getOverlayRoot } from "../top-layer";
import { usePresence } from "../use-presence";
import { useOverlayPosition } from "../use-position";
import TooltipContext, { TOOLTIP_TIMING } from "../tooltip/tooltip-context";
import {
  createTooltipController,
  type TooltipLive,
} from "../tooltip/tooltip-controller";
import { claimTooltip, releaseTooltip } from "../tooltip/tooltip-manager";
import { type TooltipOpenChangeReason } from "../tooltip/tooltip.types";
import { type RichTooltipEnvironment } from "./rich-tooltip-context";
import {
  type RichTooltipAnchor,
  type RichTooltipOpenChangeDetails,
  type RichTooltipProps,
} from "./rich-tooltip.types";

type LogicOptions = Pick<
  RichTooltipProps,
  | "trigger"
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "state"
  | "disabled"
  | "interactive"
  | "anchor"
  | "side"
  | "align"
  | "offset"
  | "alignOffset"
  | "collisionPadding"
  | "flip"
  | "positionStep"
  | "caret"
  | "announce"
  | "container"
  | "showDelay"
  | "hideDelay"
  | "skipDelay"
  | "touchShowDelay"
  | "touchHideDelay"
> & {
  /** The children / shorthand props already show controls (static scan). */
  staticInteractive: boolean;
  /**
   * Plain-text description exposed through a hidden node before the tooltip
   * ever opens (`describe.ts`); `undefined` when it isn't needed.
   */
  description: string | undefined;
};

/** Delay before an appearance is announced, so the content has rendered. */
const ANNOUNCE_DELAY = 150;

/** Opens the user asked for at the trigger, which its ARIA already covers. */
const SILENT_REASONS = new Set<string>(["hover", "focus"]);

const isRefObject = (
  anchor: NonNullable<RichTooltipAnchor>,
): anchor is React.RefObject<Element | null> => "current" in anchor;

/** The `anchor` prop as something Floating UI can measure. */
const resolveAnchor = (
  anchor: RichTooltipAnchor | undefined,
): ReferenceElement | null => {
  if (!anchor) return null;
  if (isRefObject(anchor)) return anchor.current;
  return anchor as ReferenceElement;
};

/** The real element behind an anchor (a virtual one's `contextElement`). */
const elementOf = (anchor: ReferenceElement | null): Element | null => {
  if (!anchor) return null;
  if (anchor instanceof Element) return anchor;
  return anchor.contextElement ?? null;
};

const toLength = (value: number | string | undefined) =>
  typeof value === "number" ? `${value}px` : value;

/**
 * The rich tooltip's logic: open state (uncontrolled, controlled, or an
 * external `useRichTooltipState`), the shared tooltip interaction
 * controller, presence, positioning (with MD3's 8dp steps), one-at-a-time,
 * ARIA bookkeeping and live-region announcements. The views only render what
 * this returns.
 */
export const useLogic = ({
  trigger = "hover",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  state,
  disabled = false,
  interactive: interactiveProp,
  anchor: anchorProp,
  side = "bottom",
  align = "after",
  offset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  flip = true,
  positionStep = 8,
  caret: caretProp = false,
  announce: announceProp = true,
  container,
  showDelay,
  hideDelay,
  skipDelay,
  touchShowDelay,
  touchHideDelay,
  staticInteractive,
  description,
}: LogicOptions) => {
  const provider = use(TooltipContext);
  const persistent = trigger !== "hover";
  const manual = trigger === "manual";

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = (state?.open ?? openProp ?? uncontrolledOpen) && !disabled;

  const baseId = useId();
  const surfaceId = `${baseId}-rich-tooltip`;
  const descriptionId = description === undefined ? undefined : `${baseId}-d`;

  const triggerRef = useRef<HTMLElement | null>(null);
  const positionerRef = useRef<HTMLDivElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  /** What the tooltip is placed against; a new object when `anchor` changes. */
  const positionAnchor = useMemo<{ current: ReferenceElement | null }>(
    () => ({ current: null }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anchorProp],
  );
  const heldRef = useRef(0);
  /** Why the current open happened, if a user action caused it. */
  const openReasonRef = useRef<string | null>(null);

  // Part registrations (they mount with the content).
  const [labels, setLabels] = useState<{ subhead?: string; text?: string }>({});
  const [detectedInteractive, setDetectedInteractive] = useState(false);
  const interactive =
    interactiveProp ?? (persistent || staticInteractive || detectedInteractive);

  // ---- The controller --------------------------------------------------------
  // It reads this on every event, so its listeners are bound once and still
  // always see the latest props.
  const live = useRef<TooltipLive>({
    open,
    persistent,
    manual,
    held: false,
    disabled,
    ...TOOLTIP_TIMING,
    setOpen: () => {},
  });
  useLayoutEffect(() => {
    live.current = {
      open,
      persistent,
      manual,
      held: heldRef.current > 0,
      disabled,
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
        if (next) openReasonRef.current = reason;
        if (state === undefined && openProp === undefined) {
          // Reflect it at once, so a second event in the same tick sees it.
          live.current.open = next;
          setUncontrolledOpen(next);
        }
        const details: RichTooltipOpenChangeDetails = { reason, event };
        state?.setOpen(next, details);
        onOpenChange?.(next, details);
      },
    };
  });

  const [controller] = useState(() =>
    createTooltipController(() => live.current),
  );
  useEffect(() => () => controller.dispose(), [controller]);

  // A tooltip that can no longer show forgets it was open.
  useEffect(() => {
    if (disabled) setUncontrolledOpen(false);
  }, [disabled]);

  const attachTrigger = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      triggerRef.current = node;
      const unbind = controller.bindAnchor(node);
      return () => {
        unbind();
        if (triggerRef.current === node) triggerRef.current = null;
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
        if (positionerRef.current === node) positionerRef.current = null;
      };
    },
    [controller],
  );

  // What to place against: the `anchor` prop, else the trigger. Runs before
  // the positioning effect below (layout effects run in declaration order).
  useLayoutEffect(() => {
    positionAnchor.current = resolveAnchor(anchorProp) ?? triggerRef.current;
  });

  // An element `anchor` with no trigger of its own becomes the trigger.
  useEffect(() => {
    if (triggerRef.current) return;
    const element = resolveAnchor(anchorProp);
    if (!(element instanceof HTMLElement)) return;
    return controller.bindAnchor(element);
  }, [anchorProp, controller]);

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
    const target = triggerRef.current;
    if (description === undefined || !descriptionId || !target) return;
    return describe(target, descriptionId, description);
  }, [description, descriptionId]);

  // ---- Presence + placement --------------------------------------------------
  const [environment, setEnvironment] = useState<RichTooltipEnvironment | null>(
    null,
  );
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
    const element = triggerRef.current ?? elementOf(positionAnchor.current);
    setEnvironment({
      root: portalContainer ?? getOverlayRoot(element),
      dir:
        element && getComputedStyle(element).direction === "rtl"
          ? "rtl"
          : "ltr",
    });
  }, [mounted, portalContainer, positionAnchor]);

  const caret = useMemo(() => {
    if (!caretProp) return null;
    if (caretProp === true) return {};
    return {
      width: toLength(caretProp.width),
      height: toLength(caretProp.height),
    };
  }, [caretProp]);

  useOverlayPosition({
    active: mounted && environment !== null,
    anchorRef: positionAnchor,
    floatingRef: positionerRef,
    caretRef,
    side,
    align,
    offset,
    alignOffset,
    padding: collisionPadding,
    flip,
    step: positionStep,
    // Keep the caret clear of the 12dp corners.
    caretInset: caret ? 12 : 0,
    onPlacedChange: setPlaced,
    onAnchorHidden: () => {
      // Nothing to point at any more. Persistent tooltips just hide until the
      // anchor is back (`data-anchor-hidden`).
      if (!persistent) controller.close("anchor-hidden");
    },
  });

  // ---- Announcements ---------------------------------------------------------
  // A tooltip that appears without the user asking at its trigger (page load,
  // code, a click / long-press) is spoken through a live region. Hover and
  // focus opens are already covered by the trigger's ARIA.
  useEffect(() => {
    if (!open || environment === null) return;
    const reason = openReasonRef.current;
    openReasonRef.current = null;
    if (!announceProp || (reason !== null && SILENT_REASONS.has(reason))) {
      return;
    }
    let cancel = () => {};
    const timer = window.setTimeout(() => {
      const surface = positionerRef.current;
      if (!surface) return;
      const text = ["rich-tooltip-subhead", "rich-tooltip-supporting-text"]
        .map(
          (slot) =>
            surface.querySelector(`[data-slot=${slot}]`)?.textContent ?? "",
        )
        .map((part) => part.trim())
        .filter(Boolean)
        .join(". ");
      cancel = announce(text, {
        politeness: announceProp === "assertive" ? "assertive" : "polite",
        near: triggerRef.current ?? elementOf(positionAnchor.current),
      });
    }, ANNOUNCE_DELAY);
    return () => {
      window.clearTimeout(timer);
      cancel();
    };
    // Once per appearance; the latest `announce` is read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, environment === null]);

  // ---- Part registration -----------------------------------------------------
  const registerSubhead = useCallback((id: string) => {
    setLabels((current) => ({ ...current, subhead: id }));
    return () =>
      setLabels((current) =>
        current.subhead === id ? { ...current, subhead: undefined } : current,
      );
  }, []);

  const registerSupportingText = useCallback((id: string) => {
    setLabels((current) => ({ ...current, text: id }));
    return () =>
      setLabels((current) =>
        current.text === id ? { ...current, text: undefined } : current,
      );
  }, []);

  const registerInteractive = useCallback(() => {
    setDetectedInteractive(true);
  }, []);

  const close = useCallback(
    (reason: TooltipOpenChangeReason, event?: Event) => {
      // An explicit close always wins over a hold.
      live.current.held = false;
      controller.close(reason, event);
      live.current.held = heldRef.current > 0;
    },
    [controller],
  );

  const hold = useCallback(() => {
    heldRef.current += 1;
    live.current.held = true;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      heldRef.current = Math.max(0, heldRef.current - 1);
      live.current.held = heldRef.current > 0;
    };
  }, []);

  return {
    open,
    mounted,
    status: presence.status,
    popupRef: presence.nodeRef,
    environment,
    interactive,
    caret,
    surfaceId,
    descriptionId,
    subheadId: labels.subhead,
    supportingTextId: labels.text,
    attachTrigger,
    attachPositioner,
    caretRef,
    registerSubhead,
    registerSupportingText,
    registerInteractive,
    close,
    hold,
  };
};
