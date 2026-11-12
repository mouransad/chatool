import type * as React from "react";

/**
 * MD3 Expressive FAB sizes. The same three sizes serve the icon-only **FAB**
 * and the **extended FAB** (container height 56 / 80 / 96dp):
 *
 * - `small` — the 56dp FAB / small extended FAB. (Not MD3's 40dp "small FAB",
 *   which M3 Expressive no longer recommends and this library doesn't ship.)
 * - `medium` — 80dp. MD3's "most recommended" size; the default.
 * - `large` — 96dp. For prominent primary actions, best on expanded+ windows.
 */
export type FabSize = "small" | "medium" | "large";

/**
 * MD3 FAB color styles (container & on-container role pairs). The three
 * `*-container` styles are the tonal defaults; `primary` / `secondary` /
 * `tertiary` are the high-emphasis styles added in M3 Expressive. The surface
 * style is no longer recommended by MD3 and isn't offered.
 */
export type FabColor =
  | "primary-container"
  | "secondary-container"
  | "tertiary-container"
  | "primary"
  | "secondary"
  | "tertiary";

/**
 * Elevation set (Compose `FloatingActionButtonDefaults`):
 * `default` — level 3, level 4 on hover; `lowered` — level 1, level 2 on hover
 * (less emphasis); `none` — flat, for a FAB nested in a bar or rail.
 */
export type FabElevation = "default" | "lowered" | "none";

/**
 * Floats the FAB over the page (`position: fixed`) with MD3's 16dp margins,
 * clear of the device safe area. `start` / `end` follow the writing direction.
 */
export type FabPlacement = "bottom-end" | "bottom-center" | "bottom-start";

/**
 * MD3 window size classes, mobile-first: `compact` (< 600px, the base),
 * `medium` (≥ 600px), `expanded` (≥ 840px), `large` (≥ 1200px) and
 * `extraLarge` (≥ 1600px).
 */
export type FabWindowClass =
  | "compact"
  | "medium"
  | "expanded"
  | "large"
  | "extraLarge";

/**
 * A value, or one value per MD3 window size class (each applies from its
 * breakpoint up, until a larger class overrides it). Resolved in CSS media
 * queries, so it works in Server Components with no hydration flash.
 */
export type FabResponsive<T> = T | Partial<Record<FabWindowClass, T>>;

export interface FabProps extends Omit<
  React.ComponentProps<"button">,
  "color"
> {
  /**
   * The icon glyph (a filled `@chatool/icons` icon reads best, per MD3).
   * Required for an icon-only FAB; optional for an extended FAB.
   */
  icon?: React.ReactNode;
  /**
   * Visible label. Passing it makes this an **extended FAB**. Keep it to 1–2
   * words; it never wraps or truncates. Without a label, give the FAB an
   * `aria-label` that names the action (e.g. "Compose new message").
   */
  label?: React.ReactNode;
  /**
   * Extended FAB only (needs an `icon`): `false` collapses it into a FAB —
   * the label folds away and the icon glides to the center on an Expressive
   * spring. The label stays the accessible name. Accepts per-window-class
   * values, e.g. `{ compact: false, expanded: true }`. Default `true`.
   */
  expanded?: FabResponsive<boolean>;
  /**
   * Container size (`small` 56 / `medium` 80 / `large` 96dp). Accepts
   * per-window-class values, e.g. `{ compact: "medium", expanded: "large" }`.
   * Default `medium`.
   */
  size?: FabResponsive<FabSize>;
  /** MD3 color style. Default `primary-container`. */
  color?: FabColor;
  /** Elevation set. Default `default` (level 3, hover 4). */
  elevation?: FabElevation;
  /** Float the FAB in a corner of the viewport. Omit to place it yourself. */
  placement?: FabPlacement;
  /**
   * `false` hides the FAB: it shrinks toward its center and fades out (made
   * `inert`, so it leaves the tab order and accessibility tree), and springs
   * back when `true` again. MD3: hide the FAB while switching tabs/screens
   * and when its action is unavailable, rather than disabling it. Default
   * `true`.
   */
  visible?: boolean;
  /** Render the FAB onto its single child element (e.g. a router `<Link>`). */
  asChild?: boolean;
  /** With `asChild`, the element to render as (e.g. `<a href="/new" />`). */
  children?: React.ReactNode;
}
