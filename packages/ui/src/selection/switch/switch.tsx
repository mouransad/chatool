import { useId } from "react";
import type * as React from "react";
import { cn } from "@chatool/utils";

import Ripple from "../../buttons/ripple";
import SwitchInteraction from "./switch-interaction";
import { type SwitchProps } from "./switch.types";
import {
  HANDLE,
  HANDLE_CONTAINER,
  ICON_SELECTED,
  ICON_UNSELECTED,
  INPUT,
  LABEL,
  RIPPLE,
  SUPPORTING_TEXT,
  TEXT,
  TRACK,
  switchFieldVariants,
  switchVariants,
} from "./switch.variants";

const isRenderable = (node: React.ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/*
 * Default glyphs: Material Symbols `check` and `close` (weight 500, 24dp
 * optical size) — the same paths Material Web's switch ships.
 */
const CHECK_PATH =
  "M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z";
const CLOSE_PATH =
  "M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z";

/**
 * MD3 switch — a **native `<input type="checkbox" role="switch">`** under an
 * MD3 Expressive skin (the WAI-ARIA APG and Material Web approach), so forms,
 * `name` / `value`, `required`, `<fieldset disabled>`, server actions,
 * autofill and assistive tech all get the real control. Screen readers
 * announce it as a switch that is "on" / "off" from the native `checked`
 * state — never `aria-checked`. The input is invisible but covers the 48dp
 * touch target, so it receives every click, tap and key; its pseudo-classes
 * drive all visuals in CSS.
 *
 * This module carries **no client directive**: it's a props→JSX component
 * (Server-Component-safe — `useId` is supported in Server Components), and an
 * uncontrolled switch toggles and animates before hydration. Its client pieces
 * are islands rendered as children: the press `Ripple` (centred on the
 * handle, travelling with it) and `SwitchInteraction` (Enter to toggle, touch
 * press feedback, drag to toggle).
 *
 * Keyboard: Tab focuses, Space or Enter toggles (MD3 + APG). Every `aria-*`,
 * `name`, `value`, `checked` / `defaultChecked`, `onChange`, `required`,
 * `form` and `ref` goes straight to the input.
 */
const Switch = ({
  className,
  style,
  controlClassName,
  color,
  icons,
  selectedIcon,
  unselectedIcon,
  labelPosition,
  label,
  supportingText,
  onChange,
  onCheckedChange,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SwitchProps) => {
  const supportingId = useId();
  const hasLabel = isRenderable(label);
  const hasSupportingText = hasLabel && isRenderable(supportingText);

  const describedBy =
    [ariaDescribedBy, hasSupportingText ? supportingId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  // An explicit `icons` wins; otherwise custom glyphs imply their config.
  const iconConfig =
    icons ??
    (isRenderable(unselectedIcon)
      ? true
      : isRenderable(selectedIcon)
        ? "selected"
        : false);

  // Only wrap `onChange` when asked to, so a switch rendered from a Server
  // Component never carries a function prop.
  const handleChange = onCheckedChange
    ? (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        onCheckedChange(event.target.checked, event);
      }
    : onChange;

  const control = (
    <span
      data-slot="switch"
      className={cn(
        switchVariants({ color, icons: iconConfig }),
        controlClassName,
        !hasLabel && className,
      )}
      style={hasLabel ? undefined : style}
    >
      <input
        data-slot="switch-input"
        aria-describedby={describedBy}
        className={INPUT}
        onChange={handleChange}
        {...props}
        type="checkbox"
        role="switch"
      />
      <span data-slot="switch-track" aria-hidden className={TRACK} />
      <Ripple centered className={RIPPLE} />
      <span
        data-slot="switch-handle-container"
        aria-hidden
        className={HANDLE_CONTAINER}
      >
        <span data-slot="switch-handle" className={HANDLE}>
          {iconConfig !== false && (
            <span data-slot="switch-selected-icon" className={ICON_SELECTED}>
              {isRenderable(selectedIcon) ? (
                selectedIcon
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
                  <path d={CHECK_PATH} />
                </svg>
              )}
            </span>
          )}
          {iconConfig === true && (
            <span
              data-slot="switch-unselected-icon"
              className={ICON_UNSELECTED}
            >
              {isRenderable(unselectedIcon) ? (
                unselectedIcon
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
                  <path d={CLOSE_PATH} />
                </svg>
              )}
            </span>
          )}
        </span>
      </span>
      <SwitchInteraction />
    </span>
  );

  if (!hasLabel) return control;

  return (
    <label
      data-slot="switch-field"
      className={cn(switchFieldVariants({ labelPosition }), className)}
      style={style}
    >
      {control}
      <span data-slot="switch-text" className={TEXT}>
        <span data-slot="switch-label" className={LABEL}>
          {label}
        </span>
        {hasSupportingText && (
          <span
            id={supportingId}
            data-slot="switch-supporting-text"
            className={SUPPORTING_TEXT}
          >
            {supportingText}
          </span>
        )}
      </span>
    </label>
  );
};

export default Switch;
