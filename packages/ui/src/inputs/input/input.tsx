import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type InputProps } from "./input.types";
import { inputVariants } from "./input.variants";
import { INPUT_BASE, LABEL_BASE } from "../config";

/**
 * Material Design 3 Input / Text Field component.
 * Supports filled and outlined styles, floating labels, leading and trailing icons,
 * helper/error text, and native states. Renderable as a React Server Component.
 */
const Input = ({
  className,
  variant = "filled",
  size = "s",
  error = false,
  label,
  startIcon,
  endIcon,
  helperText,
  errorText,
  asChild = false,
  disabled,
  placeholder,
  ref,
  ...props
}: InputProps) => {
  const Comp = asChild ? Slot.Root : "input";
  const isFilled = variant === "filled";
  const isXs = size === "xs";

  // Compute padding classes based on icons and sizes
  const paddingLeft = startIcon
    ? isXs
      ? "pl-10"
      : "pl-12"
    : isXs
      ? "pl-3"
      : "pl-4";
  const paddingRight = endIcon
    ? isXs
      ? "pr-10"
      : "pr-12"
    : isXs
      ? "pr-3"
      : "pr-4";
  const paddingY = isFilled ? (isXs ? "pt-4 pb-0.5" : "pt-5 pb-1") : "";

  // Label offsets
  const labelLeftResting = startIcon
    ? isXs
      ? "left-10"
      : "left-12"
    : isXs
      ? "left-3"
      : "left-4";

  // Helper/error text selector
  const showErrorMessage = error && errorText;
  const bottomText = showErrorMessage ? errorText : helperText;

  return (
    <div className="flex w-full flex-col items-stretch">
      {/* Input container */}
      <div
        className={cn(
          inputVariants({ variant, size, error }),
          disabled && "pointer-events-none opacity-[0.38]",
          className,
        )}
      >
        {/* Leading Icon */}
        {startIcon && !asChild && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-on-surface-variant",
              isXs ? "left-3 [&_svg]:size-5" : "left-4 [&_svg]:size-6",
            )}
          >
            {startIcon}
          </div>
        )}

        {/* Input/Slot element */}
        <Comp
          ref={ref as React.Ref<HTMLInputElement>}
          disabled={disabled}
          placeholder={placeholder || " "}
          className={cn(
            INPUT_BASE,
            paddingLeft,
            paddingRight,
            paddingY,
            label
              ? "placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-100 focus:placeholder:opacity-100"
              : "placeholder:opacity-100",
          )}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <label
            className={cn(
              LABEL_BASE,
              labelLeftResting,
              isXs ? "text-body-medium" : "text-body-large",
              error
                ? "text-[color:var(--md-comp-input-error-color,var(--md-sys-color-error))] peer-focus:text-[color:var(--md-comp-input-error-color,var(--md-sys-color-error))]"
                : "text-on-surface-variant peer-focus:text-[color:var(--md-comp-input-focus-color,var(--md-sys-color-primary))]",
              // Floating states
              isFilled
                ? cn(
                    isXs
                      ? "peer-focus:top-0.5 peer-focus:-translate-y-0 peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:scale-75"
                      : "peer-focus:top-1.5 peer-focus:-translate-y-0 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:scale-75",
                    startIcon &&
                      (isXs
                        ? "peer-focus:left-10 peer-[:not(:placeholder-shown)]:left-10"
                        : "peer-focus:left-12 peer-[:not(:placeholder-shown)]:left-12"),
                  )
                : cn(
                    "peer-focus:top-0 peer-focus:px-1 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:bg-[var(--md-sys-color-surface,white)]",
                    "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:bg-[var(--md-sys-color-surface,white)]",
                    startIcon &&
                      cn(
                        "peer-focus:left-4 peer-[:not(:placeholder-shown)]:left-4",
                        isXs &&
                          "peer-focus:left-3 peer-[:not(:placeholder-shown)]:left-3",
                      ),
                  ),
            )}
          >
            {label}
          </label>
        )}

        {/* Trailing Icon */}
        {endIcon && !asChild && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center justify-center",
              error ? "text-error" : "text-on-surface-variant",
              isXs ? "right-3 [&_svg]:size-5" : "right-4 [&_svg]:size-6",
            )}
          >
            {endIcon}
          </div>
        )}
      </div>

      {/* Supporting Text */}
      {bottomText && (
        <span
          className={cn(
            "px-4 pt-1 text-body-small select-none",
            showErrorMessage
              ? "text-[color:var(--md-comp-input-error-color,var(--md-sys-color-error))]"
              : "text-on-surface-variant",
            disabled && "opacity-[0.38]",
          )}
        >
          {bottomText}
        </span>
      )}
    </div>
  );
};

export default Input;
