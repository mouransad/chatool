import type { ReactNode } from "react";

/** The user-selectable theme. `system` follows the OS color-scheme preference. */
export type Theme = "light" | "dark" | "system";

/** The concrete theme actually applied to the DOM (never `system`). */
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  /** The current selection (`light` | `dark` | `system`). */
  theme: Theme;
  /** The concrete theme on the document right now (`light` | `dark`). */
  resolvedTheme: ResolvedTheme;
  /** Persist and apply a new selection. */
  setTheme: (theme: Theme) => void;
}

export interface ChatoolProviderProps {
  children: ReactNode;
  /** Selection used before a stored value is read. Defaults to `"system"`. */
  defaultTheme?: Theme;
  /** `localStorage` key the selection is persisted under. Defaults to `"chatool-theme"`. */
  storageKey?: string;
  /** Allow the `system` option to follow `prefers-color-scheme`. Defaults to `true`. */
  enableSystem?: boolean;
}
