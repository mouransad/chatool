# AGENTS.md — @chatool/core

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/core.md](../../docs/packages/core.md).

- **This package is a client boundary.** `ChatoolProvider` and `useTheme` need
  React state/context, so every `src/**` module that ships runtime code starts
  with `"use client";` — including the re-export barrels `src/index.ts` and
  `src/theme/index.ts` (tsdown only keeps a directive at the top of the entry's
  own source, so the barrels need it too). `src/theme/types.ts` is types-only and
  stays pure.
- **Theme + CSS by design.** This package owns dark-mode/theme state **and** the
  CSS-only theme layer (`styles.css` / `theme.css`) — and nothing else. Keep it
  theme-only; don't grow it into a data/services layer. The provider JS does
  **not** import the CSS; the `@import "@chatool/core/styles.css"` / `@source`
  lines stay in the consumer's global CSS because Tailwind needs them at build
  time.
- **The CSS is CSS-only, no build.** `styles.css` / `theme.css` live at the
  package root (not `dist/`), are exported directly (`./styles.css`,
  `./theme.css`), listed in `files`, and untouched by tsdown. `styles.css` must
  `@import "./theme.css"` (single source for tokens). Keep base `@layer` rules in
  `styles.css`; keep tokens + `:root`/`.dark` vars in `theme.css`. Do **not** add
  `@import "tailwindcss";` here — the consumer adds that. The shipped files
  implement the **Material Design 3** token layer: `--md-sys-*` system tokens
  (color/typescale/shape/elevation/state/motion) in `:root`/`.dark`, mapped to
  Tailwind utilities via `@theme inline`. Color values are the MD3 baseline
  scheme. Keep token names spec-faithful so Material Theme Builder output drops in.
  Canonical spec: [docs/conventions/material-design.md](../../docs/conventions/material-design.md).
- **`tailwindcss` is an optional `peerDependency`** (only needed to process the
  theme CSS), never a dependency. `core` marks `**/*.css` in `sideEffects`.
- **Dark mode is class-based.** The provider toggles the `dark` class on
  `<html>`, matching the `.dark { … }` selector in
  [theme.css](./theme.css). Keep that class name in sync if the CSS ever
  changes it.
- **No-flash script is intentional.** The inline `<script>` rendered by
  `ChatoolProvider` runs before hydration to set the class with no flash. Its
  logic must stay equivalent to `resolveTheme` in `chatool-provider.tsx`.
- `react` is the only required `peerDependency` (`tailwindcss` is an optional
  peer); there are no runtime `dependencies`.
- Subpaths: `.` (JS), `./styles.css`, `./theme.css`. If you add another JS
  subpath, update `exports` + `tsdown.config.ts` together (ESM `.mjs`/`.d.mts` +
  CJS `.cjs`/`.d.cts`). CSS subpaths are mapped directly to the root `.css` files
  (no tsdown entry).
