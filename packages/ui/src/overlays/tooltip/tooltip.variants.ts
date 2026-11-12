import { cva } from "class-variance-authority";

/*
 * Material Design 3 tooltip surface (m3.material.io/components/tooltips/specs,
 * Compose `PlainTooltipTokens` / `RichTooltipTokens` + `Tooltip.kt`, Material
 * Web tokens v34, MDC-web `mdc-tooltip`):
 *
 * - **Plain:** `inverse-surface` container, `inverse-on-surface` `body-small`
 *   text, `corner-extra-small` (4dp), 24dp min height (16dp line + 4dp
 *   padding above and below), 8dp side padding, 40dp min / 200dp max width.
 *   One line is centred; wrapped text is start-aligned.
 * - **Rich:** `surface-container` container at elevation level 2,
 *   `corner-medium` (12dp), 320dp max width, 16dp side padding, 12dp top
 *   padding; `title-small` subhead and `body-medium` supporting text, both
 *   `on-surface-variant`, 4dp apart; then 12dp, a 40dp row of up to two
 *   `primary` text buttons and 8dp bottom padding (12dp without buttons).
 *
 * Painted roles read a `--md-comp-plain-tooltip-*` / `--md-comp-rich-tooltip-*`
 * token first (Material Web's names) and fall back to the `--md-sys-*` role.
 * The container color, text color and shape go through `--_tt-*` locals so the
 * caret can paint itself to match. Sizes are `rem`, so tooltips scale with the
 * user's font size like the rest of the library.
 */
export const tooltipVariants = cva(
  "min-h-6 min-w-10 relative box-border cursor-default rounded-[var(--_tt-shape)] bg-[var(--_tt-bg)] [overflow-wrap:anywhere] text-[color:var(--_tt-fg)] forced-colors:outline forced-colors:outline-1 forced-colors:outline-[CanvasText]",
  {
    variants: {
      /** `plain` labels an element; `rich` explains it (subhead, actions). */
      variant: {
        plain:
          "px-2 py-1 max-w-[min(var(--md-comp-plain-tooltip-container-max-width,12.5rem),calc(100vw_-_1rem))] text-center text-body-small [--_tt-bg:var(--md-comp-plain-tooltip-container-color,var(--md-sys-color-inverse-surface))] [--_tt-fg:var(--md-comp-plain-tooltip-supporting-text-color,var(--md-sys-color-inverse-on-surface))] [--_tt-shape:var(--md-comp-plain-tooltip-container-shape,var(--md-sys-shape-corner-extra-small))]",
        rich: "px-4 pt-3 max-w-[min(var(--md-comp-rich-tooltip-container-max-width,20rem),calc(100vw_-_1rem))] text-start text-body-medium [box-shadow:var(--md-comp-rich-tooltip-container-elevation,var(--md-sys-elevation-2))] [--_tt-bg:var(--md-comp-rich-tooltip-container-color,var(--md-sys-color-surface-container))] [--_tt-caret-shadow:drop-shadow(0_1px_2px_color-mix(in_srgb,var(--md-sys-color-shadow)_30%,transparent))_drop-shadow(0_2px_6px_color-mix(in_srgb,var(--md-sys-color-shadow)_15%,transparent))] [--_tt-fg:var(--md-comp-rich-tooltip-supporting-text-color,var(--md-sys-color-on-surface-variant))] [--_tt-shape:var(--md-comp-rich-tooltip-container-shape,var(--md-sys-shape-corner-medium))]",
      },
      /** Rich only: 8dp under the action row, 12dp under bare text. */
      withActions: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "rich", withActions: false, class: "pb-3" },
      { variant: "rich", withActions: true, class: "pb-2" },
    ],
    defaultVariants: { variant: "plain", withActions: false },
  },
);

/**
 * Tooltip-specific additions to the shared overlay positioner: a non-hoverable
 * tooltip (`hoverable={false}`) never takes the pointer, even while open.
 */
export const POSITIONER =
  "data-[hoverable=false]:data-[state=open]:pointer-events-none";

/**
 * The plain tooltip's text. An inline-block inside the centred surface: a
 * single line shrinks to its text and sits centred (also inside the 40dp min
 * width), while wrapped text fills the width and reads start-aligned, as in
 * the MD3 measurements.
 */
export const PLAIN_TEXT = "inline-block text-start align-top";

/** Rich subhead: `title-small` `on-surface-variant`, 4dp above the text. */
export const TITLE =
  "mb-1 text-title-small text-[color:var(--md-comp-rich-tooltip-subhead-color,var(--md-sys-color-on-surface-variant))]";

/**
 * Rich supporting text. Inline links take the `primary` role (MD3: rich
 * tooltips "can optionally contain … hyperlinks").
 */
export const SUPPORTING_TEXT =
  "[&_a]:rounded-xs [&_a]:text-[color:var(--md-comp-rich-tooltip-action-label-text-color,var(--md-sys-color-primary))] [&_a]:underline [&_a]:underline-offset-2";

/**
 * Rich action row: 12dp under the text, 40dp tall, start-aligned, 8dp between
 * buttons. It hangs outside the text column by the buttons' own 12dp padding
 * (`--md-comp-rich-tooltip-action-inset`), so the **labels** line up with the
 * text, as in the MD3 measurements. `TooltipAction` is the matching button.
 */
export const ACTIONS =
  "mx-[calc(0px_-_var(--md-comp-rich-tooltip-action-inset,0.75rem))] mt-3 flex min-h-10 flex-wrap items-center gap-2";

/**
 * The caret: Compose's `TooltipDefaults.caretSize`, 16×8dp, in the container
 * color. `position.ts` places and rotates it to face the anchor. A rich
 * tooltip's caret casts its own shadow (`--_tt-caret-shadow`); the clip keeps
 * that shadow off the surface it hangs from.
 */
export const CARET =
  "pointer-events-none absolute block h-[var(--md-comp-tooltip-caret-height,0.5rem)] w-[var(--md-comp-tooltip-caret-width,1rem)] [clip-path:inset(0_-1rem_-1rem_-1rem)] [filter:var(--_tt-caret-shadow,none)]";

/** The caret's triangle (drawn pointing down, away from the surface). */
export const CARET_SHAPE =
  "block size-full fill-[var(--_tt-bg)] forced-colors:fill-[CanvasText]";

/**
 * On the anchor: keep iOS Safari's long-press callout (link preview / "Copy")
 * from covering the tooltip a touch long-press just opened.
 */
export const ANCHOR = "[-webkit-touch-callout:none]";
