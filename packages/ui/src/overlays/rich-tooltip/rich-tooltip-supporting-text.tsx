"use client";

import { useId, useLayoutEffect } from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { useRichTooltipContext } from "./rich-tooltip-context";
import { type RichTooltipSupportingTextProps } from "./rich-tooltip.types";
import { SUPPORTING_TEXT } from "./rich-tooltip.variants";

/**
 * The rich tooltip's supporting text: `body-medium`, `on-surface-variant`.
 * It may hold inline links (MD3), styled `primary` and underlined; any link
 * makes the tooltip interactive, so keyboard users can Tab to it. An
 * interactive tooltip is described by it (labelled by it without a subhead).
 * `asChild` renders it as your own element.
 */
const RichTooltipSupportingText = ({
  asChild = false,
  className,
  id: idProp,
  ...props
}: RichTooltipSupportingTextProps) => {
  const { registerSupportingText } = useRichTooltipContext(
    "RichTooltipSupportingText",
  );
  const generatedId = useId();
  const id = idProp ?? generatedId;

  useLayoutEffect(
    () => registerSupportingText(id),
    [registerSupportingText, id],
  );

  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      id={id}
      data-slot="rich-tooltip-supporting-text"
      className={cn(SUPPORTING_TEXT, className)}
      {...props}
    />
  );
};

export default RichTooltipSupportingText;
