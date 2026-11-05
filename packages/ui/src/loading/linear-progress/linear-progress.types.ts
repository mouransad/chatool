import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type linearProgressVariants } from "./linear-progress.variants";

export interface LinearProgressProps
  extends
    Omit<React.ComponentProps<"div">, "color">,
    VariantProps<typeof linearProgressVariants> {
  /** Current progress. Omit for indeterminate; set it later for a smooth handoff. */
  value?: number;
  /** The `value` that means complete. Defaults to `100`. */
  max?: number;
  /** Track and active indicator thickness in px. Defaults to `4`; `8` is the M3 thick style. */
  thickness?: number;
  /** Wave height, from `0` (flat) to `1` (full 3dp crest). Defaults to `1`. */
  amplitude?: number;
  /** Wave length in px. Defaults to `40`, or `20` while indeterminate. */
  wavelength?: number;
  /** Wave travel in px per second; `0` freezes it. Defaults to `wavelength`. */
  waveSpeed?: number;
  /** Gap between the active indicator and the track in px. Defaults to `4`. */
  gap?: number;
  /**
   * Show the dot marking the end of the track. M3 requires it unless the track has
   * 3:1 contrast with its surroundings. Defaults to `true`.
   */
  stop?: boolean;
  /** Ease between `value` changes. Disable when `value` tracks scrubbing or scroll. */
  animated?: boolean;
}
