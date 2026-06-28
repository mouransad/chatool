"use client";

import { useTheme } from "@chatool/core";
import Button from "@chatool/ui/button";

/**
 * Client island: flips between light/dark via `@chatool/core`'s ChatoolProvider
 * so you can eyeball the `@chatool/core` light/dark token sets. The provider
 * persists the choice and handles the `.dark` class + no-flash on reload.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outlined"
      size="s"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Switch to light" : "Switch to dark"}
    </Button>
  );
}
