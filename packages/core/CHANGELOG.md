# @chatool/core

## 0.2.0

### Minor Changes

- Add `@chatool/core` — an app-root `ChatoolProvider` that owns theme/dark-mode
  state for Chatool apps. Supports `light | dark | system`, persists the selection
  to `localStorage`, follows `prefers-color-scheme` in `system` mode, and ships an
  SSR no-flash inline script. Exposes a `useTheme()` hook
  (`{ theme, resolvedTheme, setTheme }`). Client boundary (`"use client"`), `react`
  peer only, single `.` export. Replaces the manual
  `document.documentElement.classList` dark-mode toggling consumers did by hand;
  CSS imports and the framework-agnostic `@chatool/api` are intentionally left out
  of scope.
