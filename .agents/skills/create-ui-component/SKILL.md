---
name: create-ui-component
description: Scaffold a new Material Design 3 component in @chatool/ui the way `button` was built — MD3 tokens, WAI-ARIA APG, Server-Component-by-default, full Storybook + playground coverage, and the complete exports/tsdown/dev-alias/docs/changeset sync chain. Use when adding any new @chatool/ui component (e.g. /create-ui-component icon-button). UI package only.
---

# create-ui-component

Build a **new `@chatool/ui` component** to the exact standard the **`button`** was
built to. The button family
([`packages/ui/src/buttons/button/`](../../../packages/ui/src/buttons/button/)) is
the **canonical worked example** — open it and copy its conventions for every
decision below. This skill is the executable form of the "add a component" flow in
[`packages/ui/AGENTS.md`](../../../packages/ui/AGENTS.md) +
[`docs/conventions/`](../../../docs/conventions/).

Non-negotiables this skill guarantees, matching the button:

1. **MD3 spec** (<https://m3.material.io>) — anatomy, variants, sizes, states,
   tokens. Style with **token utilities, never raw hex**.
2. **WAI-ARIA APG** (<https://www.w3.org/WAI/ARIA/apg/patterns/>) — native
   semantic HTML first; the right roles/states/keyboard behavior.
3. **Server Component by default** — `"use client"` only where a boundary genuinely
   needs it; push interactivity into a small island (the `ripple` pattern).
4. **Best-in-class DX** — subpath auto-import, typed `variants`, `asChild`,
   `className` merge, exported `*Variants`, full prop pass-through.
5. **Complete Storybook story + playground demo** covering every variant / size /
   state / disabled / loading / a11y example.
6. **Works in every framework** — Next App Router (RSC), Pages Router, Vite SPA,
   webpack — which the Server-default + directive discipline is what buys.
7. **Fully customizable by consumers** — global `--md-sys-*`, per-component
   `--md-comp-<component>-*`, and `className`.
8. **Exact code conventions** — the component-structure / directive / exports rules.
9. **Docs synced** via the repo's own skills (`/sync-storybook`, `/sync-docs`).

> **`@chatool/ui` only.** This skill scaffolds UI components. It does **not** apply
> to `@chatool/utils`, `@chatool/icons` (SVGR-generated), or `@chatool/core`. If
> asked for one of those, stop and say so.

The component name is the skill argument (kebab-case): `/create-ui-component
icon-button`, `/create-ui-component textfield`. Work from the **repo root**.

## 1. Research the MD3 spec + APG pattern (live)

Before writing anything, look up the real, current guidance — don't go from memory:

- **MD3:** WebSearch / WebFetch `m3.material.io` for the component (e.g.
  "Material 3 text fields", "Material 3 icon button"). Capture its **anatomy**,
  **variants** (e.g. filled / outlined), **sizes**, **states**
  (enabled/hover/focus/pressed/disabled/error), and the **color/shape/typescale
  roles** it uses.
- **APG:** WebFetch the matching pattern under
  <https://www.w3.org/WAI/ARIA/apg/patterns/> (button, checkbox, switch, combobox,
  slider, tabs, dialog, menu …). Capture the **role**, **states/properties**, and
  the **keyboard interaction** it must implement.

Re-read the repo's own rules so the spec lands in-house:
[material-design.md](../../../docs/conventions/material-design.md),
[accessibility.md](../../../docs/conventions/accessibility.md),
[component-structure.md](../../../docs/conventions/component-structure.md),
[client-server-components.md](../../../docs/conventions/client-server-components.md).
The guiding a11y rule: **prefer native semantic HTML; reach for ARIA only to fill
a gap — "no ARIA is better than bad ARIA."**

## 2. Propose the spec, then **confirm with the user**

Write up the design and **stop for explicit approval before scaffolding**:

- **Native element + APG pattern** (e.g. `<button>` / `<input>` / `<div role>`),
  plus the keyboard interaction and roles/states you'll implement.
- **`cva` variants** — the `variant` / `size` / `shape` / … axes and their values,
  with `defaultVariants` (button: `variant:"filled"`, `size:"s"`, `shape:"round"`).
- **Custom props** beyond the native element (e.g. `startIcon`, `loading`,
  `asChild`), each with a one-line JSDoc.
- **Customization surface** — the `--md-comp-<component>-<role>` tokens you'll
  expose (button has `container-color`, `label-text-color`, `outline-color`,
  `focus-color`).
- **Server vs client verdict** (run the §4 decision tree) and whether it needs an
  internal client island.

Present it, ask the user to confirm or adjust, and only then continue. Use
`AskUserQuestion` if a real choice is open (e.g. which variants to ship first).

## 3. Pick the family directory + the subpath

Every component is its **own kebab-case directory** grouped under a **family
directory** (the button lives in `src/buttons/button/`):

- **Belongs to an existing family** (icon-button, FAB, toggle/segmented →
  `src/buttons/`)? Reuse that family dir and its
  [`config.ts`](../../../packages/ui/src/buttons/config.ts) (the `BASE`,
  `STATE_LAYER`, `FOCUS_RING`, `DISABLED` fragments + size scale + corners) —
  **don't duplicate** the styling wiring.
- **New family** (e.g. `card` → `src/cards/`)? Create the family dir and
  give it its own `config.ts` modeled on the buttons one (shared sizes / state
  layer / focus ring / disabled), so future siblings reuse it.

The **published subpath = the tsdown entry key = `dist/<key>.*`**, independent of
the nested source path: `{ button: "src/buttons/button/index.tsx" }` →
`@chatool/ui/button`. Keep the key equal to the subpath.

## 4. Decide the `"use client"` boundary

Per [client-server-components.md](../../../docs/conventions/client-server-components.md),
add `"use client";` **only** when the module needs: React **hooks** (incl. any
custom `useLogic`), **context**, **its own event-handler wiring** (defining
`onClick`/`onChange` inside — spreading consumer `{...props}` does **not** count),
**browser/DOM APIs**, a **class component**, or an **interactive client-only dep**.
`radix-ui`'s `Slot`/`Slottable` are **server-safe** — `asChild` alone does not
force the directive.

**Prefer Server.** If the only interactive piece is a visual affordance, isolate it
in a small `"use client"` island rendered as a child (the
[`ripple`](../../../packages/ui/src/buttons/ripple.tsx) pattern) so the component
stays directive-free and RSC-renderable. Then:

- **Server component:** **no directive anywhere** in the directory (button is this).
- **Client component:** `"use client";` at the top of **both** the view file
  **and** the `index.tsx` barrel — tsdown only preserves the directive on the
  **entry's own source**; a re-export barrel does **not** inherit it.
- **Internal client island:** its own file **and** its own `tsdown` entry with
  **no** `exports` subpath (like `ripple`), so the directive survives as a private
  client chunk. Pure files (`*.types.ts`, `*.variants.ts`) **never** carry it.

## 5. Scaffold the component files

Create `packages/ui/src/<family>/<component>/`, copying the button's four-file
shape. Components are **arrow functions, one per file, default-exported**;
kebab-case filenames; ESLint enforces this for `packages/ui/src/**`
(`react/function-component-definition`, `react/no-multi-comp`,
`unicorn/filename-case`).

- **`<component>.types.ts`** (no directive) — mirror
  [button.types.ts](../../../packages/ui/src/buttons/button/button.types.ts):

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

  Extend the native element's props **and** `VariantProps`. The types file may
  depend on the variants file, **never the reverse** (avoid a cycle).

- **`<component>.variants.ts`** (no directive) — mirror
  [button.variants.ts](../../../packages/ui/src/buttons/button/button.variants.ts):
  `cva` whose base string composes the family `BASE / STATE_LAYER / FOCUS_RING /
DISABLED` fragments. Painted roles read the **component token first** with a
  local/`--md-sys-*` fallback —
  `bg-[var(--md-comp-<component>-container-color,var(--_bg))]`,
  `text-[color:var(--md-comp-<component>-label-text-color,var(--_fg))]` — and each
  `variant` sets the `--_*` locals from **fixed `--md-sys-*` roles**. **Token
  utilities only, never hex**; arbitrary colors carry the explicit `color:` hint
  (`text-[color:…]`, `ring-[color:…]`) so `cn`/tailwind-merge keeps them. Provide
  `defaultVariants`.

- **`<component>.tsx`** — the single default-exported arrow view. Mirror
  [button.tsx](../../../packages/ui/src/buttons/button/button.tsx): pick the native
  element (or `Slot.Root` when `asChild`); implement the APG roles/states/keyboard
  behavior; set sane a11y defaults (button defaults `type="button"` so forms don't
  submit by accident); convey disabled/busy (`disabled` / `aria-disabled` /
  `aria-busy`) and keep them non-actionable; spread `{...props}` **after** your
  attributes so consumer `aria-*` (`aria-label`, `aria-pressed`, `aria-haspopup`,
  `aria-expanded`, …) pass through; compose classes with
  `cn(<component>Variants({ ... }), className)`; render any client island as a
  child.

- **`index.tsx`** — the barrel + tsdown entry. Mirror
  [button/index.tsx](../../../packages/ui/src/buttons/button/index.tsx):

  ```tsx
  export { default, default as <Component> } from "./<component>";
  export { <component>Variants } from "./<component>.variants";
  export type { <Component>Props } from "./<component>.types";
  ```

  (Add `"use client";` as the first line here **and** in the view **only** if §4
  said the component itself is a client component.)

- **`use-logic.ts`** — **only if** the logic is non-trivial (button has none, so it
  ships none). When present: `"use client";` first line, a camelCase `useLogic`
  export; the view stays presentational. A component that **calls** `useLogic` is
  necessarily a client component.

## 6. Wire the package surface (keep all four in sync)

A new subpath touches four files — update them together (the
[sync map](../../../AGENTS.md) couples them):

- **`packages/ui/package.json`** `exports` — add the subpath, ESM + CJS. **Never** a
  `.` root export (the package is subpath-only):

  ```json
  "./<component>": {
    "import": { "types": "./dist/<component>.d.mts", "default": "./dist/<component>.mjs" },
    "require": { "types": "./dist/<component>.d.cts", "default": "./dist/<component>.cjs" }
  }
  ```

- **`packages/ui/tsdown.config.ts`** — add `"<component>":
"src/<family>/<component>/index.tsx"` (key = subpath). Add a **separate** entry
  (no `exports` subpath) for any internal client island.

- **`dev-aliases.mjs`** `sourceAliases` — add
  `"@chatool/ui/<component>": pkg("ui", "src", "<family>", "<component>", "index.tsx")`
  so Storybook (Vite) hot-reloads from source.

- **`apps/playground/tsconfig.json`** `paths` — add the matching
  `"@chatool/ui/<component>": ["../../packages/ui/src/<family>/<component>/index.tsx"]`
  so the playground (Turbopack) hot-reloads from source.

## 7. Storybook story (complete coverage)

Add `apps/storybook/stories/<Component>.stories.tsx`, following
[Button.stories.tsx](../../../apps/storybook/stories/Button.stories.tsx):
`satisfies Meta<typeof C>`, `tags: ["autodocs"]`, and `argTypes` controls for
**every** cva variant (`control: "select" | "inline-radio" | "boolean"`). Export
one story per meaningful facet — **Playground** (all controls), **every variant**,
**Sizes**, **Shapes** (if any), **Disabled**, **Loading** (if any), an
**accessibility example** (e.g. icon-only with `aria-label`), and **`asChild`** —
composing multiple instances in a `render`. Import from the subpath
(`import <Component> from "@chatool/ui/<component>"`).

## 8. Playground demo (Next App Router)

Add a section to
[`apps/playground/app/page.tsx`](../../../apps/playground/app/page.tsx) using its
`<Section title hint>` helper, demonstrating every variant / size / state /
disabled / loading — mirroring the button sections. The page is a **Server
Component**: if a demo needs interactivity (state/handlers), put it in a
`"use client"` island under `app/components/` like
[`form-demo.tsx`](../../../apps/playground/app/components/form-demo.tsx) and render
it in a section. This proves the component renders server-side and works in the
real App Router.

## 9. Docs + changeset (no-drift chain)

- **`packages/ui/README.md`** (canonical, self-contained — no `../../docs` links):
  add the subpath to the **Exports** table, a **props** table, a **Customization**
  note listing the `--md-comp-<component>-*` tokens, an **Accessibility &
  rendering** subsection (APG guarantees + consumer responsibilities + the
  server/client story), and a **For AI agents** bullet.
- **`pnpm gen:llms`** — regenerate `llms.txt` from the README's `## For AI agents`
  section + `package.json`. **Never hand-edit `llms.txt`.**
- **`packages/ui/AGENTS.md`** — extend the family section (or add a new family
  block) to list the new component + its subpath.
- **`pnpm changeset`** — a new public component is a **minor** bump of
  `@chatool/ui`; summarize what shipped.

## 10. Run the sync skills + verify

Reconcile any remaining drift and prove it builds:

- Run [`/sync-storybook`](../sync-storybook/SKILL.md) — every `@chatool/ui` subpath
  is storied.
- Run [`/sync-docs`](../sync-docs/SKILL.md) — exports ↔ tsdown ↔ README agree,
  llms.txt regenerated, changeset present + accurate. (Or run the umbrella
  [`/sync`](../sync/SKILL.md), which does both + the verify.)

```bash
pnpm build && pnpm typecheck && pnpm lint
pnpm build-storybook   # the UI surface changed
```

Report what was created/updated (component files, the four surface files, story,
playground section, README/llms/AGENTS, changeset) and that build/typecheck/lint +
Storybook are green.

---

Related skills: [`sync-storybook`](../sync-storybook/SKILL.md) ·
[`sync-docs`](../sync-docs/SKILL.md) · [`sync`](../sync/SKILL.md)
