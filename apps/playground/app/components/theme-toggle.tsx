"use client";

import { useState } from "react";
import Button from "@karnameh/ui/button";

/**
 * Client island: toggles the `.dark` class on <html> so you can eyeball the
 * `@karnameh/styles` light/dark token sets. Lives inside a Server Component.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      {dark ? "Switch to light" : "Switch to dark"}
    </Button>
  );
}
