import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Ripple from "../../buttons/ripple";
import { type CardPrimaryActionProps } from "./card.types";
import { CARD_PRIMARY_ACTION, CARD_RIPPLE } from "./card.variants";

/**
 * The card's **primary action area** (MD3), built as the accessible "stretched
 * link": a real `<a href>` (or `<button>`) — usually the headline's text — whose
 * `::after` covers the whole card. The card becomes one large target with
 * hover / pressed / focus states and a ripple across its surface, while:
 *
 * - the link's accessible name is just its own text (not the whole card),
 * - headings, lists and media inside the card keep their semantics,
 * - secondary controls (positioned, later in the DOM — every `@chatool/ui`
 *   control is) stay separately clickable and focusable above it.
 *
 * The card reacts to this element through CSS (`:has()`), so the card itself
 * stays a plain container and a Server Component. Trade-off of the pattern: text
 * under the overlay can't be selected by dragging.
 */
const CardPrimaryAction = ({
  className,
  href,
  type,
  asChild = false,
  disabled = false,
  selected,
  children,
  ...props
}: CardPrimaryActionProps) => {
  const isLink = !asChild && href !== undefined;
  const isButton = !asChild && !isLink;
  const Comp = (
    asChild ? Slot.Root : isLink ? "a" : "button"
  ) as React.ElementType;

  return (
    <Comp
      data-slot="card-primary-action"
      // A disabled link drops its `href` — the standard way to make a link
      // inert — and keeps its role so it's still announced, as disabled.
      href={isLink && !disabled ? href : undefined}
      role={isLink && disabled ? "link" : undefined}
      type={isButton ? (type ?? "button") : undefined}
      disabled={isButton && disabled ? true : undefined}
      aria-disabled={!isButton && disabled ? true : undefined}
      aria-pressed={isButton && selected !== undefined ? selected : undefined}
      className={cn(CARD_PRIMARY_ACTION, className)}
      {...props}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      <Ripple className={CARD_RIPPLE} />
    </Comp>
  );
};

export default CardPrimaryAction;
