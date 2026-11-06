import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { LABEL } from "../config";
import { badgeContent } from "../format";
import { type BadgeProps } from "./badge.types";
import { badgeAnchorVariants, badgeVariants } from "./badge.variants";

/**
 * MD3 badge: a `small` dot or a `large` count/label pill that marks a
 * notification, count or status on an icon. This module carries **no client
 * directive** — a pure props→JSX component (Server-Component-safe, works in any
 * framework). Its motion is CSS only: `@starting-style` springs it in, size and
 * placement changes morph on a spring, and a changed count remounts the
 * (keyed) label so it pops — no hooks, no state, no client island.
 *
 * Semantics follow MD3 badges › Accessibility:
 *
 * - The **visible glyphs are `aria-hidden`** (a screen reader would otherwise
 *   read "nine nine nine plus"); a visually hidden span carries the full value
 *   (`"1234"`) or, for a dot, `"New notification"`. It's plain text — no role,
 *   no live region — so it's read as part of whatever contains it, e.g. the
 *   button's or link's name.
 * - When the anchor is named by `aria-label` (icon-only buttons), its content —
 *   the badge included — is ignored. State the count there, or point the
 *   anchor's `aria-describedby` at the badge's `id`.
 * - `label=""` makes the badge decorative; `invisible` (or a hidden zero) also
 *   removes it from the accessibility tree while it animates out.
 */
const Badge = ({
  value,
  max = 999,
  maxLength = 4,
  showZero = false,
  invisible = false,
  locale,
  label,
  size,
  color,
  placement,
  anchorClassName,
  asChild = false,
  className,
  children,
  ...props
}: BadgeProps) => {
  const content = badgeContent({ value, max, maxLength, showZero, locale });
  const hidden = invisible || content.empty;
  const resolvedSize = size ?? (content.hasValue ? "large" : "small");
  // A forced `small` badge keeps announcing its count; it just doesn't show it.
  // An `invisible` badge keeps its digits so it shrinks out intact; a zero
  // count doesn't flash a "0" on its way out.
  const text =
    resolvedSize === "large" && !content.empty ? content.text : undefined;
  const spoken = hidden ? "" : (label ?? content.spoken);

  const anchored = children != null && children !== false;

  const badge = (
    <span
      data-slot="badge"
      data-size={resolvedSize}
      data-hidden={hidden || undefined}
      aria-hidden={spoken === "" || undefined}
      className={cn(
        badgeVariants({
          size: resolvedSize,
          color,
          placement,
          anchored,
          hidden,
        }),
        className,
      )}
      {...props}
    >
      {text !== undefined && (
        // Keyed by the text: a new count is a new node, which re-plays the
        // `@starting-style` pop in LABEL.
        <span key={text} data-slot="badge-label" aria-hidden className={LABEL}>
          {text}
        </span>
      )}
      {spoken !== "" && <span className="sr-only">{spoken}</span>}
    </span>
  );

  if (!anchored) return badge;

  if (asChild) {
    return (
      <Slot.Root
        data-slot="badge-anchor"
        className={cn(badgeAnchorVariants({ wrapper: false }), anchorClassName)}
      >
        <Slot.Slottable>{children}</Slot.Slottable>
        {badge}
      </Slot.Root>
    );
  }

  return (
    <span
      data-slot="badge-anchor"
      className={cn(badgeAnchorVariants(), anchorClassName)}
    >
      {children}
      {badge}
    </span>
  );
};

export default Badge;
