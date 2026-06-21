# @karnameh/ui

Shadcn-based React UI components for Karnameh apps. (SVG icons now live in
[`@karnameh/icons`](../icons/README.md).)

- **Deps:** `@karnameh/utils`, `@karnameh/icons`, `radix-ui`,
  `class-variance-authority` · **Peers:** `react` ^19, `react-dom` ^19
- **Full docs:** [docs/packages/ui.md](../../docs/packages/ui.md)
- **Monorepo:** [karnameh-kit README](../../README.md)

> Apps using `@karnameh/ui` **must also install `@karnameh/styles`** and import
> its CSS — the components are styled with the shared design tokens.

## Install

```bash
pnpm add @karnameh/ui @karnameh/styles
```

## Usage

```tsx
import { Button } from "@karnameh/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@karnameh/ui/dropdown-menu";
import { BottomSheet, BottomSheetContent, BottomSheetHeader } from "@karnameh/ui/bottom-sheet";
import { KarnamehLogoIcon } from "@karnameh/icons";
// or the barrel: import { Button } from "@karnameh/ui";
```

See the [full docs](../../docs/packages/ui.md) for the complete export list.
