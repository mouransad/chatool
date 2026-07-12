# @chatool/core

## 2.0.0

### Major Changes

- 868cc00: Refactored the design system structure to migrate from Material Design 3 back to shadcn:
  - Removed Material Design 3 buttons, icon-buttons, button-groups, ripples, and spinners from `@chatool/ui`.
  - Removed Material Design 3 theme variables and replaced them with shadcn-compliant oklch colors and radius variables in `@chatool/core`.
  - Initialized shadcn configuration in `packages/ui/components.json`.
  - Simplified tailwind-merge configuration in `@chatool/utils`.
  - Updated all internal apps (playground and storybook) and documentation to remove MD3 references.

## 1.0.0

### Major Changes

- 5070036: Migrate the design system from shadcn to **Material Design 3 (Material You)**.

  **`@chatool/core`** — `theme.css` now ships the MD3 token foundation: `--md-sys-*`
  system tokens (full color role set, the 15-role type scale, shape, elevation,
  state-layer, and motion) in `:root` + `.dark`, plus `--md-ref-typeface-*`. These
  are mapped to Tailwind utilities via `@theme inline` (`bg-primary`,
  `text-on-surface`, `bg-surface-container-low`, `rounded-*`, `text-label-large`,
  `shadow-elevation-1`, …). `styles.css` base layer now uses MD3 surface/on-surface
  roles and the body type scale.

  **BREAKING:** the shadcn tokens (`--primary`, `--muted`, `--accent`,
  `--destructive`, `--card`, `--popover`, `--border`, `--input`, `--ring`,
  `--radius`, and their `*-foreground` Tailwind utilities like `bg-card` /
  `text-muted-foreground`) are removed. Customize by overriding `--md-sys-*` (Material
  Theme Builder output drops in 1:1) — see `docs/conventions/material-design.md`.

  **`@chatool/ui`** — `Button` is rewritten to the MD3 spec.

  **BREAKING:** variants are now `filled` (default) · `tonal` · `elevated` ·
  `outlined` · `text` (previously `default` · `secondary` · `destructive` ·
  `outline` · `ghost` · `link`); buttons are pill-shaped (`rounded-full`) and use the
  Label Large type scale. Sizes (`default` · `sm` · `lg` · `icon`) are unchanged in
  name.

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
