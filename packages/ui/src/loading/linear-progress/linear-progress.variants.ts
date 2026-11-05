import { cva } from "class-variance-authority";

/*
 * Material 3 linear progress indicator: the full width of its parent, with the
 * height set per instance from `thickness`. Painted roles read a
 * `--md-comp-linear-progress-*` token first, then the `--_*` local. `rtl:` mirrors
 * the bar with CSS, so it's correct from the first server-rendered paint.
 */
export const linearProgressVariants = cva(
  "min-w-10 motion-reduce:data-[indeterminate]:animate-pulse block w-full [--_track:var(--md-sys-color-secondary-container)]",
  {
    variants: {
      shape: {
        wavy: "",
        flat: "",
      },
      color: {
        primary: "[--_fg:var(--md-sys-color-primary)]",
        inherit: "[--_fg:currentColor]",
      },
    },
    defaultVariants: { shape: "wavy", color: "primary" },
  },
);

/** Shared by every stroked SVG part. */
export const LINE =
  "fill-none [stroke-linecap:round] [stroke-width:var(--_thickness)]";

/** The active indicator's color. */
export const ACTIVE_STROKE =
  "stroke-[color:var(--md-comp-linear-progress-active-indicator-color,var(--_fg))]";

/** The track's color. */
export const TRACK_STROKE =
  "stroke-[color:var(--md-comp-linear-progress-track-color,var(--_track))]";

/** The stop indicator's color. */
export const STOP_FILL =
  "fill-[var(--md-comp-linear-progress-stop-indicator-color,var(--_fg))]";
