"use client";

import SliderRoot from "./slider-root";
import { type SliderProps } from "./slider.types";

/**
 * MD3 Expressive **slider** — pick one value from a range
 * (m3.material.io/components/sliders). The **standard** slider grows its
 * active track from the start; `centered` grows it from the middle, for
 * ranges whose zero / default sits at the centre. For two handles use
 * `RangeSlider` from the same subpath.
 *
 * Five sizes (`xs` 16dp track … `xl` 96dp), horizontal or vertical,
 * `inverted`, stop indicators (`stops`: every step, or custom values), MD3
 * inset icons (`icon`, `endIcon`; M/L/XL), a value indicator, and the full
 * WAI-ARIA APG slider keyboard. It's a **native `<input type="range">`**
 * underneath, so `name` / `form`, `<label htmlFor>` (via `id`), `aria-*` and
 * mobile screen readers all work as with a plain range input.
 *
 * Name it with `aria-label`, `aria-labelledby` or `<label htmlFor={id}>` —
 * MD3: "the accessibility label … should match the adjacent UI text".
 *
 * It's a client component (it tracks pointer drags and live values), and
 * still renders on the server with the handle in place.
 */
const Slider = ({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  centered = false,
  getAriaValueText,
  inputRef,
  id,
  autoFocus,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  min = 0,
  max = 100,
  icon,
  endIcon,
  ...props
}: SliderProps) => (
  <SliderRoot
    {...props}
    mode={centered ? "centered" : "standard"}
    min={min}
    max={max}
    value={value === undefined ? undefined : [value]}
    defaultValue={[
      defaultValue ??
        (centered
          ? (Math.min(min, max) + Math.max(min, max)) / 2
          : Math.min(min, max)),
    ]}
    onValueChange={onValueChange && ((next) => onValueChange(next[0] ?? min))}
    onValueCommit={onValueCommit && ((next) => onValueCommit(next[0] ?? min))}
    // MD3: "Don't use inset icons on centered or range sliders."
    icon={centered ? undefined : icon}
    endIcon={centered ? undefined : endIcon}
    thumbs={[
      {
        id,
        autoFocus,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        getAriaValueText,
        ref: inputRef,
      },
    ]}
  />
);

export default Slider;
