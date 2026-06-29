"use client";

import { useTheme } from "@chatool/core";
import Button from "@chatool/ui/button";

/**
 * Client island: flips between light/dark via `@chatool/core`'s ChatoolProvider
 * so you can eyeball the `@chatool/core` light/dark token sets. The provider
 * persists the choice and handles the `.dark` class + no-flash on reload.
 *
 * The label can't be derived from `resolvedTheme` at render time: for a `system`
 * default it's the SSR fallback on the server but the real OS theme on the
 * client's first render, which hydration-mismatches. Instead we render *both*
 * labels and let CSS show the right one off the `.dark` class the provider's
 * inline script sets before hydration — identical HTML on both sides, correct on
 * first paint. The click handler reads `resolvedTheme`, which is accurate by the
 * time a user can click (post-mount).
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
      <span className="dark:hidden">Switch to dark</span>
      <span className="hidden dark:inline">Switch to light</span>
    </Button>
  );
}
