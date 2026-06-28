/*
 * Shared class fragments for the button family (kept DRY across button,
 * icon-button, fab, …). Painted roles read a `--md-comp-*` component token first,
 * falling back to the variant-computed `--_*` local — so apps re-theme a single
 * component, globally or per-instance, with no JS. See material-design.md.
 */

/** Interactive container that hosts the `::before` state layer. */
export const BASE =
  "relative isolate inline-flex select-none items-center justify-center whitespace-nowrap font-medium outline-none transition-[background-color,box-shadow,border-color,border-radius] [&_svg]:pointer-events-none [&_svg]:shrink-0";

/**
 * MD3 state layer: a translucent on-color overlay (`--_state`) at the spec
 * opacities for hover (8%) / focus (10%) / press (10%). Requires BASE's
 * `relative isolate`; the `-z-10` keeps the overlay above the container fill
 * but below the label/icon content.
 */
export const STATE_LAYER =
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[var(--_state)] before:opacity-0 before:transition-opacity before:content-[''] hover:before:opacity-[0.08] focus-visible:before:opacity-[0.10] active:before:opacity-[0.10] disabled:before:hidden aria-disabled:before:hidden";

/** MD3 focus indicator, keyed off the active color's `--_main`. */
export const FOCUS_RING =
  "focus-visible:ring-2 focus-visible:ring-[var(--_main)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-surface)]";

/** MD3 disabled treatment (works for `<button disabled>` and `aria-disabled`). */
export const DISABLED =
  "disabled:pointer-events-none disabled:opacity-[0.38] disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:opacity-[0.38] aria-disabled:shadow-none";
