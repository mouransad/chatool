"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "./theme-context";
import type { ChatoolProviderProps, ResolvedTheme, Theme } from "./types";

const DARK_CLASS = "dark";
const DEFAULT_STORAGE_KEY = "chatool-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function resolveTheme(theme: Theme, enableSystem: boolean): ResolvedTheme {
  if (theme === "system") return enableSystem ? getSystemTheme() : "light";
  return theme;
}

function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.classList.toggle(DARK_CLASS, resolved === "dark");
}

function readStoredTheme(storageKey: string, enableSystem: boolean): Theme | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (value === "light" || value === "dark") return value;
    if (value === "system" && enableSystem) return "system";
    return null;
  } catch {
    return null;
  }
}

/**
 * Inline script injected into the SSR markup. It runs **before** hydration and
 * sets the `dark` class from the persisted selection, so there is no flash of
 * the wrong theme. Mirrors {@link resolveTheme} in plain, minified JS.
 */
function buildThemeScript(
  storageKey: string,
  defaultTheme: Theme,
  enableSystem: boolean,
): string {
  return `(function(){try{var d=document.documentElement;var t=localStorage.getItem(${JSON.stringify(
    storageKey,
  )})||${JSON.stringify(defaultTheme)};var s=${enableSystem ? "true" : "false"};var m=window.matchMedia(${JSON.stringify(
    MEDIA_QUERY,
  )}).matches;d.classList.toggle(${JSON.stringify(
    DARK_CLASS,
  )},t==="dark"||(t==="system"&&s&&m));}catch(e){}})();`;
}

/**
 * App-root provider that owns theme/dark-mode state for Chatool apps:
 * `light | dark | system`, persisted to `localStorage` and applied via the
 * `dark` class that `@chatool/styles` keys its dark tokens off. SSR renders with
 * `defaultTheme`; an inline script corrects the class pre-hydration (no flash),
 * then state is reconciled from storage on mount.
 *
 * Add `suppressHydrationWarning` to your `<html>` element — the class is set
 * imperatively, not by React.
 */
export function ChatoolProvider({
  children,
  defaultTheme = "system",
  storageKey = DEFAULT_STORAGE_KEY,
  enableSystem = true,
}: ChatoolProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(defaultTheme, enableSystem),
  );

  // Reconcile React state with the persisted selection + real OS preference on
  // mount. The inline script already set the DOM class, so we don't touch it
  // here — that avoids a flash from a stale-default re-apply.
  const hydrated = useRef(false);
  useEffect(() => {
    const stored = readStoredTheme(storageKey, enableSystem);
    const initial = stored ?? defaultTheme;
    setThemeState(initial);
    setResolvedTheme(resolveTheme(initial, enableSystem));
    hydrated.current = true;
  }, [storageKey, enableSystem, defaultTheme]);

  // Apply + reflect every selection change — but skip the first commit (handled
  // by the hydrate effect above + the pre-hydration inline script).
  const skipNextApply = useRef(true);
  useEffect(() => {
    if (skipNextApply.current) {
      skipNextApply.current = false;
      return;
    }
    const resolved = resolveTheme(theme, enableSystem);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [theme, enableSystem]);

  // While in `system` mode, follow live OS color-scheme changes.
  useEffect(() => {
    if (!enableSystem || theme !== "system") return;
    const media = window.matchMedia(MEDIA_QUERY);
    const onChange = () => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, enableSystem]);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage may be unavailable (private mode, disabled) — selection still
        // applies for this session, it just won't persist.
      }
      setThemeState(next);
    },
    [storageKey],
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: buildThemeScript(storageKey, defaultTheme, enableSystem),
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}
