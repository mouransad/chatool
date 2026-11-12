import { cva } from "class-variance-authority";

import {
  DIVIDER,
  INDICATOR,
  INDICATOR_FADE,
  LIST,
  MOTION,
  PANEL_DIRECTION,
  PANEL_ENTER,
  SCROLLABLE,
  SCROLLER,
  TAB,
  TAB_COLORS,
  TAB_DISABLED,
  TAB_FOCUS_RING,
  TAB_MOTION,
  TAB_STATE_LAYER,
  VARIANT,
} from "../config";

/*
 * Material Design 3 **tabs** (m3.material.io/components/tabs). Geometry,
 * colors and motion come from `../config.ts` (where every number is sourced);
 * this file only arranges them into `cva` recipes per part.
 *
 * Tokens: `--md-comp-tabs-container-color`, `-divider-color`,
 * `-divider-height`, `-indicator-color`, `-primary-indicator-height`,
 * `-primary-indicator-shape`, `-primary-indicator-inset`,
 * `-secondary-indicator-height`, `-secondary-indicator-shape`,
 * `-indicator-min-width`, `-active-label-text-color`, `-label-text-color`,
 * `-hover-label-text-color`, `-active-state-layer-color`,
 * `-state-layer-color`, `-pressed-state-layer-color`,
 * `-focus-indicator-color`, `-focus-indicator-shape`, `-container-height`,
 * `-stacked-container-height`, `-icon-size`, `-padding`, `-icon-gap`,
 * `-badge-gap`, `-scrollable-min-width`, `-scrollable-edge-padding`,
 * `-indicator-easing`, `-indicator-leading-duration`,
 * `-indicator-trailing-duration`, `-effects-easing`, `-effects-duration`,
 * `-fast-effects-easing`, `-fast-effects-duration`, `-panel-slide-distance`.
 */

/** The `Tabs` root: a plain column that holds the list and the panels. */
export const tabsVariants = cva("min-w-0 flex flex-col");

/** The `TabList` (`role="tablist"`) container. */
export const tabListVariants = cva(`group/tab-list ${LIST} ${MOTION}`, {
  variants: {
    variant: VARIANT,
    divider: {
      true: DIVIDER,
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    divider: true,
  },
});

/** The row of tabs inside the list (and the scroller when scrollable). */
export const tabScrollerVariants = cva(SCROLLER, {
  variants: {
    layout: {
      fixed: "",
      scrollable: SCROLLABLE,
    },
    /**
     * Fixed tabs: `fill` shares the whole width; `center` / `start` shrink the
     * row to `N × widest tab` (a one-row grid of equal `1fr` columns sized by
     * the widest tab) and align it.
     */
    alignment: {
      fill: "",
      center: "",
      start: "",
    },
  },
  compoundVariants: [
    {
      layout: "fixed",
      alignment: ["center", "start"],
      class: "grid max-w-full flex-none auto-cols-fr grid-flow-col",
    },
    { layout: "fixed", alignment: "center", class: "mx-auto" },
    { layout: "fixed", alignment: "start", class: "me-auto" },
  ],
  defaultVariants: {
    layout: "fixed",
    alignment: "fill",
  },
});

/**
 * The chevron scroll buttons: hidden until the row overflows, dimmed and inert
 * at the matching edge. `auto` keeps them to fine pointers.
 */
export const tabScrollButtonVariants = cva(
  "hidden flex-none self-center group-data-[overflowing]/tab-list:inline-flex",
  {
    variants: {
      edge: {
        start:
          "ms-1 group-data-[at-start]/tab-list:pointer-events-none group-data-[at-start]/tab-list:opacity-38",
        end: "me-1 group-data-[at-end]/tab-list:pointer-events-none group-data-[at-end]/tab-list:opacity-38",
      },
      /** `scrollButtons="auto"`: never on touch-first devices. */
      fineOnly: {
        true: "pointer-coarse:hidden!",
        false: "",
      },
    },
    defaultVariants: { edge: "start", fineOnly: false },
  },
);

/** A `Tab`. */
export const tabVariants = cva(
  `${TAB} ${TAB_COLORS} ${TAB_MOTION} ${TAB_STATE_LAYER} ${TAB_FOCUS_RING} ${TAB_DISABLED}`,
  {
    variants: {
      layout: {
        /** Equal shares of the row (Compose `TabRow`: `rowWidth / tabCount`). */
        fixed: "basis-0 flex-1",
        /** Label width + padding, at least 90dp (Compose `ScrollableTabRowMinTabWidth`). */
        scrollable:
          "min-w-[var(--md-comp-tabs-scrollable-min-width,5.625rem)] flex-none",
      },
      /** Icon above the label: the 64dp container. */
      stacked: {
        true: "[--_tb-h:var(--md-comp-tabs-stacked-container-height,4rem)]",
        false: "",
      },
    },
    defaultVariants: { layout: "fixed", stacked: false },
  },
);

/**
 * The tab's content box (icon + label). It spans the full tab height so the
 * primary indicator — positioned inside it — sits on the bottom edge and is
 * exactly as wide as the content. Secondary tabs make it `static`, so their
 * indicator's containing block is the whole tab (full-width indicator).
 */
export const tabContentVariants = cva(
  "min-w-0 flex items-center justify-center self-stretch",
  {
    variants: {
      variant: {
        primary: "relative",
        secondary: "static",
      },
      /** Stacked: 2dp between icon and label (Material Web). Inline: 8dp (MD3). */
      stacked: {
        true: "gap-0.5 flex-col",
        false: "gap-[var(--md-comp-tabs-icon-gap,0.5rem)]",
      },
    },
    defaultVariants: { variant: "primary", stacked: false },
  },
);

/** The 24dp icon slot; `selectedIcon` swaps in while the tab is selected. */
export const tabIconVariants = cva(
  "relative inline-flex size-[var(--md-comp-tabs-icon-size,1.5rem)] shrink-0 items-center justify-center [&_svg]:size-full [&_svg]:fill-current",
);

/**
 * The label. Fixed tabs may use a second line, then truncate (MD3); scrollable
 * tabs never wrap — they grow instead.
 */
export const tabLabelVariants = cva("min-w-0 text-center", {
  variants: {
    layout: {
      fixed: "line-clamp-2 break-words",
      scrollable: "whitespace-nowrap",
    },
  },
  defaultVariants: { layout: "fixed" },
});

/** The active indicator (one per tab; only the selected one is visible). */
export const tabIndicatorVariants = cva(INDICATOR, {
  variants: {
    fade: {
      true: INDICATOR_FADE,
      false: "",
    },
  },
  defaultVariants: { fade: false },
});

/**
 * `TabPanels`: a plain wrapper, or the swipeable pager — one row of
 * full-width, snap-aligned panels with the scrollbar hidden.
 */
export const tabPanelsVariants = cva(`min-w-0 ${MOTION} ${PANEL_DIRECTION}`, {
  variants: {
    swipeable: {
      true: "flex snap-x snap-mandatory items-start overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      false: "relative",
    },
  },
  defaultVariants: { swipeable: false },
});

/** A `TabPanel`. Focusable by default (APG), with the MD3 focus indicator. */
export const tabPanelVariants = cva(
  "min-w-0 outline-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-[color:var(--md-comp-tabs-focus-indicator-color,var(--md-sys-color-secondary))]",
  {
    variants: {
      swipeable: {
        true: "w-full flex-none snap-start snap-always",
        false: "",
      },
      enter: PANEL_ENTER,
    },
    defaultVariants: { swipeable: false, enter: "none" },
  },
);
