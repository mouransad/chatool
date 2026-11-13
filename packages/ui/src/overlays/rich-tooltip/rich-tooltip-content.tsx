"use client";

import { useLayoutEffect, useRef } from "react";
import type * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@chatool/utils";

import { getTabbables } from "../focus";
import {
  HOVER_BRIDGE,
  MOTION,
  POPUP,
  POSITIONER as OVERLAY_POSITIONER,
} from "../config";
import TooltipCaret from "../tooltip/tooltip-caret";
import { POSITIONER } from "../tooltip/tooltip.variants";
import { useRichTooltipContext } from "./rich-tooltip-context";
import { type RichTooltipContentProps } from "./rich-tooltip.types";
import { richTooltipVariants } from "./rich-tooltip.variants";

const toLength = (value: number | string | undefined) =>
  typeof value === "number" ? `${value}px` : value;

/**
 * The rich tooltip itself: the MD3 surface (`surface-container`, 12dp
 * corners, level-2 shadow, 320dp max) that holds a `RichTooltipSubhead`, a
 * `RichTooltipSupportingText` and `RichTooltipActions`, or anything else.
 * Nothing renders until the tooltip shows.
 *
 * - **Where:** a native `popover="manual"` in the browser's top layer (above
 *   every stacking context and modal dialog), placed by the shared overlay
 *   foundation: flips, then shifts in MD3's 8dp steps to stay on screen.
 * - **Motion:** M3 Expressive, as Compose's `TooltipBox`: scale 0.8 → 1 on
 *   the fast-spatial spring out of the anchor, with a fast-effects fade; the
 *   exit is effects-only. Reduced motion keeps only the fade.
 * - **Semantics:** `role="tooltip"`, or a non-modal `dialog` labelled by the
 *   subhead (else the text) and described by the text when it holds
 *   controls. Focus is never trapped: Tab from the trigger moves in, Tab out
 *   of the last control continues after the trigger, Shift+Tab goes back.
 *
 * `className`, `style` and the other props go to the surface.
 */
const RichTooltipContent = ({
  children,
  className,
  style,
  elevation,
  maxWidth,
  role,
  ...props
}: RichTooltipContentProps) => {
  const context = useRichTooltipContext("RichTooltipContent");
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const {
    mounted,
    environment,
    interactive,
    hoverable,
    caret,
    surfaceId,
    subheadId,
    supportingTextId,
    registerInteractive,
    status,
  } = context;

  // Links or controls the static scan couldn't see (inside your own
  // components) still make the tooltip interactive, from the first render.
  useLayoutEffect(() => {
    if (!mounted || !environment || interactive) return;
    const surface = surfaceRef.current;
    if (surface && getTabbables(surface).length > 0) registerInteractive();
  });

  if (!mounted || !environment) return null;

  const labelledBy = interactive ? (subheadId ?? supportingTextId) : undefined;
  const describedBy =
    interactive && subheadId && supportingTextId ? supportingTextId : undefined;

  const surfaceStyle = {
    ...(maxWidth === undefined
      ? null
      : { "--md-comp-rich-tooltip-container-max-width": toLength(maxWidth) }),
    ...(caret?.width === undefined
      ? null
      : { "--md-comp-tooltip-caret-width": caret.width }),
    ...(caret?.height === undefined
      ? null
      : { "--md-comp-tooltip-caret-height": caret.height }),
    ...style,
  } as React.CSSProperties;

  return createPortal(
    <div
      ref={context.attachPositioner}
      popover="manual"
      dir={environment.dir}
      data-slot="rich-tooltip-positioner"
      data-state={status}
      data-variant="rich"
      data-hoverable={hoverable}
      className={`${MOTION} ${OVERLAY_POSITIONER} ${POSITIONER} ${hoverable ? HOVER_BRIDGE : ""}`}
    >
      <div
        ref={context.popupRef}
        data-slot="rich-tooltip-popup"
        className={POPUP}
      >
        <div
          ref={surfaceRef}
          data-slot="rich-tooltip"
          data-state={status}
          role={role ?? (interactive ? "dialog" : "tooltip")}
          id={surfaceId}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          className={cn(richTooltipVariants({ elevation }), className)}
          style={surfaceStyle}
          {...props}
        >
          {caret && <TooltipCaret ref={context.caretRef} />}
          {children}
        </div>
      </div>
    </div>,
    environment.root,
  );
};

export default RichTooltipContent;
