"use client";

import { useState } from "react";
import ButtonGroup from "@chatool/ui/button-group";
import { Button } from "@chatool/ui/button";

const RANGES = ["Day", "Week", "Month"];

/** Client island: a single-select segmented control built from a connected group. */
export function ButtonGroupSingleSelect() {
  const [value, setValue] = useState("Week");

  return (
    <ButtonGroup variant="connected" aria-label="Range">
      {RANGES.map((range) => (
        <Button
          key={range}
          variant={value === range ? "filled" : "tonal"}
          selected={value === range}
          onClick={() => setValue(range)}
        >
          {range}
        </Button>
      ))}
    </ButtonGroup>
  );
}
