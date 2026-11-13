"use client";

import { useId, useLayoutEffect } from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { useRichTooltipContext } from "./rich-tooltip-context";
import { type RichTooltipSubheadProps } from "./rich-tooltip.types";
import { SUBHEAD } from "./rich-tooltip.variants";

/**
 * The rich tooltip's optional subhead: `title-small`, `on-surface-variant`.
 * MD3: a few words, one line, summarizing the message; include one whenever
 * the tooltip appears on its own (page load). An interactive tooltip is
 * labelled by it. `asChild` renders it as your own element (e.g. a heading).
 */
const RichTooltipSubhead = ({
  asChild = false,
  className,
  id: idProp,
  ...props
}: RichTooltipSubheadProps) => {
  const { registerSubhead } = useRichTooltipContext("RichTooltipSubhead");
  const generatedId = useId();
  const id = idProp ?? generatedId;

  useLayoutEffect(() => registerSubhead(id), [registerSubhead, id]);

  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      id={id}
      data-slot="rich-tooltip-subhead"
      className={cn(SUBHEAD, className)}
      {...props}
    />
  );
};

export default RichTooltipSubhead;
