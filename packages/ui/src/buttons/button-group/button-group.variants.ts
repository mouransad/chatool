import { cva } from "class-variance-authority";

/*
 * Material Design 3 button group — an **invisible container** that spaces and
 * shapes its `Button` / `IconButton` children (it is a layout, not an interactive
 * surface, so it does **not** compose the family's `BASE` / `STATE_LAYER` /
 * `FOCUS_RING` / `DISABLED` fragments). Two variants:
 *
 * - **standard** — the family gap; children keep their own (pill / square) shape.
 * - **connected** — a tight 2dp gap and a **shared track**: every child's corners
 *   are squared off (`rounded-none`) and only the group's leading/trailing edges
 *   round, so the row/column reads as one segmented control. The override is
 *   marked important (`!`) so it wins over each child's own `rounded-*` regardless
 *   of CSS source order (connected children therefore don't keep their individual
 *   press shape-morph — the track shape is fixed, which is the intended look).
 *
 * The connected gap is overridable via `--md-comp-button-group-gap`. See
 * docs/conventions/material-design.md.
 */
export const buttonGroupVariants = cva("inline-flex", {
  variants: {
    variant: {
      standard: "gap-[var(--md-comp-button-group-gap,0.5rem)]",
      connected: "gap-[var(--md-comp-button-group-gap,0.125rem)]",
    },
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-col items-stretch",
    },
  },
  compoundVariants: [
    {
      variant: "connected",
      orientation: "horizontal",
      class:
        "[&>*]:rounded-none! [&>*:first-child]:rounded-l-full! [&>*:last-child]:rounded-r-full!",
    },
    {
      variant: "connected",
      orientation: "vertical",
      class:
        "[&>*]:rounded-none! [&>*:first-child]:rounded-t-full! [&>*:last-child]:rounded-b-full!",
    },
  ],
  defaultVariants: {
    variant: "standard",
    orientation: "horizontal",
  },
});
