import type * as React from "react";

import { CARD_CHECK } from "./card.variants";

interface CardCheckProps {
  /** A custom glyph; defaults to MD3's check-circle. */
  icon?: React.ReactNode;
}

/**
 * The checked-card indicator (MDC-Android `checkedIcon`): a 24dp check-circle
 * at the card's top-end corner, shown while the card is selected. Purely
 * visual (`aria-hidden`) — selection is conveyed by `aria-pressed` / the
 * checked `<input>`. The circle is `secondary` and the check `on-secondary`
 * (not a cut-out), so it stays legible over full-bleed photos.
 */
const CardCheck = ({ icon }: CardCheckProps) => (
  <span data-slot="card-check" aria-hidden className={CARD_CHECK}>
    {icon ?? (
      <svg viewBox="0 0 24 24" focusable="false">
        <circle
          cx="12"
          cy="12"
          r="10"
          className="fill-[var(--md-comp-card-checked-icon-color,var(--md-sys-color-secondary))] forced-colors:fill-[Highlight]"
        />
        <path
          d="m10.6 16.6 7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4Z"
          className="fill-[var(--md-comp-card-checked-icon-check-color,var(--md-sys-color-on-secondary))] forced-colors:fill-[HighlightText]"
        />
      </svg>
    )}
  </span>
);

export default CardCheck;
