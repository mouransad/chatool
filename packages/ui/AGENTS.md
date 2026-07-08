# AGENTS.md — @chatool/ui

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/ui.md](../../docs/packages/ui.md).

- **Component structure (canonical spec:
  [docs/conventions/component-structure.md](../../docs/conventions/component-structure.md)).**
  Each component is its **own kebab-case directory** (grouped in a family dir like
  `src/buttons/`) whose `index.tsx` is both the public barrel and the `tsdown`
  entry:
  ```
  src/buttons/          # the button family directory
    button/
      index.tsx         # entry + barrel (no directive — button is server-safe)
      button.tsx        # one arrow component, default-exported (the view)
      button.types.ts   # ButtonProps + types
      button.variants.ts# buttonVariants (cva)
    config.ts           # shared family config (sizes, shape, class fragments)
    spinner.tsx         # shared loading spinner (pure)
    ripple.tsx          # "use client" press-ripple island (own INTERNAL entry)
  ```
  Components are **arrow functions, one per file, default-exported**; types and
  cva variants go in separate `*.types.ts` / `*.variants.ts`; non-trivial logic
  moves to a `useLogic` hook (skip when trivial — `button` has none). Files are
  kebab-case. Enforced by ESLint (`react/function-component-definition`,
  `react/no-multi-comp`, `unicorn/filename-case`) scoped to `packages/ui/src/**`.
- **Prefer Server Components; the `"use client";` directive is conditional** (see
  [Client vs Server Components](../../docs/conventions/client-server-components.md)).
  A **pure** component (props → JSX) has **no directive anywhere** in its directory.
  A **client** component (hooks/context/event-wiring/browser APIs/client-only
  _interactive_ `radix-ui` primitives) carries `"use client";` on **both** the view
  file **and** the `index.tsx` entry barrel — tsdown only preserves the directive at
  the top of the entry's own source (a re-export barrel doesn't inherit it; same
  rule as `packages/utils/src/hooks/index.ts`). **`button` is a Server Component**
  (no directive on its view or barrel): `radix-ui`'s `Slot` is server-safe and it
  only spreads consumer props. Its sole client piece is the press **ripple**, a
  `"use client"` island (`src/buttons/ripple.tsx`) given its **own internal `tsdown`
  entry** so the directive survives bundling (it is **not** a public subpath). Pure
  files (`*.types.ts`, `*.variants.ts`) never carry the directive.
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
- **Button family lives in `src/buttons/`.** Published subpaths: `./button`
  (source `src/buttons/button/`), `./icon-button` (source
  `src/buttons/icon-button/`, the icon-only square member — four styles
  standard/filled/tonal/outlined, the XS–XL square scale via
  `iconButtonSize`, round/square shape-morph, and an MD3 `selected` **toggle** that
  sets `aria-pressed` + morphs round→square + swaps `selectedIcon`), and
  `./button-group` (source `src/buttons/button-group/`, the MD3 **Expressive**
  invisible `role="group"` **container** for `Button`/`IconButton` children —
  `standard` (press-squish: pressed child expands + neighbors compress, CSS-only) /
  `connected` (tight 2dp cluster; children keep their own radius, selected child
  morphs via its own smooth round→square animation) variants, horizontal/vertical;
  a pure layout that owns no state, never overrides a child's border-radius, and
  doesn't compose the interactive `BASE`/`STATE_LAYER`/`FOCUS_RING`/`DISABLED`
  fragments). FAB and segmented are **deferred** (will be added under
  `src/buttons/` later). Each barrel exposes a `default` + named exports (e.g.
  `Button` + `buttonVariants`, `IconButton` + `iconButtonVariants`, `ButtonGroup` +
  `buttonGroupVariants`).
  Adding a component = new `src/buttons/<name>/` directory + a `tsdown` entry whose
  **key equals the subpath** (`{ button: "src/buttons/button/index.tsx" }` →
  `dist/button.*`, so the `exports` map stays stable) + the new `exports` subpath
  (ESM + CJS). A `"use client"` island used **internally** (e.g. `ripple`) gets its
  own `tsdown` entry **without** an `exports` subpath, so its directive is preserved
  as a private client chunk.
- **TextField family lives in `src/inputs/`.** Published subpaths: `./text-field`
  (source `src/inputs/text-field/`, the common Text Field component — supports `filled` and `outlined`
  variants, `s`/`xs` size scale, error state, floating labels, leading/trailing icons, character counter, and `asChild` wrapping
  for textareas). A pure Server Component utilizing CSS peer selectors for floating state management.
  Shared family config lives in `src/inputs/config.ts` (defining containerSize, base classes, and labels).
  Barrels expose `default` + named exports (e.g. `TextField` + `textFieldVariants` + `TextFieldProps`).
- **Shared family config lives in one file, `src/buttons/config.ts`** (the XS–XL
  size scale, the shape/press-morph corners, and the class fragments — base /
  state layer / focus ring / disabled), plus `src/buttons/spinner.tsx` (the loading
  spinner). tsdown inlines them per entry — they are **not** subpaths. Reuse them;
  don't duplicate the styling wiring. Parallel rules apply to `src/inputs/config.ts`.
- **Follow the MD3 spec; style with tokens, never raw hex.** Button **color is
  fixed per style** (no `color` prop) — each `variant` sets the painted role local
  vars (`--_bg` / `--_fg` / `--_state`) directly from the fixed `--md-sys-*` roles;
  painted roles read a `--md-comp-button-*` token with a `--md-sys-*` fallback so
  apps can re-theme. Canonical spec:
  [docs/conventions/material-design.md](../../docs/conventions/material-design.md).
- **Accessibility (WAI-ARIA APG button pattern).** Render a native `<button>`;
  default `type="button"` so forms don't submit by accident; names come from text
  content (an **icon-only** button **must** set `aria-label`); pass `aria-*` through
  (`aria-pressed` for toggles — keep the label constant; `aria-haspopup` /
  `aria-expanded` for menus); `loading` is non-actionable + `aria-busy`; for
  `asChild` require a natively interactive child. Canonical spec:
  [docs/conventions/accessibility.md](../../docs/conventions/accessibility.md).
- **Adding a component also needs a Storybook story** in
  [`apps/storybook`](../../apps/storybook) (stories don't auto-discover new
  subpaths) — run the `/sync-storybook` skill.
- Component bodies are scaffolds; replacing them with the real landing-repo
  sources must preserve the directives and the exports map.
