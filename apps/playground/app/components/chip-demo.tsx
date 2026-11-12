"use client";

import { useState } from "react";
import Chip from "@chatool/ui/chip";
import ChipSet from "@chatool/ui/chip-set";
import MailOutlined from "@chatool/icons/MailOutlined";

const CUISINES = ["Ramen", "Pizza", "Tacos", "Curry", "Dumplings"];

/**
 * Filter chips in a multi-select `ChipSet` (controlled): one Tab stop, ←/→
 * between chips, Space toggles. The selection is echoed below.
 */
export function ChipFilterSet() {
  const [value, setValue] = useState<string[]>(["Ramen"]);
  return (
    <div className="gap-2 flex flex-col">
      <ChipSet
        aria-label="Cuisine"
        selectionMode="multiple"
        value={value}
        onValueChange={setValue}
      >
        {CUISINES.map((name) => (
          <Chip key={name} variant="filter" value={name}>
            {name}
          </Chip>
        ))}
      </ChipSet>
      <p className="text-body-small text-on-surface-variant">
        value = {JSON.stringify(value)}
      </p>
    </div>
  );
}

/**
 * Input chips with a set-level `onRemove`: click ×, or focus a chip and press
 * Backspace / Delete — focus moves to the neighbouring chip.
 */
export function ChipInputSet() {
  const [emails, setEmails] = useState([
    "ada@example.com",
    "alan@example.com",
    "grace@example.com",
  ]);
  return (
    <ChipSet
      aria-label="Recipients"
      onRemove={(email) =>
        setEmails((current) => current.filter((item) => item !== email))
      }
    >
      {emails.map((email) => (
        <Chip key={email} variant="input" value={email} icon={<MailOutlined />}>
          {email}
        </Chip>
      ))}
    </ChipSet>
  );
}
