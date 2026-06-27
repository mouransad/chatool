# @chatool/core

## 0.3.0

### Minor Changes

- Merge `@chatool/styles` into `@chatool/core`. The CSS-only theme layer is now
  shipped by `@chatool/core` as two new subpaths, and the standalone
  `@chatool/styles` package is removed.

  **Breaking — migrate your CSS imports and dependency:**

  - `@chatool/styles/styles.css` → `@chatool/core/styles.css`
  - `@chatool/styles/theme.css` → `@chatool/core/theme.css`
  - Remove `@chatool/styles` from your dependencies (the CSS now comes from
    `@chatool/core`, which you already install for `ChatoolProvider`).

  `tailwindcss` is now an **optional** peer of `@chatool/core` (only needed to
  process the theme CSS). `@chatool/ui`'s docs/description now point at
  `@chatool/core` for its required design tokens.

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
