# @chatool/utils

## 0.1.2

### Patch Changes

- 868cc00: Refactored the design system structure to migrate from Material Design 3 back to shadcn:
  - Removed Material Design 3 buttons, icon-buttons, button-groups, ripples, and spinners from `@chatool/ui`.
  - Removed Material Design 3 theme variables and replaced them with shadcn-compliant oklch colors and radius variables in `@chatool/core`.
  - Initialized shadcn configuration in `packages/ui/components.json`.
  - Simplified tailwind-merge configuration in `@chatool/utils`.
  - Updated all internal apps (playground and storybook) and documentation to remove MD3 references.

## 0.1.1

### Patch Changes

- e6e5f13: Teach `cn`'s `tailwind-merge` that the Material Design 3 typescale (`text-label-large`,
  `text-title-medium`, …) are **font sizes**. Previously tailwind-merge mistook those
  custom `text-*` names for text _colors_ and silently dropped a real color utility
  placed next to one — e.g. `cn("text-label-large", "text-[color:var(--fg)]")` lost the
  color, so token-colored text/icons fell back to the inherited color. The typescale and
  a token color now coexist and still override correctly.

## 0.1.0

### Minor Changes

- Ship complete docs inside each package tarball so they're available in consumers'
  `node_modules` for AI tools and humans.

  Each package now bundles a **complete, self-contained `README.md`** (the canonical
  per-package reference) and a generated **`llms.txt`** (an llmstxt.org-style entry
  point listing install, exports, and usage rules). Stale/incorrect import examples
  (e.g. `@chatool/ui` / `@chatool/icons` root-barrel imports) were corrected.
