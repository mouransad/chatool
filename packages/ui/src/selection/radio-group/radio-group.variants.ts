import { cva } from "class-variance-authority";

/*
 * The MD3 radio **group**: a `<fieldset role="radiogroup">` with an optional
 * `<legend>` title, the radios, and optional supporting text.
 *
 * It paints nothing itself. Its variants set **inherited locals** the radios
 * read as fallbacks (a radio's own prop always wins):
 *
 * - `--_rg-accent` — the group's `color` (selected ring + dot role).
 * - `--_rg-lp` — the group's `labelPosition` (`row` / `row-reverse`).
 * - `--_rg-dir` — the item flow from `orientation`.
 * - `--_rg-inset` — how far the legend and supporting text are inset so they
 *   line up with the radio *icon* (14dp inside its 48dp target) instead of the
 *   invisible target edge; `0` when the text comes first (`labelPosition`
 *   `start`, via `--_rg-inset-start`), where the labels themselves are flush —
 *   a separate local so the result never depends on Tailwind's rule order.
 */
export const radioGroupVariants = cva(
  "group/radio-group m-0 min-w-0 p-0 border-0 [--_rg-inset:var(--_rg-inset-start,calc((var(--md-comp-radio-touch-target-size,3rem)_-_var(--md-comp-radio-icon-size,1.25rem))/2))]",
  {
    variants: {
      /**
       * How options flow. MD3: list radios **vertically** and avoid horizontal
       * lists; `horizontal` is for a few short options (it wraps).
       */
      orientation: {
        vertical: "[--_rg-dir:column]",
        horizontal: "[--_rg-dir:row]",
      },
      /** Default selected role for every radio in the group. */
      color: {
        primary: "[--_rg-accent:var(--md-sys-color-primary)]",
        secondary: "[--_rg-accent:var(--md-sys-color-secondary)]",
        tertiary: "[--_rg-accent:var(--md-sys-color-tertiary)]",
      },
      /** Default label side for every radio in the group (logical, RTL-aware). */
      labelPosition: {
        end: "[--_rg-lp:row]",
        start: "[--_rg-inset-start:0px] [--_rg-lp:row-reverse]",
      },
    },
    defaultVariants: { orientation: "vertical" },
  },
);

/** The group title: MD3 title-small `on-surface`, dimmed when disabled. */
export const LEGEND =
  "float-none mb-1 p-0 ps-[var(--_rg-inset)] text-title-small text-on-surface group-disabled/radio-group:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] forced-colors:group-disabled/radio-group:text-[color:GrayText]";

/** The options: a flex flow driven by `--_rg-dir` (wraps when horizontal). */
export const ITEMS =
  "flex flex-wrap gap-x-4 [flex-direction:var(--_rg-dir,column)]";

/**
 * Group supporting text: body-small `on-surface-variant`; `error` when the
 * group is invalid (`error` / `aria-invalid`) or the user left a `required`
 * group empty (`:user-invalid`).
 */
export const SUPPORTING_TEXT =
  "mt-1 ps-[var(--_rg-inset)] text-body-small text-on-surface-variant group-aria-invalid/radio-group:text-error group-has-[input:user-invalid]/radio-group:text-error group-disabled/radio-group:text-[color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] forced-colors:group-disabled/radio-group:text-[color:GrayText]";
