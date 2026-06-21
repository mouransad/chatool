# AGENTS.md — @karnameh/ui

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/ui.md](../../docs/packages/ui.md).

- **Client components keep `"use client";`** at the top (button, dropdown-menu,
  bottom-sheet, bottom-sheet-header). tsdown preserves it natively.
- **The barrel `src/index.ts` also starts with `"use client";`** — it re-exports
  client components, and tsdown only keeps a directive at the top of the entry's
  own source. Keep it there.
- **Icons live in [`@karnameh/icons`](../icons/AGENTS.md)**, not here. Don't add
  an `src/icons/` back to this package.
- All components import `cn` from `@karnameh/utils` (a `dependency`,
  `workspace:^`). Don't reimplement `cn`.
- Use the `radix-ui` **umbrella** package: `import { DropdownMenu } from "radix-ui"`,
  `import { Dialog } from "radix-ui"`, `import { Slot } from "radix-ui"`
  (`Slot.Root`). Don't add individual `@radix-ui/react-*` packages.
- `react` / `react-dom` are `peerDependencies`; tsdown externalizes them (and all
  deps, incl. `react/jsx-runtime`) automatically — no `external` list needed.
- Per-component subpaths: `./button`, `./dropdown-menu`, `./bottom-sheet`, plus
  the root barrel. Adding a component = new `tsdown` entry + new `exports`
  subpath + re-export from `src/index.ts`.
- Component bodies are scaffolds; replacing them with the real landing-repo
  sources must preserve the directives and the exports map.
