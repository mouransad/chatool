---
"@chatool/core": major
"@chatool/ui": major
"@chatool/utils": patch
---

Refactored the design system structure to migrate from Material Design 3 back to shadcn:
- Removed Material Design 3 buttons, icon-buttons, button-groups, ripples, and spinners from `@chatool/ui`.
- Removed Material Design 3 theme variables and replaced them with shadcn-compliant oklch colors and radius variables in `@chatool/core`.
- Initialized shadcn configuration in `packages/ui/components.json`.
- Simplified tailwind-merge configuration in `@chatool/utils`.
- Updated all internal apps (playground and storybook) and documentation to remove MD3 references.
