"use client";

import { useState } from "react";
import RadioGroup from "@chatool/ui/radio-group";
import Radio from "@chatool/ui/radio";

/**
 * A controlled group: `value` + `onValueChange`. Arrow keys move focus and
 * selection together; the old dot retracts while the new one springs open.
 */
export function RadioControlled() {
  const [value, setValue] = useState<string | null>("standard");

  return (
    <RadioGroup
      label="Shipping"
      value={value}
      onValueChange={setValue}
      supportingText={`value = ${JSON.stringify(value)}`}
    >
      <Radio
        value="standard"
        label="Standard"
        supportingText="4–6 business days · Free"
      />
      <Radio
        value="express"
        label="Express"
        supportingText="1–2 business days · $9.99"
      />
      <Radio
        value="pickup"
        label="Store pickup"
        supportingText="Ready in 2 hours"
      />
    </RadioGroup>
  );
}
