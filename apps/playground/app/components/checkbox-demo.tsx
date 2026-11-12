"use client";

import { useState } from "react";
import Checkbox from "@chatool/ui/checkbox";

const CHANNELS = ["Email", "Push", "SMS"];

/**
 * The APG tri-state pattern: the parent is checked when every child is,
 * indeterminate when some are, and checks/clears them all on activation.
 * Watch the check ⇄ dash morph on the parent.
 */
export function CheckboxParentChild() {
  const [checked, setChecked] = useState([true, false, false]);
  const all = checked.every(Boolean);
  const some = checked.some(Boolean);

  return (
    <fieldset className="m-0 p-0 border-0">
      <legend className="sr-only">Notification channels</legend>
      <Checkbox
        label="All channels"
        checked={all}
        indeterminate={some && !all}
        onChange={() => setChecked(checked.map(() => !all))}
        aria-controls="channels"
      />
      <div id="channels" className="ps-8 flex flex-col">
        {CHANNELS.map((name, index) => (
          <Checkbox
            key={name}
            label={name}
            checked={checked[index]}
            onChange={(event) =>
              setChecked(
                checked.map((value, i) =>
                  i === index ? event.target.checked : value,
                ),
              )
            }
          />
        ))}
      </div>
    </fieldset>
  );
}
