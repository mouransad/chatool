/*
 * Shared configuration for the `@chatool/ui` divider family. Kept in one file so
 * future siblings (e.g. a list-item divider decoration) draw the **exact same
 * line** as `Divider`.
 *
 * Material Design 3 divider spec (m3.material.io/components/divider/specs):
 *
 * - **Color:** `outline-variant` (light + dark). Dividers are decorative, so MD3
 *   sets **no contrast minimum**.
 * - **Thickness:** `1dp`. MDC-Android's M3 theme also ships a **heavy** style
 *   (`Widget.Material3.MaterialDivider.Heavy`) at `8dp`.
 * - **Full-width:** `100%`. **Inset:** 16dp leading, 0dp trailing.
 *   **Middle-inset:** 16dp on both sides.
 *
 * Every value reads a `--md-comp-divider-*` token first and falls back to the
 * spec value, so apps re-theme dividers globally (`:root`) or per instance
 * (`style` / an arbitrary-property class) with no JS.
 *
 * Tailwind only generates classes it can **see as complete literals**, so the
 * fragments below are spelled out in full (never assembled from interpolated
 * pieces).
 */

/** Divider orientation: a row separator (`horizontal`) or column separator. */
export type DividerOrientation = "horizontal" | "vertical";

/**
 * Painted line color — `--md-comp-divider-color`, falling back to MD3
 * `outline-variant`. Applied as `border-color`, so pseudo-element lines can pick
 * it up with `border-color: inherit`.
 *
 * Drawing the line with a **border** (not a background) keeps it visible in
 * Windows High Contrast / `forced-colors: active`, where the UA forces border
 * colors to a system color but would drop a background fill.
 */
export const LINE_COLOR =
  "border-[color:var(--md-comp-divider-color,var(--md-sys-color-outline-variant))]";

/** The `--_thickness` local per weight: 1dp regular, 8dp heavy. */
export const THICKNESS = {
  regular: "[--_thickness:var(--md-comp-divider-thickness,1px)]",
  heavy: "[--_thickness:var(--md-comp-divider-heavy-thickness,8px)]",
} as const;
