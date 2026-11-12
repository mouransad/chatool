"use client";

import SliderRoot from "./slider-root";
import { type RangeSliderProps } from "./slider.types";

const DEFAULT_THUMB_LABELS = ["Minimum", "Maximum"] as const;

/**
 * MD3 Expressive **range slider** — pick a `[start, end]` range with two
 * handles; the active track runs between them
 * (m3.material.io/components/sliders). It follows the WAI-ARIA APG
 * **multi-thumb slider**: each handle is its own native
 * `<input type="range">` with its own name (`thumbLabels`), and each one's
 * `min` / `max` is bounded by the other handle, so they never cross
 * (`minStepsBetweenThumbs` keeps them apart). The root is a `role="group"` —
 * name it with `aria-label` / `aria-labelledby`.
 *
 * Pressing anywhere moves the nearest handle; when they're stacked, the first
 * drag direction picks one. MD3 shows the value on one handle at a time, and
 * advises against vertical range sliders (extra cognitive load) and inset
 * icons on them — so there are none.
 *
 * With `name`, both values submit under that name (`formData.getAll(name)`).
 */
const RangeSlider = ({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  thumbLabels = DEFAULT_THUMB_LABELS,
  getAriaValueText,
  inputRefs,
  min = 0,
  max = 100,
  role = "group",
  ...props
}: RangeSliderProps) => {
  const pair = (next: number[]): [number, number] => [
    next[0] ?? min,
    next[1] ?? max,
  ];
  return (
    <SliderRoot
      {...props}
      role={role}
      mode="range"
      min={min}
      max={max}
      value={value === undefined ? undefined : [value[0], value[1]]}
      defaultValue={
        defaultValue
          ? [defaultValue[0], defaultValue[1]]
          : [Math.min(min, max), Math.max(min, max)]
      }
      onValueChange={onValueChange && ((next) => onValueChange(pair(next)))}
      onValueCommit={onValueCommit && ((next) => onValueCommit(pair(next)))}
      thumbs={[0, 1].map((index) => ({
        "aria-label": thumbLabels[index],
        getAriaValueText: getAriaValueText
          ? (v: number) => getAriaValueText(v, index as 0 | 1)
          : undefined,
        ref: inputRefs?.[index],
      }))}
    />
  );
};

export default RangeSlider;
