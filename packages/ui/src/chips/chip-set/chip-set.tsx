"use client";

import { cn } from "@chatool/utils";

import ChipSetContext from "./chip-set-context";
import { type ChipSetProps } from "./chip-set.types";
import { chipSetVariants } from "./chip-set.variants";
import { useLogic } from "./use-logic";

/**
 * MD3 chip set — chips "appear as a group of interactive elements", so the
 * group is one unit for the keyboard. It renders a `role="toolbar"` (the WAI-ARIA
 * APG toolbar pattern, as Material Web's `md-chip-set` does): a **single Tab
 * stop** with a roving tabindex, ←/→ (mirrored in RTL) between chips and their
 * remove buttons, Home / End, and wrap-around. Give it an accessible name
 * (`aria-label` / `aria-labelledby`); MD3 also asks for a visible cue that the
 * chips are interactive, such as a label like "Select type" before the set.
 *
 * It's a client component because it provides context and owns selection:
 * `selectionMode="single" | "multiple"` turns its filter (and input) chips into
 * one selection with `value` / `defaultValue` / `onValueChange`, `required`
 * keeps one selected, and `name` submits the selection with a form. `onRemove`
 * makes its input chips removable, and focus moves to a neighbouring chip when
 * one is removed. It still renders on the server, so the selection is in the
 * first paint; the roving tabindex starts once it hydrates (before that every
 * chip is a Tab stop, which still works).
 */
const ChipSet = ({
  className,
  layout,
  selectionMode = "none",
  value,
  defaultValue,
  onValueChange,
  required = false,
  disabled = false,
  onRemove,
  loop = true,
  name,
  form,
  ref,
  role = "toolbar",
  onKeyDown,
  onFocus,
  onBlur,
  children,
  ...props
}: ChipSetProps) => {
  const logic = useLogic({
    selectionMode,
    value,
    defaultValue,
    onValueChange,
    required,
    disabled,
    onRemove,
    loop,
    ref,
  });

  return (
    <div
      ref={logic.setRef}
      role={role}
      data-slot="chip-set"
      data-layout={layout ?? "wrap"}
      data-selection-mode={selectionMode}
      aria-disabled={disabled || undefined}
      className={cn(chipSetVariants({ layout }), className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        logic.onKeyDown(event);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        logic.onFocus(event);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        logic.onBlur(event);
      }}
      {...props}
    >
      <ChipSetContext value={logic.context}>{children}</ChipSetContext>
      {name !== undefined
        ? logic.selected.map((item) => (
            <input
              key={item}
              type="hidden"
              name={name}
              value={item}
              form={form}
              disabled={disabled}
            />
          ))
        : null}
    </div>
  );
};

export default ChipSet;
