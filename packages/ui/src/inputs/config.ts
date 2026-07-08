/*
 * Shared configuration for the `@chatool/ui` input family — the Material 3
 * Text Field size scale, active states, focus indicator, and disabled states.
 * Kept in one file so the family's styling rules live in a single, well-named place.
 */

export type InputSize = "xs" | "s";

/** Container heights and text sizes for inputs. */
export const containerSize: Record<InputSize, string> = {
  xs: "h-10 text-body-medium",
  s: "h-14 text-body-large",
};

/** Shared base classes for the input container wrapper. */
export const CONTAINER_BASE =
  "relative w-full flex items-center transition-all duration-[var(--md-sys-motion-duration-short4)] ease-[var(--md-sys-motion-easing-standard)] outline-none";

/** Focus indicator overlay styles. */
export const CONTAINER_FOCUS =
  "focus-within:ring-2 focus-within:ring-[color:var(--md-comp-input-focus-color,var(--md-sys-color-primary))] focus-within:ring-offset-2 focus-within:ring-offset-[color:var(--md-sys-color-surface)]";

/** Disabled states for the container and child elements. */
export const CONTAINER_DISABLED =
  "aria-disabled:pointer-events-none aria-disabled:opacity-[0.38] disabled:pointer-events-none disabled:opacity-[0.38]";

/** Text typescales and standard spacing for the input element. */
export const INPUT_BASE =
  "peer w-full h-full bg-transparent border-none outline-none text-[color:var(--md-comp-input-text-color,var(--md-sys-color-on-surface))] placeholder-transparent disabled:pointer-events-none";

/** Base styling and motion transitions for the floating label. */
export const LABEL_BASE =
  "absolute pointer-events-none transition-all duration-[var(--md-sys-motion-duration-short4)] ease-[var(--md-sys-motion-easing-standard)] origin-left text-[color:var(--md-comp-input-label-color,var(--md-sys-color-on-surface-variant))] peer-focus:text-[color:var(--md-comp-input-focus-color,var(--md-sys-color-primary))]";
