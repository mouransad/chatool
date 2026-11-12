import { isValidElement } from "react";
import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Ripple from "../../buttons/ripple";
import CardCheck from "./card-check";
import { type CardProps } from "./card.types";
import { CARD_RIPPLE, cardVariants } from "./card.variants";

/** Native elements that make an `asChild` card directly actionable. */
const ACTIONABLE_TAGS = new Set(["a", "button", "label", "summary"]);

/**
 * MD3 card — a container for content and actions about a single subject. This
 * module carries **no client directive**: a pure props→JSX component
 * (Server-Component-safe, works in any framework). Every state is CSS, driven
 * from attributes and pseudo-classes; the only client piece is the shared press
 * `Ripple` island, rendered for directly actionable cards.
 *
 * Two kinds of card, per MD3 accessibility guidance:
 *
 * - **Container** (default, a `<div>`): no role, no tab stop, no hover, no
 *   ripple. Its nested buttons/links are the tab stops, in reading order.
 * - **Directly actionable**: one tab stop for the whole card, with hover /
 *   pressed / focus states and a ripple. Either the card **is** the control
 *   (`asChild` onto an `<a>` / `<button>` / `<label>` — keep its content short
 *   and phrasing-only, since the whole card becomes its accessible name), or
 *   — the recommended pattern for rich cards — a container with a
 *   `CardPrimaryAction` (a real link/button, usually the headline text) that
 *   stretches over the card, so headings stay headings and secondary controls
 *   stay separately reachable.
 */
const Card = ({
  className,
  variant,
  shape,
  orientation,
  asChild = false,
  interactive,
  disabled = false,
  dragged = false,
  selected,
  checkIcon,
  children,
  ...props
}: CardProps) => {
  const child =
    asChild && isValidElement<Record<string, unknown>>(children)
      ? children
      : undefined;
  const tag = typeof child?.type === "string" ? child.type : undefined;
  const actionable =
    interactive ??
    (child !== undefined &&
      ((tag !== undefined && ACTIONABLE_TAGS.has(tag)) ||
        child.props.href != null ||
        typeof child.props.onClick === "function"));
  const isButton = tag === "button";

  const showCheck = checkIcon ?? selected !== undefined;
  const Comp = (asChild ? Slot.Root : "div") as React.ElementType;

  return (
    <Comp
      data-slot="card"
      data-variant={variant ?? "filled"}
      data-orientation={orientation ?? "vertical"}
      data-interactive={actionable || undefined}
      data-selected={selected || undefined}
      data-dragged={dragged || undefined}
      data-disabled={disabled || undefined}
      // `<button>`: the native, fully blocking `disabled` + the toggle state.
      disabled={isButton && disabled ? true : undefined}
      aria-pressed={isButton && selected !== undefined ? selected : undefined}
      // Other actionable cards (links, labels, custom controls) can only be
      // marked; the container card is taken out of interaction entirely.
      aria-disabled={disabled && actionable && !isButton ? true : undefined}
      inert={disabled && !actionable ? true : undefined}
      className={cn(cardVariants({ variant, shape, orientation }), className)}
      {...props}
    >
      {/*
       * Decorations go first (both `aria-hidden`), so full-bleed media can find
       * the first/last *content* child; they're absolutely positioned and
       * z-stacked, so DOM order doesn't affect painting.
       */}
      {actionable && <Ripple className={CARD_RIPPLE} />}
      {showCheck !== false && (
        <CardCheck icon={showCheck === true ? undefined : showCheck} />
      )}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
};

export default Card;
