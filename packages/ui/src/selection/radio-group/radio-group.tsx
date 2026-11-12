"use client";

import { useId, useMemo } from "react";
import type * as React from "react";
import { cn } from "@chatool/utils";

import RadioGroupContext, {
  type RadioGroupContextValue,
} from "./radio-group-context";
import { type RadioGroupProps } from "./radio-group.types";
import {
  ITEMS,
  LEGEND,
  SUPPORTING_TEXT,
  radioGroupVariants,
} from "./radio-group.variants";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/**
 * MD3 radio group — a native **`<fieldset role="radiogroup">`** (a role ARIA
 * in HTML allows on `fieldset`), so the group is announced as a radio group,
 * named by its `<legend>`, and `disabled` disables every radio natively.
 *
 * It's a client component because it **provides context**: the shared `name`,
 * the controlled `value` / uncontrolled `defaultValue`, `required` and `form`
 * reach each `Radio`'s native input through it. It's still server-side
 * rendered, so the selection is in the first paint and an uncontrolled group
 * works before hydration. Keyboard behavior is the browser's own for
 * same-name radios — exactly the APG / MD3 contract (one Tab stop; arrows move
 * and select with wrap-around; Space selects).
 *
 * Visual defaults (`color`, `labelPosition`, `error`, `disabled`) reach the
 * radios through **CSS** (inherited locals, ancestor selectors), not context,
 * so a server-rendered radio shell picks them up too.
 */
const RadioGroup = ({
  className,
  itemsClassName,
  children,
  name,
  value,
  defaultValue,
  onValueChange,
  required,
  disabled,
  error = false,
  form,
  label,
  supportingText,
  orientation,
  color,
  labelPosition,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: RadioGroupProps) => {
  const generatedName = useId();
  const labelId = useId();
  const supportingId = useId();
  const groupName = name ?? generatedName;
  const hasLabel = isRenderable(label);
  const hasSupportingText = isRenderable(supportingText);

  const context = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      value,
      defaultValue,
      required,
      form,
      onChange: (event) => {
        if (event.target.checked) onValueChange?.(event.target.value, event);
      },
    }),
    [groupName, value, defaultValue, required, form, onValueChange],
  );

  const describedBy =
    [ariaDescribedBy, hasSupportingText ? supportingId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <fieldset
      data-slot="radio-group"
      role="radiogroup"
      disabled={disabled}
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      aria-invalid={error ? true : ariaInvalid}
      data-orientation={orientation ?? "vertical"}
      className={cn(
        radioGroupVariants({ orientation, color, labelPosition }),
        className,
      )}
      {...props}
    >
      {hasLabel && (
        <legend id={labelId} data-slot="radio-group-label" className={LEGEND}>
          {label}
        </legend>
      )}
      <div data-slot="radio-group-items" className={cn(ITEMS, itemsClassName)}>
        <RadioGroupContext value={context}>{children}</RadioGroupContext>
      </div>
      {hasSupportingText && (
        <p
          id={supportingId}
          data-slot="radio-group-supporting-text"
          className={SUPPORTING_TEXT}
        >
          {supportingText}
        </p>
      )}
    </fieldset>
  );
};

export default RadioGroup;
