import { cva } from "class-variance-authority";

/*
 * Material Design 3 **rich tooltip** surface. Sources: the m3.material.io
 * tooltip specs ("Rich tooltip measurements": top 12dp, bottom 8dp, sides
 * 16dp), Compose `RichTooltipTokens` + `RichTooltip` in `Tooltip.kt`
 * (`RichTooltipHorizontalPadding` 16dp, `HeightToSubheadFirstLine` 28dp,
 * `HeightFromSubheadToTextFirstLine` 24dp, `TextBottomPadding` 16dp,
 * `ActionLabelMinHeight` 36dp + `ActionLabelBottomPadding` 8dp,
 * `richTooltipMaxWidth` 320dp, `TooltipMinWidth` 40dp / `MinHeight` 24dp)
 * and Material Web `md-comp-rich-tooltip` tokens:
 *
 * - container `surface-container`, `corner-medium` (12dp), elevation level 2
 *   (shadow only: Compose's tonal elevation is level 0);
 * - subhead `title-small`, supporting text `body-medium`, both
 *   `on-surface-variant`; action labels `label-large` `primary`.
 *
 * In CSS terms: 12dp top padding puts the `title-small` (20/14) baseline at
 * Compose's 28dp; a 4dp gap puts the first `body-medium` baseline 24dp below
 * it. The action row is the shared tooltip `ACTIONS` row (12dp + 40dp, then
 * 8dp bottom padding instead of 12dp, which the surface switches with `:has()`
 * so there is no JS involved). The total height under the text matches
 * Compose's 16 + 36 + 8dp with M3 Expressive's 40dp small text button.
 *
 * Painted roles read Material Web's `--md-comp-rich-tooltip-*` token first,
 * so a theme that styles `Tooltip variant="rich"` styles this too. The
 * container color, text color and shape go through the same `--_tt-*` locals
 * the tooltip caret paints with.
 */
export const richTooltipVariants = cva(
  "min-h-6 min-w-10 px-4 pt-3 pb-3 has-[[data-slot=rich-tooltip-actions]]:pb-2 relative box-border max-w-[min(var(--md-comp-rich-tooltip-container-max-width,20rem),calc(100vw_-_1rem))] cursor-default rounded-[var(--_tt-shape)] bg-[var(--_tt-bg)] text-start text-body-medium [overflow-wrap:anywhere] text-[color:var(--_tt-fg)] [box-shadow:var(--md-comp-rich-tooltip-container-elevation,var(--_tt-elevation))] [--_tt-bg:var(--md-comp-rich-tooltip-container-color,var(--md-sys-color-surface-container))] [--_tt-fg:var(--md-comp-rich-tooltip-supporting-text-color,var(--md-sys-color-on-surface-variant))] [--_tt-shape:var(--md-comp-rich-tooltip-container-shape,var(--md-sys-shape-corner-medium))] forced-colors:outline forced-colors:outline-1 forced-colors:outline-[CanvasText]",
  {
    variants: {
      /**
       * Shadow elevation level. Default `2` (MD3). The caret casts a matching
       * shadow above `0`.
       */
      elevation: {
        0: "[--_tt-elevation:var(--md-sys-elevation-0)]",
        1: "[--_tt-caret-shadow:drop-shadow(0_1px_1px_color-mix(in_srgb,var(--md-sys-color-shadow)_30%,transparent))] [--_tt-elevation:var(--md-sys-elevation-1)]",
        2: "[--_tt-caret-shadow:drop-shadow(0_1px_2px_color-mix(in_srgb,var(--md-sys-color-shadow)_30%,transparent))_drop-shadow(0_2px_6px_color-mix(in_srgb,var(--md-sys-color-shadow)_15%,transparent))] [--_tt-elevation:var(--md-sys-elevation-2)]",
        3: "[--_tt-caret-shadow:drop-shadow(0_1px_3px_color-mix(in_srgb,var(--md-sys-color-shadow)_30%,transparent))_drop-shadow(0_4px_8px_color-mix(in_srgb,var(--md-sys-color-shadow)_15%,transparent))] [--_tt-elevation:var(--md-sys-elevation-3)]",
        4: "[--_tt-caret-shadow:drop-shadow(0_2px_3px_color-mix(in_srgb,var(--md-sys-color-shadow)_30%,transparent))_drop-shadow(0_6px_10px_color-mix(in_srgb,var(--md-sys-color-shadow)_15%,transparent))] [--_tt-elevation:var(--md-sys-elevation-4)]",
        5: "[--_tt-caret-shadow:drop-shadow(0_4px_4px_color-mix(in_srgb,var(--md-sys-color-shadow)_30%,transparent))_drop-shadow(0_8px_12px_color-mix(in_srgb,var(--md-sys-color-shadow)_15%,transparent))] [--_tt-elevation:var(--md-sys-elevation-5)]",
      },
    },
    defaultVariants: { elevation: 2 },
  },
);

/**
 * Subhead: `title-small` in `--md-comp-rich-tooltip-subhead-color`
 * (`on-surface-variant`), 4dp above the supporting text. MD3: keep it to one
 * line; it summarizes the message.
 */
export const SUBHEAD =
  "mb-1 block text-title-small text-[color:var(--md-comp-rich-tooltip-subhead-color,var(--md-sys-color-on-surface-variant))]";

/**
 * Supporting text, `body-medium`. Inline links take the action color
 * (`primary`), are underlined so they aren't told apart by color alone, and
 * get a focus ring of their own (MD3 focus order: parent → inline link →
 * text button).
 */
export const SUPPORTING_TEXT =
  "block [&_a]:rounded-xs [&_a]:text-[color:var(--md-comp-rich-tooltip-action-label-text-color,var(--md-sys-color-primary))] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-[color:var(--md-sys-color-secondary)] [&_p+p]:mt-2";

/**
 * Action row: 12dp under the text, 40dp tall, start-aligned, 8dp between
 * buttons, wrapping only when two labels can't share a line (MD3: "Avoid
 * stacking buttons"). It hangs outside the text column by the buttons' own
 * 12dp padding (`--md-comp-rich-tooltip-action-inset`) so the **labels** line
 * up with the text, as in the MD3 measurements.
 */
export const ACTIONS =
  "mx-[calc(0px_-_var(--md-comp-rich-tooltip-action-inset,0.75rem))] mt-3 flex min-h-10 flex-wrap items-center gap-2";

/**
 * A text button tuned for the row: 12dp side padding (what the row's inset
 * is built around) and the rich tooltip's action color
 * (`--md-comp-rich-tooltip-action-label-text-color`, `primary`). It replaces
 * the text button's own label and state-layer locals, so hover / focus /
 * pressed (Material Web's `action-*-state-layer-color`: `primary`) follow it,
 * while a consumer's `--md-comp-button-label-text-color` still wins.
 */
export const ACTION =
  "px-3 [--_fg:var(--md-comp-rich-tooltip-action-label-text-color,var(--md-sys-color-primary))] [--_state:var(--md-comp-rich-tooltip-action-label-text-color,var(--md-sys-color-primary))]";
