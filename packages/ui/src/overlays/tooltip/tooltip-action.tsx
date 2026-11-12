import { cn } from "@chatool/utils";

import Button from "../../buttons/button/button";
import { type TooltipActionProps } from "./tooltip.types";

/**
 * A rich tooltip's action: MD3's `primary` **text button**, 40dp tall with the
 * 12dp side padding the action row is built around, so its label lines up
 * with the tooltip's text. It is `Button` with those presets; every `Button`
 * prop still applies (`asChild` for a link, `startIcon`, …).
 *
 * Clicking it closes the tooltip. Add `data-tooltip-keep-open` to keep it.
 */
const TooltipAction = ({
  className,
  variant = "text",
  size = "s",
  ...props
}: TooltipActionProps) => (
  <Button
    data-slot="tooltip-action"
    variant={variant}
    size={size}
    className={cn("px-3", className)}
    {...props}
  />
);

export default TooltipAction;
