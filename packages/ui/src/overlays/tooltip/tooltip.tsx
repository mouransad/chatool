"use client";

import { cloneElement, isValidElement, useId } from "react";
import type * as React from "react";
import { createPortal } from "react-dom";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import {
  HOVER_BRIDGE,
  MOTION,
  POPUP,
  POSITIONER as OVERLAY_POSITIONER,
} from "../config";
import TooltipCaret from "./tooltip-caret";
import { type TooltipProps } from "./tooltip.types";
import {
  ACTIONS,
  ANCHOR,
  PLAIN_TEXT,
  POSITIONER,
  SUPPORTING_TEXT,
  TITLE,
  tooltipVariants,
} from "./tooltip.variants";
import { useLogic } from "./use-logic";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

const joinIds = (...ids: unknown[]) =>
  ids.filter((id) => typeof id === "string" && id !== "").join(" ") ||
  undefined;

/**
 * MD3 tooltip, **plain** or **rich**. It wraps one element (the anchor) and
 * renders nothing else until it shows.
 *
 * It's a client component (it holds the open state), yet everything passed to
 * it is still server-rendered: use it straight from a Server Component, around
 * a `Button` / `IconButton` / any element, with no `"use client"` of your own.
 *
 * - **Shows** on hover, on keyboard focus and on a touch long-press;
 *   `persistent` rich tooltips show on click instead (see the controller).
 * - **Where:** the shared overlay foundation puts it in the browser's top
 *   layer, next to the anchor, and keeps it on screen (`../position`).
 * - **Motion:** M3 Expressive, as Compose's `TooltipBox`: scale 0.8 → 1 on the
 *   fast-spatial spring, growing out of the anchor, with a fast-effects fade.
 * - **Semantics:** a `role="tooltip"` that describes (`aria-describedby`) or
 *   names (`relationship="label"` → `aria-label`) its anchor. A tooltip with
 *   controls is a non-modal `dialog` its anchor announces with
 *   `aria-haspopup` / `aria-expanded` (MDC-web's rich-tooltip contract).
 *
 * `className` and the remaining props go to the tooltip **surface**.
 */
const Tooltip = ({
  children,
  content,
  title,
  actions,
  variant: variantProp,
  persistent = false,
  caret = false,
  side,
  align,
  offset,
  alignOffset,
  collisionPadding,
  flip,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  hoverable = true,
  interactive: interactiveProp,
  relationship = "description",
  container,
  showDelay,
  hideDelay,
  skipDelay,
  touchShowDelay,
  touchHideDelay,
  className,
  id,
  role,
  ...props
}: TooltipProps) => {
  const baseId = useId();
  const surfaceId = id ?? `${baseId}-tooltip`;
  const titleId = `${baseId}-title`;
  const contentId = `${baseId}-content`;

  const hasContent = isRenderable(content);
  const hasTitle = isRenderable(title);
  const hasActions = isRenderable(actions);
  const variant =
    variantProp ?? (hasTitle || hasActions || persistent ? "rich" : "plain");
  const rich = variant === "rich";
  const interactive = interactiveProp ?? (hasActions || persistent);

  // How the anchor refers to the tooltip. A tooltip with controls is announced
  // as a popup instead; plain text can name or describe the anchor outright.
  const text =
    typeof content === "string" || typeof content === "number"
      ? String(content)
      : undefined;
  const anchorProps = (
    isValidElement(children) ? children.props : {}
  ) as Record<string, unknown>;
  const labels = !interactive && relationship === "label" && text !== undefined;
  const describes = !interactive && !labels && relationship !== "none";
  // Saying the anchor's own name twice helps nobody ("Save, button, Save").
  const repeatsLabel = text !== undefined && text === anchorProps["aria-label"];
  const description =
    describes && text !== undefined && !repeatsLabel ? text : undefined;

  const logic = useLogic({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    persistent,
    caret,
    rich,
    hasContent,
    description,
    side,
    align,
    offset,
    alignOffset,
    collisionPadding,
    flip,
    showDelay,
    hideDelay,
    skipDelay,
    touchShowDelay,
    touchHideDelay,
    container,
  });

  let describedBy: string | undefined;
  if (description !== undefined) {
    // Plain text: a hidden node that exists before the tooltip ever opens.
    describedBy = logic.descriptionId;
  } else if (describes && text === undefined && logic.open) {
    // Rich content: the tooltip itself, while it's on screen.
    describedBy = surfaceId;
  }

  // `Slot` lets the anchor's own props win, so its `aria-describedby` has to
  // be merged by hand; everything else is the anchor's to override.
  const ownDescribedBy = anchorProps["aria-describedby"];
  const anchor =
    describedBy && ownDescribedBy && isValidElement(children)
      ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
          "aria-describedby": joinIds(ownDescribedBy, describedBy),
        })
      : children;

  const { environment } = logic;
  // A long-press shows the tooltip, so iOS's callout mustn't cover it. Links
  // keep theirs (link preview, "Open in new tab"), and persistent tooltips
  // don't use long-press at all.
  const isLink =
    isValidElement(children) &&
    children.type === "a" &&
    anchorProps.href !== undefined;
  const anchorClassName = persistent || isLink ? undefined : ANCHOR;

  return (
    <>
      <Slot.Root
        ref={logic.attachAnchor}
        className={anchorClassName}
        aria-label={labels ? text : undefined}
        aria-describedby={describedBy}
        aria-haspopup={interactive ? "dialog" : undefined}
        aria-expanded={interactive ? logic.open : undefined}
        aria-controls={interactive && logic.open ? surfaceId : undefined}
      >
        {anchor}
      </Slot.Root>
      {logic.mounted &&
        environment &&
        createPortal(
          <div
            ref={logic.attachPositioner}
            popover="manual"
            dir={environment.dir}
            data-slot="tooltip-positioner"
            data-state={logic.status}
            data-variant={variant}
            data-hoverable={hoverable}
            className={`${MOTION} ${OVERLAY_POSITIONER} ${POSITIONER} ${hoverable ? HOVER_BRIDGE : ""}`}
          >
            <div
              ref={logic.popupRef}
              data-slot="tooltip-popup"
              className={POPUP}
            >
              <div
                data-slot="tooltip"
                role={role ?? (interactive ? "dialog" : "tooltip")}
                id={surfaceId}
                aria-labelledby={
                  interactive ? (hasTitle ? titleId : contentId) : undefined
                }
                aria-describedby={
                  interactive && hasTitle ? contentId : undefined
                }
                className={cn(
                  tooltipVariants({ variant, withActions: hasActions }),
                  className,
                )}
                {...props}
              >
                {caret && <TooltipCaret ref={logic.caretRef} />}
                {rich ? (
                  <>
                    {hasTitle && (
                      <div
                        id={titleId}
                        data-slot="tooltip-title"
                        className={TITLE}
                      >
                        {title}
                      </div>
                    )}
                    <div
                      id={contentId}
                      data-slot="tooltip-content"
                      className={SUPPORTING_TEXT}
                    >
                      {content}
                    </div>
                    {hasActions && (
                      <div data-slot="tooltip-actions" className={ACTIONS}>
                        {actions}
                      </div>
                    )}
                  </>
                ) : (
                  <span
                    id={contentId}
                    data-slot="tooltip-content"
                    className={PLAIN_TEXT}
                  >
                    {content}
                  </span>
                )}
              </div>
            </div>
          </div>,
          environment.root,
        )}
    </>
  );
};

export default Tooltip;
