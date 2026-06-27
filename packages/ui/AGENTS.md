# AGENTS.md — @chatool/ui

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/ui.md](../../docs/packages/ui.md).

- **Component structure (canonical spec:
  [docs/conventions/component-structure.md](../../docs/conventions/component-structure.md)).**
  Each component is its **own kebab-case directory** under `src/` whose
  `index.tsx` is both the public barrel and the `tsdown` entry:
  ```
  src/button/
    index.tsx           # entry + barrel ("use client"; iff client component)
    button.tsx          # one arrow component, default-exported (the view)
    button.types.ts     # ButtonProps + types
    button.variants.ts  # buttonVariants (cva)
    use-logic.ts        # useLogic hook — only when logic is non-trivial
  ```
  Components are **arrow functions, one per file, default-exported**; types and
  cva variants go in separate `*.types.ts` / `*.variants.ts`; non-trivial logic
  moves to a `useLogic` hook (skip when trivial — `button` has none). Files are
  kebab-case. Enforced by ESLint (`react/function-component-definition`,
  `react/no-multi-comp`, `unicorn/filename-case`) scoped to `packages/ui/src/**`.
- **Prefer Server Components; the `"use client";` directive is conditional** (see
  [Client vs Server Components](../../docs/conventions/client-server-components.md)).
  A **pure** component (props → JSX) has **no directive anywhere** in its directory.
  A **client** component (hooks/context/event-wiring/browser APIs/client-only deps
  like `radix-ui`) carries `"use client";` on **both** the view file **and** the
  `index.tsx` entry barrel — tsdown only preserves the directive at the top of the
  entry's own source (a re-export barrel doesn't inherit it; same rule as
  `packages/utils/src/hooks/index.ts`). `button` is a client component (Radix
  `Slot` + forwards handlers), so both carry it. Pure files (`*.types.ts`,
  `*.variants.ts`) never do.
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
- Per-component subpaths only (currently just `./button`). The barrel exposes
  both a `default` and named exports (e.g. `Button` + `buttonVariants`). Adding a
  component = new `src/<name>/` directory + a `tsdown` entry whose **key equals
  the subpath** (`{ button: "src/button/index.tsx" }` → `dist/button.*`, so the
  `exports` map stays stable) + the new `exports` subpath (ESM + CJS).
- **Adding a component also needs a Storybook story** in
  [`apps/storybook`](../../apps/storybook) (stories don't auto-discover new
  subpaths) — run the `/sync-storybook` skill.
- Component bodies are scaffolds; replacing them with the real landing-repo
  sources must preserve the directives and the exports map.
