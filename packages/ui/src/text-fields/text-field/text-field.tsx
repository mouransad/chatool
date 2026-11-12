import { useId } from "react";
import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import IconButton from "../../buttons/icon-button/icon-button";
import { ALWAYS_FLOAT_TYPES } from "../config";
import TextFieldClearIcon from "./text-field-clear-icon";
import TextFieldErrorIcon from "./text-field-error-icon";
import TextFieldInteraction from "./text-field-interaction";
import TextFieldVisibilityIcon from "./text-field-visibility-icon";
import { type TextFieldProps } from "./text-field.types";
import {
  ACTION_BUTTON,
  CLEAR_BOX,
  CONTAINER,
  COUNTER,
  ERROR_ICON_BOX,
  ERROR_TEXT,
  FIELD,
  INDICATOR,
  INPUT,
  LABEL,
  LABEL_ABOVE,
  LEADING,
  OUTLINE,
  OUTLINE_END,
  OUTLINE_LABEL_COPY,
  OUTLINE_NOTCH,
  OUTLINE_ROW,
  OUTLINE_START,
  PREFIX,
  SUFFIX,
  SUPPORTING_ROW,
  SUPPORTING_TEXT,
  SUPPORTING_TEXT_WRAP,
  TEXTAREA,
  TRAILING,
  TRAILING_BOX,
  textFieldVariants,
} from "./text-field.variants";

/** The control's native props as the view reads them (input ∪ textarea). */
type ControlProps = Omit<React.ComponentProps<"input">, "ref"> & {
  rows?: number;
  minRows?: number;
  maxRows?: number;
};

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

const fill = (template: string, count: number, max: number | undefined) =>
  template.replace("{count}", String(count)).replace("{max}", String(max));

/**
 * MD3 text field — filled or outlined, over a **native `<input>`** (or
 * `<textarea>` with `multiline`), so forms, constraint validation,
 * `<fieldset disabled>`, server actions, autofill, IME and assistive tech all
 * get the real control. Every native prop (`name`, `value` / `defaultValue`,
 * `onChange`, `type`, `required`, `pattern`, `autoComplete`, `aria-*`, `ref`, …)
 * goes to that control; `className` / `style` go to the root.
 *
 * This module carries **no client directive**: it's a props → JSX component
 * (Server-Component-safe — `useId` is supported in Server Components), and every
 * state is CSS derived from the control (`:focus-within`, `:placeholder-shown`,
 * `:autofill`, `:disabled`, `[aria-invalid]`, `:user-invalid`), so an
 * uncontrolled field floats its label, validates and animates with zero JS.
 * One client island, `TextFieldInteraction`, adds click-to-focus, the clear
 * button / Escape, the password toggle, the live counter and the auto-grow
 * fallback; the built-in icon buttons bring the shared ripple island.
 *
 * Accessibility: there is no APG "textbox" pattern — the native control is the
 * contract. The label is a real `<label for>`; supporting / error text, the
 * counter (spoken as "n of max characters") and the prefix / suffix are wired
 * to `aria-describedby`; `error` sets `aria-invalid` and announces `errorText`
 * (`role="alert"`, as MD3 specifies); `required` adds the asterisk to the
 * label (part of the name, per MD3) and the native `required`.
 */
const TextField = (allProps: TextFieldProps) => {
  const {
    className,
    style,
    classNames,
    variant = "filled",
    density,
    color,
    label,
    labelPosition = "attached",
    alwaysFloatLabel = false,
    requiredIndicator = "*",
    supportingText,
    supportingTextOnFocus = false,
    error,
    errorText,
    errorIcon = true,
    leadingIcon,
    trailingIcon,
    prefix,
    suffix,
    clearable = false,
    clearIcon,
    passwordToggle,
    counter,
    labels,
    asChild = false,
    children,
    multiline = false,
    ...rest
  } = allProps;

  // What's left are the control's native props. Pull out the ones the view
  // merges or overrides; textarea-only sizing props never reach an `<input>`.
  const {
    id: idProp,
    type: typeProp,
    placeholder,
    rows,
    minRows,
    maxRows,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...controlProps
  } = rest as ControlProps;
  const { required, disabled, maxLength, value, defaultValue } = controlProps;

  const autoId = useId();
  const id = idProp ?? autoId;
  const supportingId = `${id}-supporting`;
  const counterId = `${id}-counter`;
  const prefixId = `${id}-prefix`;
  const suffixId = `${id}-suffix`;

  const type = multiline ? undefined : (typeProp ?? "text");
  const hasLabel = isRenderable(label);
  const labelMode = !hasLabel
    ? "none"
    : labelPosition === "above"
      ? "above"
      : "attached";
  const float =
    alwaysFloatLabel || (type !== undefined && ALWAYS_FLOAT_TYPES.has(type));

  const hasPrefix = isRenderable(prefix);
  const hasSuffix = isRenderable(suffix);
  const hasLeading = isRenderable(leadingIcon);
  const hasTrailing = isRenderable(trailingIcon);
  const hasPasswordToggle = type === "password" && passwordToggle !== false;
  const showErrorIcon = !hasTrailing && errorIcon !== false && !!errorIcon;
  const hasSupportingText = isRenderable(supportingText);
  const hasErrorText = isRenderable(errorText);
  const showCounter = counter ?? maxLength !== undefined;
  const autosize = multiline && rows === undefined;

  const controlled = value !== undefined;
  const count = String(value ?? defaultValue ?? "").length;
  const counterTemplate =
    labels?.characterCount ??
    (maxLength === undefined
      ? "{count} characters"
      : "{count} of {max} characters");

  const describedBy =
    [
      ariaDescribedBy,
      hasPrefix ? prefixId : undefined,
      hasSuffix ? suffixId : undefined,
      hasSupportingText || hasErrorText ? supportingId : undefined,
      showCounter ? counterId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const labelContent = (
    <>
      {label}
      {required && isRenderable(requiredIndicator) && requiredIndicator}
    </>
  );

  const Control = asChild ? Slot.Root : multiline ? "textarea" : "input";

  const control = (
    <Control
      data-slot="text-field-input"
      data-autosize={autosize || undefined}
      className={cn(
        multiline ? TEXTAREA : INPUT,
        autosize && "field-sizing-content",
        classNames?.input,
      )}
      style={
        autosize
          ? {
              minHeight: `${minRows ?? 1}lh`,
              maxHeight: maxRows ? `${maxRows}lh` : undefined,
            }
          : undefined
      }
      rows={multiline ? (rows ?? minRows ?? 1) : undefined}
      {...(controlProps as object)}
      aria-invalid={error ? true : ariaInvalid}
      aria-describedby={describedBy}
      id={id}
      type={type}
      // `:placeholder-shown` is how CSS knows the field is empty, so there is
      // always a placeholder — a lone space when you didn't give one.
      placeholder={placeholder ?? " "}
    >
      {asChild ? children : undefined}
    </Control>
  );

  const trailingCount = (hasTrailing ? 1 : 0) + (hasPasswordToggle ? 1 : 0);

  return (
    <div
      data-slot="text-field"
      data-variant={variant}
      data-label={labelMode}
      data-float={float || undefined}
      data-error={error === undefined ? undefined : String(error)}
      data-error-text={hasErrorText || undefined}
      data-error-icon={showErrorIcon || undefined}
      data-leading={hasLeading || undefined}
      data-trailing={trailingCount || undefined}
      data-clearable={clearable || undefined}
      data-multiline={multiline || undefined}
      data-supporting={supportingTextOnFocus ? "focus" : undefined}
      className={cn(
        textFieldVariants({ variant, density, color, labelMode }),
        className,
      )}
      style={style}
    >
      {labelMode === "above" && (
        <label
          htmlFor={id}
          data-slot="text-field-label"
          className={cn(LABEL_ABOVE, classNames?.label)}
        >
          {labelContent}
        </label>
      )}

      <div
        data-slot="text-field-container"
        className={cn(CONTAINER, classNames?.container)}
      >
        {variant === "filled" && (
          <span
            data-slot="text-field-indicator"
            aria-hidden
            className={INDICATOR}
          />
        )}
        {variant === "outlined" &&
          (labelMode === "attached" ? (
            <span
              data-slot="text-field-outline"
              aria-hidden
              className={OUTLINE_ROW}
            >
              <span className={OUTLINE_START} />
              <span className={OUTLINE_NOTCH}>
                <span className={OUTLINE_LABEL_COPY}>{labelContent}</span>
              </span>
              <span className={OUTLINE_END} />
            </span>
          ) : (
            <span
              data-slot="text-field-outline"
              aria-hidden
              className={OUTLINE}
            />
          ))}

        {labelMode === "attached" && (
          <label
            htmlFor={id}
            data-slot="text-field-label"
            className={cn(LABEL, classNames?.label)}
          >
            {labelContent}
          </label>
        )}

        {hasLeading && (
          <span
            data-slot="text-field-leading-icon"
            className={cn(LEADING, classNames?.leadingIcon)}
          >
            {leadingIcon}
          </span>
        )}

        <span data-slot="text-field-field" className={FIELD}>
          {hasPrefix && (
            <span
              id={prefixId}
              data-slot="text-field-prefix"
              className={cn(PREFIX, classNames?.prefix)}
            >
              {prefix}
            </span>
          )}
          {control}
          {hasSuffix && (
            <span
              id={suffixId}
              data-slot="text-field-suffix"
              className={cn(SUFFIX, classNames?.suffix)}
            >
              {suffix}
            </span>
          )}
        </span>

        <span
          data-slot="text-field-trailing"
          className={cn(TRAILING, classNames?.trailingIcon)}
        >
          {clearable && (
            <span className={CLEAR_BOX}>
              <IconButton
                data-slot="text-field-clear"
                aria-label={labels?.clear ?? "Clear"}
                aria-controls={id}
                tabIndex={-1}
                className={ACTION_BUTTON}
              >
                {clearIcon ?? <TextFieldClearIcon />}
              </IconButton>
            </span>
          )}
          {hasPasswordToggle && (
            <span className={TRAILING_BOX}>
              <IconButton
                data-slot="text-field-password-toggle"
                data-label-show={labels?.showPassword ?? "Show password"}
                data-label-hide={labels?.hidePassword ?? "Hide password"}
                aria-label={labels?.showPassword ?? "Show password"}
                aria-controls={id}
                disabled={disabled}
                className={cn(
                  ACTION_BUTTON,
                  "[&:not([data-visible])>[data-icon=hide]]:hidden [&[data-visible]>[data-icon=show]]:hidden",
                )}
              >
                <TextFieldVisibilityIcon data-icon="show" />
                <TextFieldVisibilityIcon data-icon="hide" off />
              </IconButton>
            </span>
          )}
          {hasTrailing && (
            <span data-slot="text-field-trailing-icon" className={TRAILING_BOX}>
              {trailingIcon}
            </span>
          )}
          {showErrorIcon && (
            <span
              data-slot="text-field-error-icon"
              role="img"
              aria-label={labels?.error ?? "Error"}
              className={ERROR_ICON_BOX}
            >
              {errorIcon === true ? <TextFieldErrorIcon /> : errorIcon}
            </span>
          )}
        </span>

        <TextFieldInteraction />
      </div>

      {(hasSupportingText || hasErrorText || showCounter) && (
        <div
          data-slot="text-field-supporting"
          className={cn(SUPPORTING_ROW, classNames?.supportingText)}
        >
          <div id={supportingId} className={SUPPORTING_TEXT_WRAP}>
            {hasSupportingText && (
              <span
                data-slot="text-field-supporting-text"
                className={SUPPORTING_TEXT}
              >
                {supportingText}
              </span>
            )}
            {hasErrorText && (
              <span
                // Re-mount when `error` turns on so the alert is announced.
                key={error ? "alert" : "idle"}
                data-slot="text-field-error-text"
                role={error ? "alert" : undefined}
                className={ERROR_TEXT}
              >
                {errorText}
              </span>
            )}
          </div>
          {showCounter && (
            <span
              id={counterId}
              data-slot="text-field-counter"
              data-controlled={controlled || undefined}
              data-max={maxLength}
              data-template={counterTemplate}
              data-over={
                (maxLength !== undefined && count > maxLength) || undefined
              }
              className={cn(COUNTER, classNames?.counter)}
            >
              <span aria-hidden data-part="visible">
                {maxLength === undefined ? count : `${count}/${maxLength}`}
              </span>
              <span className="sr-only" data-part="spoken">
                {fill(counterTemplate, count, maxLength)}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TextField;
