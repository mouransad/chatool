import { cva } from "class-variance-authority";

/*
 * Material 3 circular progress indicator. Painted roles read a
 * `--md-comp-circular-progress-*` token first, then the `--_*` local. Circular
 * indicators aren't mirrored in RTL, per the spec.
 */
export const circularProgressVariants = cva(
  "motion-reduce:data-[indeterminate]:animate-pulse inline-flex shrink-0 items-center justify-center [--_track:var(--md-sys-color-secondary-container)]",
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

/** Shared by both stroked SVG parts. */
export const LINE =
  "fill-none [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:var(--_thickness)]";

/** The active indicator's color. */
export const ACTIVE_STROKE =
  "stroke-[color:var(--md-comp-circular-progress-active-indicator-color,var(--_fg))]";

/** The track's color. */
export const TRACK_STROKE =
  "stroke-[color:var(--md-comp-circular-progress-track-color,var(--_track))]";
