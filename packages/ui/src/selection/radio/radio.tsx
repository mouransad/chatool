import { useId } from "react";
import type * as React from "react";
import { cn } from "@chatool/utils";

import Ripple from "../../buttons/ripple";
import RadioInput from "./radio-input";
import { type RadioProps } from "./radio.types";
import {
  DOT,
  ICON,
  INPUT,
  LABEL,
  RING,
  RIPPLE,
  SUPPORTING_TEXT,
  TEXT,
  radioFieldVariants,
  radioVariants,
} from "./radio.variants";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/**
 * MD3 radio button — a **native `<input type="radio">`** under an MD3 skin, so
 * forms, `required` validation, `<fieldset disabled>`, server actions,
 * autofill and assistive tech all get the real control. The input is invisible
 * but covers the full 48dp touch target, so it receives every click, tap and
 * key; its pseudo-classes drive all visuals in CSS.
 *
 * This module carries **no client directive**: it's a props→JSX component
 * (Server-Component-safe — `useId` is supported in Server Components). Its
 * client pieces are islands rendered as children: the native input itself
 * (`RadioInput`, which joins an enclosing `RadioGroup`) and the centred press
 * `Ripple`.
 *
 * Semantics follow the WAI-ARIA APG radio group pattern through the browser's
 * own radio behavior: one Tab stop per group (the selected radio, else the
 * first — or the last with Shift+Tab), arrow keys move **and** select with
 * wrap-around (mirrored in RTL), Space selects. Group radios with a shared
 * `name` or a `RadioGroup`. Every `aria-*`, `name`, `value`, `checked` /
 * `defaultChecked`, `onChange`, `required`, `form` and `ref` goes straight to
 * the input.
 */
const Radio = ({
  className,
  style,
  controlClassName,
  color,
  labelPosition,
  label,
  supportingText,
  error = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: RadioProps) => {
  const supportingId = useId();
  const hasLabel = isRenderable(label);
  const hasSupportingText = hasLabel && isRenderable(supportingText);

  const describedBy =
    [ariaDescribedBy, hasSupportingText ? supportingId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const control = (
    <span
      data-slot="radio"
      className={cn(
        radioVariants({ color }),
        controlClassName,
        !hasLabel && className,
      )}
      style={hasLabel ? undefined : style}
    >
      <RadioInput
        data-slot="radio-input"
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={describedBy}
        className={INPUT}
        {...props}
      />
      <svg
        data-slot="radio-icon"
        viewBox="0 0 20 20"
        aria-hidden
        focusable="false"
        className={ICON}
      >
        <circle cx={10} cy={10} r={9} strokeWidth={2} className={RING} />
        <circle cx={10} cy={10} r={5} className={DOT} />
      </svg>
      <Ripple centered className={RIPPLE} />
    </span>
  );

  if (!hasLabel) return control;

  return (
    <label
      data-slot="radio-field"
      className={cn(radioFieldVariants({ labelPosition }), className)}
      style={style}
    >
      {control}
      <span data-slot="radio-text" className={TEXT}>
        <span data-slot="radio-label" className={LABEL}>
          {label}
        </span>
        {hasSupportingText && (
          <span
            id={supportingId}
            data-slot="radio-supporting-text"
            className={SUPPORTING_TEXT}
          >
            {supportingText}
          </span>
        )}
      </span>
    </label>
  );
};

export default Radio;
