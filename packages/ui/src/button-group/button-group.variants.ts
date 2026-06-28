import { cva } from "class-variance-authority";

/*
 * Material Design 3 button group. `standard` spaces its buttons; `connected`
 * collapses them into a single segmented surface (outer corners stay rounded,
 * inner corners square, borders overlap). Works horizontally or vertically.
 */
export const buttonGroupVariants = cva("inline-flex", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    variant: {
      standard: "gap-2",
      connected: "gap-0",
    },
  },
  compoundVariants: [
    {
      variant: "connected",
      orientation: "horizontal",
      class:
        "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
    },
    {
      variant: "connected",
      orientation: "vertical",
      class:
        "[&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    variant: "standard",
  },
});
