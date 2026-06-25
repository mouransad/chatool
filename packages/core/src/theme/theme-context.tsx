"use client";

import { createContext, useContext } from "react";
import type { ThemeContextValue } from "./types";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Read the current theme, the resolved theme, and `setTheme` from the nearest
 * {@link ChatoolProvider}. Throws if no provider is mounted above.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a <ChatoolProvider>.");
  }
  return context;
}
