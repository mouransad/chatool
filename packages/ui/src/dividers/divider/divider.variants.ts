import { cva } from "class-variance-authority";

import { LINE_COLOR, THICKNESS } from "../config";

/*
 * Material Design 3 **divider**: a thin line that groups content in lists and
 * containers (m3.material.io/components/divider). It's a static, decorative
 * element, so there is no state layer, focus ring or motion — the craft is in
 * getting the line exactly right everywhere it can land:
 *
 * - **The line is a border** (`border-top` horizontal, `border-inline-start`
 *   vertical) on a zero-size box, so it is exactly `--_thickness` thick, stays
 *   crisp, and survives `forced-colors` (see config.ts).
 * - **Insets are logical margins** (`margin-inline-*` horizontally, block margins
 *   vertically), so `start` follows the reading direction in RTL with no extra
 *   code, and a consumer `mx-*` / `my-*` className wins through `cn`.
 * - **Stretches to its container** (`align-self: stretch`) instead of forcing
 *   `width: 100%`, so insets never overflow: full-width in block, flex-column and
 *   grid layouts; a vertical divider fills the height of a flex row.
 * - **Labelled** (children): the wrapper becomes a flex row (or column) whose
 *   `::before` / `::after` draw the two line segments around the label, so the
 *   lines are invisible to assistive tech and the label stays readable text.
 *
 * The base resets `margin` / `padding` / `border` so the same classes work on
 * `<hr>` (UA `margin: 0.5em auto; border-style: inset`), `<div>` and `<li>`, with
 * or without Tailwind's preflight.
 *
 * Tokens: `--md-comp-divider-color`, `-thickness`, `-heavy-thickness`,
 * `-inset-start`, `-inset-end`, `-label-text-color`, `-label-space`.
 */

/** Two pseudo-element segments around a label, inheriting the line color. */
const LABELLED =
  "items-center gap-[var(--md-comp-divider-label-space,0.5rem)] text-center text-label-medium text-[color:var(--md-comp-divider-label-text-color,var(--md-sys-color-on-surface-variant))] before:flex-1 before:border-0 before:border-solid before:border-[color:inherit] before:content-[''] after:flex-1 after:border-0 after:border-solid after:border-[color:inherit] after:content-['']";

export const dividerVariants = cva(
  `m-0 p-0 shrink-0 border-0 border-solid ${LINE_COLOR}`,
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "",
      },
      /**
       * MD3 inset types. `start` is the spec's "inset" divider (16dp leading,
       * 0dp trailing); `middle` is "middle-inset" (16dp both sides).
       */
      inset: {
        none: "",
        start: "",
        end: "",
        middle: "",
      },
      weight: THICKNESS,
      labelPosition: {
        start: "",
        center: "",
        end: "",
      },
      /** Internal: set by the view when the divider has a label. */
      labelled: {
        false: "",
        true: LABELLED,
      },
    },
    compoundVariants: [
      // ── The plain line ────────────────────────────────────────────────────
      {
        orientation: "horizontal",
        labelled: false,
        class:
          "h-0 block w-auto self-stretch border-t-[length:var(--_thickness)]",
      },
      {
        orientation: "vertical",
        labelled: false,
        // `min-h-[1em]` keeps an inline vertical divider (between words or
        // links) visible outside a flex row; in a flex row `self-stretch` wins.
        class:
          "w-0 inline-block h-auto min-h-[1em] self-stretch border-s-[length:var(--_thickness)] align-middle",
      },
      // ── Labelled: two segments around the label ───────────────────────────
      {
        orientation: "horizontal",
        labelled: true,
        class:
          "before:min-w-4 after:min-w-4 flex flex-row self-stretch before:border-t-[length:var(--_thickness)] after:border-t-[length:var(--_thickness)]",
      },
      {
        orientation: "vertical",
        labelled: true,
        class:
          "before:min-h-4 after:min-h-4 inline-flex flex-col self-stretch before:border-s-[length:var(--_thickness)] after:border-s-[length:var(--_thickness)]",
      },
      { labelled: true, labelPosition: "start", class: "before:hidden" },
      { labelled: true, labelPosition: "end", class: "after:hidden" },
      // ── Insets (logical, so RTL flips them) ───────────────────────────────
      {
        orientation: "horizontal",
        inset: ["start", "middle"],
        class: "ms-[var(--md-comp-divider-inset-start,1rem)]",
      },
      {
        orientation: "horizontal",
        inset: ["end", "middle"],
        class: "me-[var(--md-comp-divider-inset-end,1rem)]",
      },
      {
        orientation: "vertical",
        inset: ["start", "middle"],
        class: "mt-[var(--md-comp-divider-inset-start,1rem)]",
      },
      {
        orientation: "vertical",
        inset: ["end", "middle"],
        class: "mb-[var(--md-comp-divider-inset-end,1rem)]",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      inset: "none",
      weight: "regular",
      labelPosition: "center",
      labelled: false,
    },
  },
);
