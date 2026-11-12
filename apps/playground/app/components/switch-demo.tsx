"use client";

import { useState } from "react";
import Switch from "@chatool/ui/switch";
import DarkModeOutlined from "@chatool/icons/DarkModeOutlined";
import LightModeOutlined from "@chatool/icons/LightModeOutlined";

/**
 * Controlled, Compose-style: `checked` + `onCheckedChange`. Drag it, flick
 * it, or Tab to it and press Enter — every path calls `onCheckedChange` once.
 */
export function SwitchControlled() {
  const [dark, setDark] = useState(false);

  return (
    <Switch
      label="Dark theme"
      supportingText={`checked = ${String(dark)}`}
      checked={dark}
      onCheckedChange={setDark}
      selectedIcon={<DarkModeOutlined />}
      unselectedIcon={<LightModeOutlined />}
    />
  );
}
