# AGENTS.md — @chatool/ui

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/ui.md](../../docs/packages/ui.md).

- **Client components keep `"use client";`** at the top (currently just button).
  tsdown preserves it natively.
- **No root barrel / no `.` export.** There is no `src/index.ts`; each component
  is reachable only through its own subpath so the IDE auto-imports the subpath
  (e.g. `import Button from "@chatool/ui/button"`) instead of a root
  `@chatool/ui` barrel. Don't re-add `src/index.ts` or a `.` export.
- **Icons live in [`@chatool/icons`](../icons/AGENTS.md)**, not here. Don't add
  an `src/icons/` back to this package.
- All components import `cn` from `@chatool/utils` (a `dependency`,
  `workspace:^`). Don't reimplement `cn`.
- Use the `radix-ui` **umbrella** package: `import { Slot } from "radix-ui"`
  (`Slot.Root`), `import { Dialog } from "radix-ui"`, etc. Don't add individual
  `@radix-ui/react-*` packages.
- `react` / `react-dom` are `peerDependencies`; tsdown externalizes them (and all
  deps, incl. `react/jsx-runtime`) automatically — no `external` list needed.
- Per-component subpaths only (currently just `./button`). Each entry source
  carries its own `"use client";`, and components expose both a `default` and
  named exports (e.g. `Button` + `buttonVariants`). Adding a component = new
  `tsdown` entry + new `exports` subpath (ESM + CJS). No barrel to update.
- **Adding a component also needs a Storybook story** in
  [`apps/storybook`](../../apps/storybook) (stories don't auto-discover new
  subpaths) — run the `/sync-storybook` skill.
- Component bodies are scaffolds; replacing them with the real landing-repo
  sources must preserve the directives and the exports map.
