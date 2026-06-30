import { cva } from "class-variance-authority";

/*
 * Material Design 3 **Expressive** button group — an invisible container that
 * arranges `Button` / `IconButton` children and adds the group-level interaction.
 * It is a layout (not an interactive surface), so it does **not** compose the
 * family's `BASE` / `STATE_LAYER` / `FOCUS_RING` / `DISABLED` fragments, and it
 * **never overrides a child's border-radius** — every button keeps its own
 * default (finite, per-size) shape and its own built-in `selected` shape-morph, so
 * selecting / deselecting animates smoothly between finite radii (forcing
 * `rounded-full` would interpolate from a near-infinite value and snap — the same
 * trap config.ts avoids). Two variants, per the spec
 * (m3.material.io/components/button-groups):
 *
 * - **standard** — children stay flexible (equal share); **on press the pressed
 *   child expands while its neighbors compress** (the Expressive "squish").
 *   Implemented in pure CSS: children are `flex-1`, the pressed child (`:active`)
 *   grows, animated via an **important** `transition-property` **superset** that
 *   re-declares the child's own animated props *plus* `flex-grow`, so the width
 *   transition never clobbers the button's press shape-morph. ~12dp gap.
 *
 * - **connected** — a tight **2dp** cluster (no width interaction between buttons,
 *   per the spec). Children keep their rounded shape; the **selected** child morphs
 *   via its own `selected` round→square animation (smooth, finite).
 *
 * Gap is overridable via `--md-comp-button-group-gap`. See
 * docs/conventions/material-design.md.
 */

/** MD3 standard easing + short duration for the squish. */
const SQUISH_MOTION =
  "[transition-duration:var(--md-sys-motion-duration-short4)]! [transition-timing-function:var(--md-sys-motion-easing-standard)]!";

export const buttonGroupVariants = cva("inline-flex items-stretch", {
  variants: {
    variant: {
      standard: [
        "gap-[var(--md-comp-button-group-gap,0.75rem)]",
        "[&>*]:min-w-0 [&>*]:flex-1",
        // Re-declare the child's own animated props + flex-grow so the squish
        // width animation coexists with the button's press shape-morph.
        "[&>*]:[transition-property:flex-grow,background-color,box-shadow,border-color,border-radius]!",
        SQUISH_MOTION,
        "[&>*:active]:grow-[1.6]",
      ].join(" "),
      connected: "gap-[var(--md-comp-button-group-gap,0.125rem)]",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    variant: "standard",
    orientation: "horizontal",
  },
});
