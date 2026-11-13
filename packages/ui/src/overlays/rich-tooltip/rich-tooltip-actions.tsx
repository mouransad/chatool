"use client";

import { useLayoutEffect } from "react";
import { cn } from "@chatool/utils";

import { useRichTooltipContext } from "./rich-tooltip-context";
import { type RichTooltipActionsProps } from "./rich-tooltip.types";
import { ACTIONS } from "./rich-tooltip.variants";

/**
 * The rich tooltip's action row: up to two `RichTooltipAction`s (MD3), side
 * by side and start-aligned, their labels lined up with the text. Its
 * presence makes the tooltip interactive and switches the surface to its 8dp
 * bottom padding. Clicking any button or link in it closes the tooltip unless
 * it (or an ancestor) has `data-tooltip-keep-open`.
 */
const RichTooltipActions = ({
  className,
  ...props
}: RichTooltipActionsProps) => {
  const { registerInteractive } = useRichTooltipContext("RichTooltipActions");

  useLayoutEffect(() => registerInteractive(), [registerInteractive]);

  return (
    <div
      data-slot="rich-tooltip-actions"
      className={cn(ACTIONS, className)}
      {...props}
    />
  );
};

export default RichTooltipActions;
