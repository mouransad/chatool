import type * as React from "react";

import { CARET, CARET_SHAPE } from "./tooltip.variants";

interface TooltipCaretProps {
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * The tooltip's caret: Compose's default caret shape, a 16×8dp triangle in the
 * container color. Drawn pointing down; `position.ts` places it on the
 * anchor-facing edge and rotates it. Purely decorative.
 */
const TooltipCaret = ({ ref }: TooltipCaretProps) => (
  <span ref={ref} aria-hidden data-slot="tooltip-caret" className={CARET}>
    <svg viewBox="0 0 16 8" preserveAspectRatio="none" className={CARET_SHAPE}>
      <path d="M0 0H16L8 8Z" />
    </svg>
  </span>
);

export default TooltipCaret;
