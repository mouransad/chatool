# @chatool/ui

**shadcn-based** React UI components for Chatool apps. Every component imports `cn` from `@chatool/utils` and is styled with design tokens from `@chatool/core` (shadcn custom properties mapped to Tailwind CSS v4 variables).

- **Dependencies:** `@chatool/utils`, `radix-ui`, `class-variance-authority`
- **Peers:** `react` ^19, `react-dom` ^19

> Apps using `@chatool/ui` **must also install `@chatool/core`** and import its CSS. SVG icons live in their own package, `@chatool/icons`.

## Install

```bash
pnpm add @chatool/ui @chatool/core @chatool/icons
```

Import global styles in your main CSS file:

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";
@source "../node_modules/@chatool/ui/dist";
```

## Initialization (shadcn)

The package contains `components.json` for shadcn UI command integration. Components live inside `packages/ui/src/`.

### components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../core/styles.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "src",
    "utils": "@chatool/utils",
    "ui": "src"
  }
}
```

## Best Practices & Guidelines for Adding Components

When creating a new component:

1. **One component per directory**: Each component lives in its own kebab-case directory under `packages/ui/src/` (e.g. `button/`).
2. **Kebab-case file structure**:
   - `button.tsx`: Default export arrow function (view).
   - `button.types.ts`: Props and TS types.
   - `button.variants.ts`: `cva` styling variants.
   - `index.tsx`: Re-exports target exports and types.
3. **Barrels and Subpaths**: We avoid a root package barrel. Each component is imported via its explicit subpath (e.g. `import Button from "@chatool/ui/button"`). Add the new subpath entry to `package.json` `exports` map and `tsdown.config.ts`.
4. **Tailwind-based styling**: Standardize styling on CSS variables (e.g. `bg-primary`, `border-border`, `rounded-md`, `text-foreground`). Use `cn` from `@chatool/utils` for merging conditional class names.
5. **Radix Primitives**: Use `radix-ui` (the umbrella package) for accessible interactive primitives (e.g., `import { Slot } from "radix-ui"`).
6. **Conditional "use client"**: Server Components by default. Add the directive to the view file and entry index file only when state, hooks, or event handlers are required.

## Exports

| Subpath                   | Exports   |
| ------------------------- | --------- |
| `@chatool/ui/placeholder` | `VERSION` |

## For AI agents

- **No root barrel**: Components are imported via explicit subpaths (e.g., `@chatool/ui/button`).
- **Server Components by default**: Only add `"use client"` when component logic requires interactivity.
- **radix-ui**: Use the umbrella `radix-ui` package, not individual packages.
- **cn utility**: Always import `cn` from `@chatool/utils`.
