"use client";

import { useTheme } from "@chatool/core";

/**
 * Client island: flips between light/dark via `@chatool/core`'s ChatoolProvider.
 *
 * It renders standard HTML buttons styled with shadcn/Tailwind CSS variables
 * (e.g. border-border, bg-background, hover:bg-muted).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-3 py-1.5 text-sm font-medium cursor-pointer rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted"
    >
      <span className="dark:hidden">Switch to dark</span>
      <span className="hidden dark:inline">Switch to light</span>
    </button>
  );
}
