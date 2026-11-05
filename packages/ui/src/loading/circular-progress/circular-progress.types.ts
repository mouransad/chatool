import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type circularProgressVariants } from "./circular-progress.variants";

export interface CircularProgressProps
  extends
    Omit<React.ComponentProps<"div">, "color">,
    VariantProps<typeof circularProgressVariants> {
  /** Current progress. Omit for indeterminate; set it later for a smooth handoff. */
  value?: number;
  /** The `value` that means complete. Defaults to `100`. */
  max?: number;
  /**
   * Width and height in px, clamped to the spec's 24–240. Defaults to `48` when
   * wavy and `40` when flat, growing with `thickness`.
   */
  size?: number;
  /** Track and active indicator thickness in px. Defaults to `4`; `8` is the M3 thick style. */
  thickness?: number;
  /** Wave height, from `0` (flat) to `1` (the full wave). Defaults to `1`. */
  amplitude?: number;
  /** Wave length in px; rounded so the waves close the circle. Defaults to `15`. */
  wavelength?: number;
  /** Wave travel in px per second; `0` freezes it. Defaults to `wavelength`. */
  waveSpeed?: number;
  /** Gap between the active indicator and the track in px. Defaults to `4`. */
  gap?: number;
  /** Show the track. Remove it inside buttons, per the spec. Defaults to `true`. */
  track?: boolean;
  /** Ease between `value` changes. Disable when `value` tracks scrubbing or scroll. */
  animated?: boolean;
}
