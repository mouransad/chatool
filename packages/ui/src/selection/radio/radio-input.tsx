"use client";

import { useContext } from "react";
import type * as React from "react";

import RadioGroupContext from "../radio-group/radio-group-context";

type RadioInputProps = Omit<React.ComponentProps<"input">, "type">;

/**
 * The radio's native `<input type="radio">`, as a tiny client island. It's the
 * only part of `Radio` that needs to be client code: it reads the optional
 * `RadioGroup` context (shared `name`, controlled `value`, `required`, `form`,
 * `onValueChange`). The rest of `Radio` — label row, SVG, state layer — stays
 * a server-rendered shell.
 *
 * Client components are still server-side rendered, so the group's name and
 * selection are in the first HTML paint: an uncontrolled group selects, moves
 * with the arrow keys and submits before hydration.
 *
 * Outside a group it is exactly `<input type="radio" {...props}>`.
 */
const RadioInput = ({
  onChange,
  checked,
  defaultChecked,
  required,
  form,
  ...props
}: RadioInputProps) => {
  const group = useContext(RadioGroupContext);

  if (!group) {
    return (
      <input
        checked={checked}
        defaultChecked={defaultChecked}
        required={required}
        form={form}
        onChange={onChange}
        {...props}
        type="radio"
      />
    );
  }

  // Native radios submit "on" when they have no value; match it for compare.
  const value = props.value === undefined ? "on" : String(props.value);
  const controlled = group.value !== undefined;

  return (
    <input
      required={required ?? group.required}
      form={form ?? group.form}
      {...props}
      // The group's name always wins: it's what makes the radios exclusive.
      name={group.name}
      checked={controlled ? group.value === value : checked}
      defaultChecked={
        controlled || checked !== undefined
          ? undefined
          : (defaultChecked ??
            (group.defaultValue === undefined
              ? undefined
              : group.defaultValue === value))
      }
      onChange={(event) => {
        onChange?.(event);
        group.onChange(event);
      }}
      type="radio"
    />
  );
};

export default RadioInput;
