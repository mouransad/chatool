import { clamp } from "./motion";

/**
 * `value / max` in `0..1`, or `undefined` for indeterminate. Like Compose, anything
 * non-finite counts as unknown progress, so `loaded / total` before the total is
 * known spins instead of drawing `NaN`.
 */
export const toFraction = (value: number | undefined, max: number) => {
  const fraction = (value ?? NaN) / max;
  return Number.isFinite(fraction) ? clamp(fraction, 0, 1) : undefined;
};

/**
 * The ARIA shared by every indicator: `role="progressbar"`, with a value only when
 * determinate (an omitted `aria-valuenow` is what announces indeterminate), and a
 * "Loading" fallback name unless the consumer names it another way.
 */
export const progressbarProps = (
  fraction: number | undefined,
  max: number,
  label: string | undefined,
  labelledBy: string | undefined,
) => ({
  role: "progressbar",
  "aria-label": label ?? (labelledBy ? undefined : "Loading"),
  "aria-valuemin": fraction === undefined ? undefined : 0,
  "aria-valuemax": fraction === undefined ? undefined : max,
  "aria-valuenow": fraction === undefined ? undefined : fraction * max,
});
