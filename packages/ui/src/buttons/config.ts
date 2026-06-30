/*
 * Shared configuration for the `@chatool/ui` button family — the Material 3
 * Expressive size scale, the shape/press-morph corners, and the reusable class
 * fragments (base, state layer, focus ring, disabled). Kept in one file so the
 * family's styling rules live in a single, well-named place.
 *
 * Painted roles read a `--md-comp-button-*` token first and fall back to the
 * variant-computed `--_*` local, so apps can re-theme the component globally or
 * per-instance with no JS. Arbitrary color values carry an explicit `color:`
 * hint (`text-[color:…]`, `ring-[color:…]`) so `cn`/tailwind-merge classifies
 * them as colors and never drops them next to a typescale or width utility.
 * See docs/conventions/material-design.md.
 */

/** Material 3 Expressive button sizes (heights 32 / 40 / 56 / 96 / 136 dp). */
export type ButtonSize = "xs" | "s" | "m" | "l" | "xl";

/** Height + gap + horizontal padding + label typescale + icon size per size. */
export const labelSize: Record<ButtonSize, string> = {
  xs: "h-8 gap-1.5 px-3 text-label-large [&_svg]:size-5",
  s: "h-10 gap-2 px-4 text-label-large [&_svg]:size-5",
  m: "h-14 gap-2.5 px-6 text-title-medium [&_svg]:size-6",
  l: "h-24 gap-3 px-8 text-headline-small [&_svg]:size-8",
  xl: "h-34 gap-3.5 px-12 text-headline-large [&_svg]:size-10",
};

/**
 * Resting corner radius when `shape="round"` — a **finite** half-height pill
 * (not `rounded-full`). `rounded-full` compiles to `calc(infinity * 1px)`, which
 * can't be transitioned smoothly: the press morph would interpolate from a
 * near-infinite value and only become visible in the final moment, looking like
 * a snap. A finite half-height radius is the same perfect capsule but morphs
 * smoothly. Values are exactly `h-*` / 2 (2rem→1rem, 2.5rem→1.25rem, …).
 */
export const roundCorner: Record<ButtonSize, string> = {
  xs: "rounded-[1rem]",
  s: "rounded-[1.25rem]",
  m: "rounded-[1.75rem]",
  l: "rounded-[3rem]",
  xl: "rounded-[4.25rem]",
};

/** Resting corner radius when `shape="square"` (grows with size, per MD3). */
export const squareCorner: Record<ButtonSize, string> = {
  xs: "rounded-md",
  s: "rounded-lg",
  m: "rounded-lg",
  l: "rounded-xl",
  xl: "rounded-xl",
};

/**
 * MD3 press shape-morph: while pressed, the container corner shrinks to a
 * clearly smaller radius, then springs back (the `border-radius` transition +
 * easing live in `BASE`). Corners are size-aware so the morph stays visible at
 * every size, and both shapes rest at finite radii (`roundCorner` /
 * `squareCorner`) so the morph interpolates smoothly.
 */
export const pressCorner: Record<
  "round" | "square",
  Record<ButtonSize, string>
> = {
  round: {
    xs: "active:rounded-sm",
    s: "active:rounded-sm",
    m: "active:rounded-md",
    l: "active:rounded-lg",
    xl: "active:rounded-lg",
  },
  square: {
    xs: "active:rounded-xs",
    s: "active:rounded-xs",
    m: "active:rounded-sm",
    l: "active:rounded-md",
    xl: "active:rounded-md",
  },
};

/** Interactive container that hosts the `::before` state layer + ripple overlay. */
export const BASE =
  "relative isolate inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-medium outline-none transition-[background-color,box-shadow,border-color,border-radius] duration-[var(--md-sys-motion-duration-short4)] ease-[var(--md-sys-motion-easing-standard)] [&_svg]:pointer-events-none [&_svg]:shrink-0";

/**
 * MD3 state layer: a translucent on-color overlay (`--_state`) at the spec
 * opacities for hover (8%) / focus (10%) / press (10%). Requires BASE's
 * `relative isolate`; `-z-10` keeps the overlay above the container fill but
 * below the label/icon content.
 */
export const STATE_LAYER =
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[var(--_state)] before:opacity-0 before:transition-opacity before:content-[''] hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10] disabled:before:hidden aria-disabled:before:hidden";

/** MD3 focus indicator (overridable via `--md-comp-button-focus-color`). */
export const FOCUS_RING =
  "focus-visible:ring-2 focus-visible:ring-[color:var(--md-comp-button-focus-color,var(--md-sys-color-secondary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--md-sys-color-surface)]";

/**
 * MD3 disabled treatment (works for `<button disabled>` and `aria-disabled`).
 * A button that is disabled **because it's loading** (`data-loading`) stays
 * non-actionable (`pointer-events-none`) but keeps its full color + spinner —
 * the stacked `disabled:data-[loading]:` / `aria-disabled:data-[loading]:` variant
 * out-specifies the `0.38` dim so it wins.
 */
export const DISABLED =
  "disabled:pointer-events-none disabled:opacity-[0.38] disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:opacity-[0.38] aria-disabled:shadow-none disabled:data-[loading]:opacity-100 disabled:data-[loading]:shadow-none aria-disabled:data-[loading]:opacity-100";
