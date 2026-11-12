import { cva } from "class-variance-authority";

/*
 * MD3 chip set layout. Chips sit in a row with an 8dp minimum gap between
 * chips and between wrapped lines (m3.material.io chips guidelines, overridable
 * with `--md-comp-chip-set-gap` / `--md-comp-chip-set-row-gap`).
 *
 * - `wrap` (default): overflowing chips break to the next line and labels
 *   truncate when a chip is wider than the set.
 * - `scroll`: one row that scrolls sideways (MD3: "chip sets can be scrolled
 *   horizontally"). Chips keep their full width; the scroller pads 8dp
 *   vertically (pulled back with a negative margin, so the layout doesn't
 *   move) and 6dp at the ends, so the 3dp focus ring and the 48dp touch
 *   targets aren't clipped. The scrollbar is hidden like Android's chip rows:
 *   arrow keys scroll the focused chip into view, and pointers scroll with a
 *   swipe, a trackpad or Shift + wheel.
 */
export const chipSetVariants = cva(
  "flex items-center gap-x-[var(--md-comp-chip-set-gap,0.5rem)] gap-y-[var(--md-comp-chip-set-row-gap,0.5rem)]",
  {
    variants: {
      layout: {
        wrap: "flex-wrap",
        scroll:
          "-my-2 scroll-px-1.5 px-1.5 py-2 flex-nowrap overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>[data-slot=chip]]:max-w-none",
      },
    },
    defaultVariants: {
      layout: "wrap",
    },
  },
);
