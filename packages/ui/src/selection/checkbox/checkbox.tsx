import { useId } from "react";
import type * as React from "react";
import { cn } from "@chatool/utils";

import Ripple from "../../buttons/ripple";
import CheckboxIndeterminate from "./checkbox-indeterminate";
import { type CheckboxProps } from "./checkbox.types";
import {
  CONTAINER,
  ICON,
  INPUT,
  LABEL,
  MARK,
  RIPPLE,
  SUPPORTING_TEXT,
  TEXT,
  checkboxFieldVariants,
  checkboxVariants,
} from "./checkbox.variants";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/**
 * MD3 checkbox — a **native `<input type="checkbox">`** under an MD3 skin, so
 * forms, validation, `<fieldset disabled>`, server actions, browser autofill
 * and assistive tech all get the real control. The input is invisible but
 * covers the full 48dp touch target, so it receives every click, tap and key;
 * its pseudo-classes drive all visuals in CSS.
 *
 * This module carries **no client directive**: it's a props→JSX component
 * (Server-Component-safe — `useId` is one of the hooks React supports in Server
 * Components). Uncontrolled checkboxes work, animate and submit with zero JS.
 * The client pieces are islands rendered as children: the centred press
 * `Ripple`, and `CheckboxIndeterminate` (only when `indeterminate` is passed),
 * which sets the DOM-only `input.indeterminate` property.
 *
 * Semantics follow the WAI-ARIA APG checkbox pattern: Space toggles (native),
 * Tab focuses, the mixed state is the native `indeterminate` (never
 * `aria-checked` on a native checkbox, per HTML-ARIA), and every `aria-*`,
 * `name`, `value`, `checked` / `defaultChecked`, `onChange`, `required`,
 * `form` and `ref` go straight to the input.
 */
const Checkbox = ({
  className,
  style,
  controlClassName,
  color,
  labelPosition,
  label,
  supportingText,
  indeterminate,
  error = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ...props
}: CheckboxProps) => {
  const supportingId = useId();
  const hasLabel = isRenderable(label);
  const hasSupportingText = hasLabel && isRenderable(supportingText);

  const describedBy =
    [ariaDescribedBy, hasSupportingText ? supportingId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const control = (
    <span
      data-slot="checkbox"
      data-indeterminate={indeterminate || undefined}
      className={cn(
        checkboxVariants({ color }),
        controlClassName,
        !hasLabel && className,
      )}
      style={hasLabel ? undefined : style}
    >
      <input
        data-slot="checkbox-input"
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={describedBy}
        className={INPUT}
        {...props}
        type="checkbox"
      />
      <span data-slot="checkbox-container" aria-hidden className={CONTAINER}>
        <svg viewBox="0 0 18 18" focusable="false" className={ICON}>
          <path
            d="M0 -6V0H12"
            fill="none"
            strokeWidth={2}
            strokeLinejoin="miter"
            className={MARK}
          />
        </svg>
      </span>
      <Ripple centered className={RIPPLE} />
      {indeterminate !== undefined && (
        <CheckboxIndeterminate indeterminate={indeterminate} />
      )}
    </span>
  );

  if (!hasLabel) return control;

  return (
    <label
      data-slot="checkbox-field"
      className={cn(checkboxFieldVariants({ labelPosition }), className)}
      style={style}
    >
      {control}
      <span data-slot="checkbox-text" className={TEXT}>
        <span data-slot="checkbox-label" className={LABEL}>
          {label}
        </span>
        {hasSupportingText && (
          <span
            id={supportingId}
            data-slot="checkbox-supporting-text"
            className={SUPPORTING_TEXT}
          >
            {supportingText}
          </span>
        )}
      </span>
    </label>
  );
};

export default Checkbox;
