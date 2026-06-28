import { cva } from "class-variance-authority";

import { BASE, DISABLED, FOCUS_RING, STATE_LAYER } from "../internal/classes";
import { colorPalette } from "../internal/colors";
import { labelSize } from "../internal/sizes";

/*
 * Material Design 3 toggle / segmented button group. The group connects its
 * items into one segmented surface; each item is an outlined button that takes
 * the tonal (selected) look and reveals a leading check when `data-state="on"`.
 */
export const toggleButtonGroupVariants = cva("inline-flex w-fit", {
  variants: {
    orientation: {
      horizontal:
        "flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
      vertical:
        "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const toggleButtonItemVariants = cva(
  `${BASE} ${STATE_LAYER} ${FOCUS_RING} ${DISABLED} group rounded-full border border-[var(--md-sys-color-outline)] bg-[var(--md-comp-toggle-button-container-color,var(--_bg))] text-[var(--md-comp-toggle-button-label-text-color,var(--_fg))] [--_bg:transparent] [--_fg:var(--md-sys-color-on-surface)] [--_state:var(--_main)] data-[state=on]:border-transparent data-[state=on]:[--_bg:var(--_container)] data-[state=on]:[--_fg:var(--_on-container)] data-[state=on]:[--_state:var(--_on-container)]`,
  {
    variants: {
      color: colorPalette,
      size: labelSize,
    },
    defaultVariants: {
      color: "primary",
      size: "s",
    },
  },
);
