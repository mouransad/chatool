import { cva } from "class-variance-authority";

import {
  AVATAR,
  CLAMP,
  CONTENT,
  CONTROL,
  DETAILS,
  DIVIDER,
  DRAG_HANDLE,
  EXPANDABLE,
  EXPAND_ICON,
  GEOMETRY,
  GROUP,
  HEADLINE,
  ICON,
  IMAGE,
  INTERACTIVE,
  LEADING,
  LIST,
  LIST_DENSITY,
  LIST_DIVIDERS,
  LIST_VARIANT,
  MOTION,
  OVERLINE,
  POSITION,
  RESET,
  RIPPLE,
  ROW,
  STATES,
  STRETCH,
  SUMMARY,
  SUPPORTING_TEXT,
  TEXT,
  TRAILING,
  TRAILING_TEXT,
  VIDEO,
} from "../config";

/*
 * Material Design 3 **Expressive list** (m3.material.io/components/lists).
 * Every number, color role and spring is documented — with its source — in
 * `../config.ts`; this file only assembles the fragments.
 */

/**
 * The list root (`<ul>` / listbox). `variant` and `density` set **inherited**
 * locals that every item reads, so server-rendered items follow the list's
 * style without seeing its props.
 */
export const listVariants = cva(LIST, {
  variants: {
    /** Standard (flush, transparent) or segmented (2dp gaps, filled items). */
    variant: {
      standard: LIST_VARIANT.standard,
      segmented: LIST_VARIANT.segmented,
    },
    /** MD3 density step — 4dp off each item per step. */
    density: {
      "0": LIST_DENSITY["0"],
      "-1": LIST_DENSITY["-1"],
      "-2": LIST_DENSITY["-2"],
      "-3": LIST_DENSITY["-3"],
    },
    /** 1dp dividers between items. */
    dividers: { true: LIST_DIVIDERS, false: "" },
  },
  defaultVariants: { variant: "standard", density: "0", dividers: false },
});

/**
 * A list row — the `<li>` of a `ListItem` (and, without the position locals,
 * the `<summary>` of a `ListItemExpandable`). Every state is CSS: attributes
 * (`data-selected`, `data-disabled`, `data-dragged`, `data-lines`,
 * `data-align`, `data-interactive`, `aria-selected`) and pseudo-classes of
 * its action / control.
 */
export const listItemVariants = cva(
  [MOTION, RESET, GEOMETRY, ROW, STATES, INTERACTIVE],
  {
    variants: {
      /**
       * `item` — a top-level `[data-list-item]` row that takes the list's outer
       * corners by position; `summary` — an expandable item's row, which
       * inherits them from its wrapper.
       */
      part: { item: POSITION, summary: SUMMARY },
    },
    defaultVariants: { part: "item" },
  },
);

/** The primary action / label / content element (see `CONTENT`). */
export const LIST_ITEM_CONTENT = CONTENT;
/** Its row-wide `::after` (interactive rows only). */
export const LIST_ITEM_STRETCH = STRETCH;
/** The text column. */
export const LIST_ITEM_TEXT = TEXT;
/** Overline. */
export const LIST_ITEM_OVERLINE = OVERLINE;
/** Headline. */
export const LIST_ITEM_HEADLINE = HEADLINE;
/** Supporting text. */
export const LIST_ITEM_SUPPORTING_TEXT = SUPPORTING_TEXT;
/** Line clamp (reads `--_li-clamp`). */
export const LIST_ITEM_CLAMP = CLAMP;
/** Leading slot. */
export const LIST_ITEM_LEADING = LEADING;
/** Trailing slot. */
export const LIST_ITEM_TRAILING = TRAILING;
/** Trailing supporting text. */
export const LIST_ITEM_TRAILING_TEXT = TRAILING_TEXT;
/** Selection-control slot. */
export const LIST_ITEM_CONTROL = CONTROL;
/** The row ripple's extra classes. */
export const LIST_ITEM_RIPPLE = RIPPLE;
/** An expandable item's wrapper `<li>`. */
export const LIST_ITEM_EXPANDABLE = `${POSITION} ${EXPANDABLE} [&:nth-last-child(1_of_[data-list-item])>details>summary]:after:hidden`;
/** An expandable item's `<details>`. */
export const LIST_ITEM_DETAILS = DETAILS;
/** An expandable item's children `<ul>`. */
export const LIST_ITEM_GROUP = GROUP;
/** The expand indicator. */
export const LIST_ITEM_EXPAND_ICON = EXPAND_ICON;
/** A `ListDivider`. */
export const LIST_DIVIDER = DIVIDER;

/** `ListItemIcon`. */
export const listItemIconVariants = cva(ICON);

/** `ListItemAvatar`. */
export const listItemAvatarVariants = cva(AVATAR);

/** `ListItemImage`. */
export const listItemImageVariants = cva(IMAGE);

/** `ListItemVideo` — small 100×56dp or large 114×64dp. */
export const listItemVideoVariants = cva(VIDEO, {
  variants: {
    size: {
      small:
        "h-[var(--md-comp-list-item-small-leading-video-height,3.5rem)] w-[var(--md-comp-list-item-small-leading-video-width,6.25rem)]",
      large:
        "h-[var(--md-comp-list-item-large-leading-video-height,4rem)] w-[var(--md-comp-list-item-large-leading-video-width,7.125rem)]",
    },
  },
  defaultVariants: { size: "small" },
});

/** `ListItemDragHandle`. */
export const listItemDragHandleVariants = cva(DRAG_HANDLE);
