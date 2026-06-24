# @chatool/ui

Shadcn-based React UI components for Chatool apps. (SVG icons now live in
[`@chatool/icons`](../icons/README.md).)

- **Deps:** `@chatool/utils`, `@chatool/icons`, `radix-ui`,
  `class-variance-authority` · **Peers:** `react` ^19, `react-dom` ^19
- **Full docs:** [docs/packages/ui.md](../../docs/packages/ui.md)
- **Monorepo:** [chatool README](../../README.md)

> Apps using `@chatool/ui` **must also install `@chatool/styles`** and import
> its CSS — the components are styled with the shared design tokens.

## Install

```bash
pnpm add @chatool/ui @chatool/styles
```

## Usage

```tsx
import { Button } from "@chatool/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@chatool/ui/dropdown-menu";
import { BottomSheet, BottomSheetContent, BottomSheetHeader } from "@chatool/ui/bottom-sheet";
import { ChatoolLogoIcon } from "@chatool/icons";
// or the barrel: import { Button } from "@chatool/ui";
```

See the [full docs](../../docs/packages/ui.md) for the complete export list.
