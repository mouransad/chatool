"use client";

import { useState } from "react";
import List, { ListItem, ListItemDragHandle } from "@chatool/ui/list";
import Checkbox from "@chatool/ui/checkbox";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import LanguageRounded from "@chatool/icons/LanguageRounded";

/**
 * A single-select **listbox** (MD3 web: `role="listbox"` of `option`s):
 * controlled `value`, typeahead, and two selection cues (container + check).
 */
export function ListSingleSelect() {
  const [city, setCity] = useState<string | null>("Lisbon");
  return (
    <div className="w-80 gap-2 p-2 grid rounded-xl bg-surface">
      <List
        aria-label="Choose a city"
        selectionMode="single"
        value={city}
        onValueChange={setCity}
        variant="segmented"
      >
        {["Kyoto", "Lisbon", "Montreal", "Oslo"].map((name) => (
          <ListItem
            key={name}
            value={name}
            leading={city === name ? <CheckOutlined /> : <LanguageRounded />}
          >
            {name}
          </ListItem>
        ))}
      </List>
      <p className="px-4 text-body-small text-on-surface-variant">
        Selected: {city ?? "none"}
      </p>
    </div>
  );
}

/**
 * Multi-select listbox with decorative checkboxes, kept in sync by the list
 * (Shift + ↑ / ↓ extend, Ctrl / ⌘ + A select all).
 */
export function ListMultiSelect() {
  const [value, setValue] = useState<string[]>(["Wi-Fi"]);
  return (
    <List
      aria-label="Sync over"
      selectionMode="multiple"
      value={value}
      onValueChange={setValue}
      className="w-80"
    >
      {["Wi-Fi", "Mobile data", "Roaming"].map((name) => (
        <ListItem key={name} value={name} control={<Checkbox />}>
          {name}
        </ListItem>
      ))}
    </List>
  );
}

/** Drag (or Space + ↑ / ↓) to reorder; the list reports `onReorder`. */
export function ListReorder() {
  const [items, setItems] = useState(["Design", "Build", "Test", "Ship"]);
  return (
    <List
      aria-label="Release steps"
      variant="segmented"
      reorderable
      className="w-80 p-2 rounded-xl bg-surface"
      onReorder={({ from, to }) =>
        setItems((list) => {
          const next = [...list];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved!);
          return next;
        })
      }
    >
      {items.map((item) => (
        <ListItem
          key={item}
          value={item}
          trailing={<ListItemDragHandle label={`Reorder ${item}`} />}
        >
          {item}
        </ListItem>
      ))}
    </List>
  );
}
