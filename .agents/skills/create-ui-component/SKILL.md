---
name: create-ui-component
description: Scaffold a new shadcn-compatible component in @chatool/ui — shadcn tokens, WAI-ARIA APG, Server-Component-by-default, full Storybook + playground coverage, and the complete exports/tsdown/dev-alias/docs/changeset sync chain. Use when adding any new @chatool/ui component. UI package only.
---

# create-ui-component

Build a **new `@chatool/ui` component** to the exact standard defined by our shadcn design system.

Non-negotiables this skill guarantees:

1. **shadcn spec** — style with **shadcn CSS custom properties** (e.g. `bg-primary`, `text-foreground`, `rounded-md`, `border-border`), never raw hex.
2. **WAI-ARIA APG** (<https://www.w3.org/WAI/ARIA/apg/patterns/>) — native semantic HTML first; the right roles/states/keyboard behavior.
3. **Server Component by default** — `"use client"` only where a boundary genuinely needs it.
4. **Best-in-class DX** — subpath auto-import, typed `variants`, `asChild` (via Slot), `className` merge, exported `*Variants`, full prop pass-through.
5. **Complete Storybook story + playground demo** covering every variant / size / state / disabled / loading / a11y example.
6. **Works in every framework** — Next App Router (RSC), Pages Router, Vite SPA, webpack.
7. **Fully customizable by consumers** — standard CSS variables (`--primary`, `--background`, `--radius`) overridden in `:root` or `.dark`.
8. **Exact code conventions** — the component-structure / directive / exports rules.
9. **Docs synced** via the repo's own skills (`/sync-storybook`, `/sync-docs`).

> **`@chatool/ui` only.** This skill scaffolds UI components. It does **not** apply to `@chatool/utils`, `@chatool/icons` (SVGR-generated), or `@chatool/core`. If asked for one of those, stop and say so.

The component name is the skill argument (kebab-case): `/create-ui-component button`. Work from the **repo root**.

## 1. Research the APG pattern (live)

Before writing anything, look up the real, current guidance — don't go from memory:

- **APG:** WebFetch the matching pattern under <https://www.w3.org/WAI/ARIA/apg/patterns/> (button, checkbox, switch, combobox, slider, tabs, dialog, menu …). Capture the **role**, **states/properties**, and the **keyboard interaction** it must implement.

Re-read the repo's own rules so the spec lands in-house:
[shadcn.md](../../../docs/conventions/shadcn.md),
[accessibility.md](../../../docs/conventions/accessibility.md),
[component-structure.md](../../../docs/conventions/component-structure.md),
[client-server-components.md](../../../docs/conventions/client-server-components.md).
The guiding a11y rule: **prefer native semantic HTML; reach for ARIA only to fill a gap — "no ARIA is better than bad ARIA."**

## 2. Propose the spec, then **confirm with the user**

Write up the design and **stop for explicit approval before scaffolding**:

- **Native element + APG pattern** (e.g. `<button>` / `<input>` / `<div role>`), plus the keyboard interaction and roles/states you'll implement.
- **`cva` variants** — the `variant` / `size` / `shape` / … axes and their values, with `defaultVariants`.
- **Custom props** beyond the native element (e.g. `asChild`), each with a one-line JSDoc.
- **Server vs client verdict** and whether it needs the `"use client";` directive.

Present it, ask the user to confirm or adjust, and only then continue.

## 3. Pick the subpath

Every component is its **own kebab-case directory** under `src/` (e.g. `src/button/`):

The **published subpath = the tsdown entry key = `dist/<key>.*`**, independent of the nested source path: `{ button: "src/button/index.tsx" }` → `@chatool/ui/button`. Keep the key equal to the subpath.

## 4. Decide the `"use client"` boundary

Per [client-server-components.md](../../../docs/conventions/client-server-components.md), add `"use client";` **only** when the module needs: React **hooks** (incl. any custom `useLogic`), **context**, **its own event-handler wiring** (defining `onClick`/`onChange` inside — spreading consumer `{...props}` does **not** count), **browser/DOM APIs**, a **class component**, or an **interactive client-only dep**.

**Prefer Server.** If the component is pure, do not add the directive:

- **Server component:** **no directive anywhere** in the directory.
- **Client component:** `"use client";` at the top of **both** the view file **and** the `index.tsx` barrel — tsdown only preserves the directive on the **entry's own source**; a re-export barrel does **not** inherit it.

## 5. Scaffold the component files

Create `packages/ui/src/<component>/`. Components are **arrow functions, one per file, default-exported**; kebab-case filenames; ESLint enforces this for `packages/ui/src/**`.

- **`<component>.types.ts`** (no directive):

  ```tsx
  import type * as React from "react";
  import { type VariantProps } from "class-variance-authority";

  import { type <component>Variants } from "./<component>.variants";

  export interface <Component>Props
    extends React.ComponentProps<"<el>">, VariantProps<typeof <component>Variants> {
    /** Doc every custom prop with a one-line JSDoc. */
    asChild?: boolean;
  }
  ```

  Extend the native element's props **and** `VariantProps`. The types file may depend on the variants file, **never the reverse** (avoid a cycle).

- **`<component>.variants.ts`** (no directive):
  `cva` using shadcn CSS variable utilities: e.g. `bg-primary text-primary-foreground border-border rounded-md`. Style with **token utilities only, never hex**. Provide `defaultVariants`.

- **`<component>.tsx`**: the single default-exported arrow view. Pick the native element (or `Slot` when `asChild`); implement the APG roles/states/keyboard behavior; set sane a11y defaults; convey disabled/busy states; spread `{...props}` so consumer `aria-*` pass through; compose classes with `cn(<component>Variants({ ... }), className)`.

- **`index.tsx`**: the barrel + tsdown entry:

  ```tsx
  export { default, default as <Component> } from "./<component>";
  export { <component>Variants } from "./<component>.variants";
  export type { <Component>Props } from "./<component>.types";
  ```

  (Add `"use client";` as the first line here **and** in the view **only** if the component is a client component.)

- **`use-logic.ts`** — **only if** the logic is non-trivial. When present: `"use client";` first line, a camelCase `useLogic` export; the view stays presentational.

## 6. Wire the package surface (keep all four in sync)

A new subpath touches four files — update them together:

- **`packages/ui/package.json`** `exports` — add the subpath, ESM + CJS:

  ```json
  "./<component>": {
    "import": { "types": "./dist/<component>.d.mts", "default": "./dist/<component>.mjs" },
    "require": { "types": "./dist/<component>.d.cts", "default": "./dist/<component>.cjs" }
  }
  ```

- **`packages/ui/tsdown.config.ts`** — add `"<component>": "src/<component>/index.tsx"` (key = subpath).

- **`dev-aliases.mjs`** `sourceAliases` — add `"@chatool/ui/<component>": pkg("ui", "src", "<component>", "index.tsx")`.

- **`apps/playground/tsconfig.json`** `paths` — add `"@chatool/ui/<component>": ["../../packages/ui/src/<component>/index.tsx"]`.

## 7. Storybook story (complete coverage)

Add `apps/storybook/stories/<Component>.stories.tsx`: `satisfies Meta<typeof C>`, `tags: ["autodocs"]`, and `argTypes` controls for **every** cva variant. Export one story per meaningful facet — **Playground** (all controls), **every variant**, **Sizes**, **Disabled**, and **`asChild`**.

## 8. Playground demo (Next App Router)

Add a section to `apps/playground/app/page.tsx` demonstrating every variant / size / state / disabled. The page is a **Server Component**; if a demo needs client interactivity, put it in a `"use client"` island under `app/components/` and render it on the page.

## 9. Docs + changeset (no-drift chain)

- **`packages/ui/README.md`**: add the subpath to the **Exports** table, a **props** table, and a **For AI agents** bullet.
- **`pnpm gen:llms`** — regenerate `llms.txt` from the README's `## For AI agents` section + `package.json`. **Never hand-edit `llms.txt`.**
- **`packages/ui/AGENTS.md`** — list the new component + its subpath.
- **`pnpm changeset`** — add a changeset for the minor bump of `@chatool/ui`.

## 10. Run the sync skills + verify

Reconcile any remaining drift and prove it builds:

- Run [`/sync-storybook`](../sync-storybook/SKILL.md) — every `@chatool/ui` subpath is storied.
- Run [`/sync-docs`](../sync-docs/SKILL.md) — exports ↔ tsdown ↔ README agree, llms.txt regenerated, changeset present + accurate. (Or run the umbrella [`/sync`](../sync/SKILL.md), which does both + the verify.)

```bash
pnpm build && pnpm typecheck && pnpm lint
```
