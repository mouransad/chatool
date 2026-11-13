"use client";

import { cloneElement, isValidElement } from "react";
import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { ANCHOR } from "../tooltip/tooltip.variants";
import { useRichTooltipContext } from "./rich-tooltip-context";
import { type RichTooltipTriggerProps } from "./rich-tooltip.types";

const joinIds = (...ids: unknown[]) =>
  ids.filter((id) => typeof id === "string" && id !== "").join(" ") ||
  undefined;

/**
 * The element a `RichTooltip` belongs to. It renders no element of its own:
 * its one child (a `Button`, `IconButton`, link, any element that forwards
 * its `ref`) receives the listeners and ARIA:
 *
 * - **Interactive** (actions, links, `click` / `manual` triggers): MDC's
 *   rich-tooltip contract, `aria-haspopup="dialog"` + `aria-expanded`, and
 *   `aria-controls` while open.
 * - **Otherwise:** `aria-describedby` the tooltip (a hidden copy of plain
 *   shorthand text exists before it ever opens, so touch screen readers that
 *   never hover still hear it).
 *
 * Its own props go to the child too (the child's win on conflicts).
 */
const RichTooltipTrigger = ({
  children,
  className,
  ...props
}: RichTooltipTriggerProps) => {
  const context = useRichTooltipContext("RichTooltipTrigger");
  const { interactive, open, surfaceId, descriptionId } = context;

  let describedBy: string | undefined;
  if (!interactive) {
    describedBy = descriptionId ?? (open ? surfaceId : undefined);
  }

  // `Slot` lets the child's own props win, so its `aria-describedby` has to
  // be merged by hand.
  const childProps = (isValidElement(children) ? children.props : {}) as Record<
    string,
    unknown
  >;
  const ownDescribedBy = childProps["aria-describedby"];
  const child =
    describedBy && ownDescribedBy && isValidElement(children)
      ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
          "aria-describedby": joinIds(ownDescribedBy, describedBy),
        })
      : children;

  // A touch long-press shows a transient tooltip, so iOS's callout mustn't
  // cover it; links keep theirs ("Open in new tab" is worth more).
  const isLink =
    isValidElement(children) &&
    children.type === "a" &&
    childProps.href !== undefined;

  return (
    <Slot.Root
      ref={context.attachTrigger}
      data-state={open ? "open" : "closed"}
      className={cn(!isLink && ANCHOR, className)}
      aria-describedby={describedBy}
      aria-haspopup={interactive ? "dialog" : undefined}
      aria-expanded={interactive ? open : undefined}
      aria-controls={interactive && open ? surfaceId : undefined}
      {...props}
    >
      {child}
    </Slot.Root>
  );
};

export default RichTooltipTrigger;
