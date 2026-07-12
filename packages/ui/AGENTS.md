# AGENTS.md — @chatool/ui

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/ui.md](../../docs/packages/ui.md).

- **Component structure (canonical spec: [docs/conventions/component-structure.md](../../docs/conventions/component-structure.md)).**
  Each component is its **own kebab-case directory** under `src/` (e.g. `src/button/`) whose `index.tsx` is both the public barrel and the `tsdown` entry:
  ```
  src/
    button/
      index.tsx         # entry + barrel
      button.tsx        # one arrow component, default-exported (the view)
      button.types.ts   # ButtonProps + types
      button.variants.ts# buttonVariants (cva)
  ```
  Components are **arrow functions, one per file, default-exported**; types and cva variants go in separate `*.types.ts` / `*.variants.ts`; non-trivial logic moves to a `useLogic` hook (skip when trivial). Files are kebab-case. Enforced by ESLint scoped to `packages/ui/src/**`.
- **Prefer Server Components; the `"use client";` directive is conditional** (see [Client vs Server Components](../../docs/conventions/client-server-components.md)).
  A **pure** component (props → JSX) has **no directive anywhere** in its directory.
  A **client** component (hooks/context/event-wiring/browser APIs/client-only interactive `radix-ui` primitives) carries `"use client";` on **both** the view file **and** the `index.tsx` entry barrel — tsdown only preserves the directive at the top of the entry's own source (a re-export barrel doesn't inherit it). Pure files (`*.types.ts`, `*.variants.ts`) never carry the directive.
- **No root barrel / no `.` export.** There is no `src/index.ts`; each component is reachable only through its own subpath so the IDE auto-imports the subpath (e.g. `import Button from "@chatool/ui/button"`) instead of a root `@chatool/ui` barrel. Don't re-add `src/index.ts` or a `.` export.
- **Icons live in [`@chatool/icons`](../icons/AGENTS.md)**, not here. Don't add an `src/icons/` back to this package.
- All components import `cn` from `@chatool/utils` (a `dependency`, `workspace:^`). Don't reimplement `cn`.
- Use the `radix-ui` **umbrella** package: `import { Slot } from "radix-ui"` (`Slot.Root`), `import { Dialog } from "radix-ui"`, etc. Don't add individual `@radix-ui/react-*` packages.
- `react` / `react-dom` are `peerDependencies`; tsdown externalizes them (and all deps, incl. `react/jsx-runtime`) automatically — no `external` list needed.
- **Adding a component** = new `src/<component>/` directory + a `tsdown` entry whose **key equals the subpath** (`{ button: "src/button/index.tsx" }` → `dist/button.*`, so the `exports` map stays stable) + the new `exports` subpath (ESM + CJS).
- **Style with shadcn tokens.** Style using standard Tailwind CSS classes (e.g. `bg-primary`, `text-primary-foreground`, `border-border`, `rounded-md`). Do not hardcode hex codes or use raw colors.
- **Accessibility (WAI-ARIA APG pattern).** Render native elements where possible; default `type="button"` on buttons; names come from text content (icon-only must set `aria-label`).
- **Storybook & Playground.** Adding a component also needs a Storybook story in `apps/storybook` and a demo section in `apps/playground`.
