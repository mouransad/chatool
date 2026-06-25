# AGENTS.md — @chatool/core

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/core.md](../../docs/packages/core.md).

- **This package is a client boundary.** `ChatoolProvider` and `useTheme` need
  React state/context, so every `src/**` module that ships runtime code starts
  with `"use client";` — including the re-export barrels `src/index.ts` and
  `src/theme/index.ts` (tsdown only keeps a directive at the top of the entry's
  own source, so the barrels need it too). `src/theme/types.ts` is types-only and
  stays pure.
- **Theme-only by design.** This package owns dark-mode/theme state and nothing
  else. Do **not** pull `@chatool/api` (or its services) into a React context
  here — the API stays framework-agnostic and server-injectable via
  `createServices`/`getServices`. Do **not** try to absorb the CSS imports; the
  `@import "@chatool/styles/..."` / `@source` lines stay in the consumer's global
  CSS because Tailwind needs them at build time.
- **Dark mode is class-based.** The provider toggles the `dark` class on
  `<html>`, matching the `.dark { … }` selector in
  [packages/styles/theme.css](../../packages/styles/theme.css). Keep that class
  name in sync if the styles ever change it.
- **No-flash script is intentional.** The inline `<script>` rendered by
  `ChatoolProvider` runs before hydration to set the class with no flash. Its
  logic must stay equivalent to `resolveTheme` in `chatool-provider.tsx`.
- `react` is the only `peerDependency`; there are no runtime `dependencies`.
- One subpath: `.`. If you add another, update `exports` + `tsdown.config.ts`
  together (ESM `.mjs`/`.d.mts` + CJS `.cjs`/`.d.cts`).
