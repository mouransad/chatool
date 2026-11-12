"use client";

import { useState } from "react";
import Card, { CardHeadline, CardSubhead } from "@chatool/ui/card";

/**
 * Toggle cards (`aria-pressed`): the card *is* a `<button>`; `selected` adds
 * MD3's checked styling and pops the check icon in on the Expressive spring.
 */
export function CardToggleGroup() {
  const [picked, setPicked] = useState<string[]>(["Hiking"]);

  return (
    <div className="gap-3 sm:grid-cols-4 grid w-full grid-cols-2">
      {["Hiking", "Cycling", "Climbing", "Kayaking"].map((name) => {
        const on = picked.includes(name);
        return (
          <Card key={name} asChild variant="outlined" selected={on}>
            <button
              type="button"
              onClick={() =>
                setPicked((p) =>
                  on ? p.filter((x) => x !== name) : [...p, name],
                )
              }
            >
              <CardHeadline asChild>
                <span>{name}</span>
              </CardHeadline>
              <CardSubhead asChild>
                <span>{on ? "Selected" : "Tap to select"}</span>
              </CardSubhead>
            </button>
          </Card>
        );
      })}
    </div>
  );
}
