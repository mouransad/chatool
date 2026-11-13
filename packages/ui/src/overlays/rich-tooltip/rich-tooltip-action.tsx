"use client";

import { useState } from "react";
import type * as React from "react";
import { cn } from "@chatool/utils";

import Button from "../../buttons/button/button";
import { useRichTooltipContext } from "./rich-tooltip-context";
import { type RichTooltipActionProps } from "./rich-tooltip.types";
import { ACTION } from "./rich-tooltip.variants";

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as PromiseLike<unknown>).then === "function";

/**
 * A rich tooltip's action: MD3's `primary` **text button** (`label-large`,
 * 40dp tall in M3 Expressive, state layers in `primary`), with the 12dp side
 * padding the action row is built around so its label lines up with the
 * text. It is `Button` with those presets: every `Button` prop works
 * (`asChild` for a link, `startIcon`, …).
 *
 * - **Closes** the tooltip after a click (`closeOnClick`, default `true`),
 *   handing focus back to the trigger. `event.preventDefault()` in `onClick`
 *   keeps it open for that click.
 * - **Async:** return a promise from `onClick` and the button shows its
 *   spinner while the tooltip holds open (the pointer or focus wandering off
 *   won't close it); it closes once the promise resolves, and stays open if
 *   it rejects so the person can retry.
 */
const RichTooltipAction = ({
  className,
  variant = "text",
  size = "s",
  closeOnClick = true,
  loading,
  onClick,
  ...props
}: RichTooltipActionProps) => {
  const { close, hold } = useRichTooltipContext("RichTooltipAction");
  const [pending, setPending] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const result = onClick?.(event);
    const shouldClose = closeOnClick && !event.defaultPrevented;
    const native = event.nativeEvent;

    if (!isPromiseLike(result)) {
      if (shouldClose) close("action", native);
      return;
    }

    const release = hold();
    setPending(true);
    Promise.resolve(result).then(
      () => {
        release();
        setPending(false);
        if (shouldClose) close("action", native);
      },
      () => {
        release();
        setPending(false);
      },
    );
  };

  return (
    <Button
      data-slot="rich-tooltip-action"
      // The action closes the tooltip itself (after any promise), so the
      // shared controller's generic "a control in the row was clicked" close
      // must not run first.
      data-tooltip-keep-open=""
      variant={variant}
      size={size}
      loading={Boolean(loading) || pending}
      className={cn(ACTION, className)}
      onClick={handleClick}
      {...props}
    />
  );
};

export default RichTooltipAction;
