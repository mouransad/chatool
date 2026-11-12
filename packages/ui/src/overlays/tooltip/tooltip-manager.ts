/*
 * MD3: "Only display one tooltip at a time" and "Triggering a new tooltip
 * immediately closes any other open tooltip." This module is that rule: the
 * one transient tooltip currently on screen, shared by every `Tooltip`.
 *
 * It also remembers when the last one closed, so the next tooltip can skip its
 * show delay (`skipDelay`): once a person is reading tooltips, moving along a
 * toolbar shows each one at once.
 */

interface TooltipEntry {
  /** Closes this tooltip because another one took its place. */
  close: () => void;
}

let active: TooltipEntry | null = null;
let closedAt = Number.NEGATIVE_INFINITY;

/** Make `entry` the tooltip on screen, closing whichever was. */
export const claimTooltip = (entry: TooltipEntry) => {
  const previous = active;
  active = entry;
  if (previous && previous !== entry) previous.close();
};

/** `entry` closed. */
export const releaseTooltip = (entry: TooltipEntry) => {
  if (active !== entry) return;
  active = null;
  closedAt = performance.now();
};

/** A tooltip is showing, or one closed less than `skipDelay` ms ago. */
export const isTooltipWarm = (skipDelay: number) =>
  skipDelay > 0 &&
  (active !== null || performance.now() - closedAt < skipDelay);
