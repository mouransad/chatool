import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type SliderSize } from "../config";
import { type SliderFormat } from "./slider-math";
import { type sliderVariants } from "./slider.variants";

export type { SliderSize, SliderFormat };

/** `"horizontal"` (default) or `"vertical"` (bottom = min unless `inverted`). */
export type SliderOrientation = "horizontal" | "vertical";

/**
 * When the MD3 value indicator shows: `false` never (default), `true` while
 * the handle is pressed, dragged or keyboard-focused, `"always"` always.
 */
export type SliderValueIndicator = boolean | "always";

/** An inset icon, or a function of the value (e.g. volume → mute at 0). */
export type SliderIcon = React.ReactNode | ((value: number) => React.ReactNode);

/** Extra classes for each part (every part also carries a `data-slot`). */
export interface SliderClassNames {
  /** The track box (`data-slot="slider-track"`). */
  track?: string;
  /** The active track segment. */
  activeTrack?: string;
  /** The inactive track segment(s). */
  inactiveTrack?: string;
  /** Every stop indicator (end stops and `stops` dots). */
  stop?: string;
  /** Each handle's slot (`data-slot="slider-thumb"`; carries `data-pressed`). */
  thumb?: string;
  /** The visible handle bar. */
  handle?: string;
  /** The value indicator pill. */
  valueIndicator?: string;
  /** Each inset icon's box. */
  icon?: string;
  /** The native `<input type="range">` (invisible). */
  input?: string;
}

/** Props shared by `Slider` and `RangeSlider`. */
export interface SliderSharedProps
  extends
    Omit<
      React.ComponentProps<"div">,
      "defaultValue" | "onChange" | "children" | "dir"
    >,
    Omit<VariantProps<typeof sliderVariants>, "inverted"> {
  /** Smallest value. Default `0`. */
  min?: number;
  /** Largest value. Default `100`. */
  max?: number;
  /**
   * Granularity: values snap to `min + n × step`. Default `1`; `"any"` makes
   * the slider continuous (arrow keys then move 1% of the range).
   */
  step?: number | "any";
  /**
   * MD3 **stop indicators**. `true` draws a dot at every `step` (the
   * "discrete" slider; handles line up with the dots). An array makes those
   * exact values the only selectable ones — custom, non-uniform stops — and
   * draws a dot at each.
   */
  stops?: boolean | readonly number[];
  /**
   * The stop dot at the end of the inactive track (and the start, for
   * centered / range), which gives the track end a 3:1 contrast anchor. MD3:
   * "if the inactive track has this level of contrast already, the end stops
   * can be removed." Default `true`.
   */
  endStops?: boolean;
  /**
   * The Page Up / Page Down / Shift+Arrow (or Space+Arrow) increment.
   * Default ≈10% of the range, in whole steps.
   */
  largeStep?: number;
  /** When the value indicator shows. Default `false`. */
  valueIndicator?: SliderValueIndicator;
  /**
   * Formats the value for the value indicator and `aria-valuetext`:
   * `Intl.NumberFormatOptions` (e.g. `{ style: "percent" }`) or a function.
   * Plain options keep the prop serializable from a Server Component.
   */
  format?: SliderFormat;
  /** BCP 47 locale for the default number formatting. Default: the user's. */
  locale?: string;
  /** Disables the slider (also disabled inside a `<fieldset disabled>`). */
  disabled?: boolean;
  /**
   * Reverses the direction: max at the start (horizontal) or at the top
   * (vertical). The arrow keys follow what's on screen.
   */
  inverted?: boolean;
  /**
   * A short vibration each time a dragged handle lands on a new value
   * (Vibration API; Android browsers). Best with `stops`. Default `false`.
   */
  haptics?: boolean;
  /** Form field name. A range slider submits both values under it. */
  name?: string;
  /** Associates the input(s) with a `<form>` by id. */
  form?: string;
  /** Per-part classes. `className` goes on the root. */
  classNames?: SliderClassNames;
  /** Ref to the root `<div>`. */
  ref?: React.Ref<HTMLDivElement>;
}

export interface SliderProps extends SliderSharedProps {
  /** The value (controlled). */
  value?: number;
  /** The initial value (uncontrolled). Default `min`, or the midpoint when `centered`. */
  defaultValue?: number;
  /** Called on every change (drag, click, keys, assistive tech). */
  onValueChange?: (value: number) => void;
  /**
   * Called when an interaction ends with a new value — pointer up, or each
   * key press (Compose's `onValueChangeFinished`). Use it for expensive work.
   */
  onValueCommit?: (value: number) => void;
  /**
   * MD3 **centered** slider: the active track grows from the middle, for
   * ranges with a meaningful zero / default at the centre (e.g. −50…50).
   */
  centered?: boolean;
  /**
   * MD3 **inset icon** at the start of the track, showing what the slider
   * controls. Moves from the active to the inactive track when there's no
   * room. MD3: M, L and XL only — not on centered sliders.
   */
  icon?: SliderIcon;
  /** An icon at the end of the inactive track (replaces the end stop). */
  endIcon?: SliderIcon;
  /** Builds `aria-valuetext` (default: `format`'s output, when `format` is set). */
  getAriaValueText?: (value: number) => string;
  /** Ref to the native `<input type="range">` (focus it, read its form). */
  inputRef?: React.Ref<HTMLInputElement>;
  /** `id` of the native input — so `<label htmlFor>` names the slider. */
  id?: string;
  /** Focus the handle on mount. */
  autoFocus?: boolean;
}

export interface RangeSliderProps extends SliderSharedProps {
  /** `[start, end]` (controlled). */
  value?: readonly [number, number];
  /** Initial `[start, end]` (uncontrolled). Default `[min, max]`. */
  defaultValue?: readonly [number, number];
  /** Called on every change of either handle. */
  onValueChange?: (value: [number, number]) => void;
  /** Called when an interaction ends with new values. */
  onValueCommit?: (value: [number, number]) => void;
  /**
   * Minimum distance between the handles, in steps (in stops, for custom
   * stops). Default `0` — the handles may meet but never cross.
   */
  minStepsBetweenThumbs?: number;
  /**
   * Accessible names for the two handles (WAI-ARIA APG multi-thumb slider).
   * Default `["Minimum", "Maximum"]`. Name the whole slider with `aria-label`
   * / `aria-labelledby` (it renders `role="group"`).
   */
  thumbLabels?: readonly [string, string];
  /** Builds `aria-valuetext` for a handle (default: `format`'s output). */
  getAriaValueText?: (value: number, index: 0 | 1) => string;
  /** Refs to the two native inputs. */
  inputRefs?: readonly [
    React.Ref<HTMLInputElement>?,
    React.Ref<HTMLInputElement>?,
  ];
}

/** Per-handle input wiring (internal: `Slider` / `RangeSlider` → `SliderRoot`). */
export interface SliderThumbConfig {
  id?: string;
  autoFocus?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  getAriaValueText?: (value: number) => string;
  ref?: React.Ref<HTMLInputElement>;
}

/** The shared engine's props (internal — not exported from the subpath). */
export interface SliderRootProps extends SliderSharedProps {
  mode: "standard" | "centered" | "range";
  value?: readonly number[];
  defaultValue: readonly number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  minStepsBetweenThumbs?: number;
  icon?: SliderIcon;
  endIcon?: SliderIcon;
  thumbs: readonly SliderThumbConfig[];
}
