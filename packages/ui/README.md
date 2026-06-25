# @chatool/ui

Shadcn-based React UI components for Chatool apps. Every component imports `cn`
from `@chatool/utils` and is styled with the design tokens from `@chatool/styles`.

- **Dependencies:** `@chatool/utils`, `@chatool/icons`, `radix-ui`,
  `class-variance-authority`
- **Peers:** `react` ^19, `react-dom` ^19

> Apps using `@chatool/ui` **must also install `@chatool/styles`** and import its
> CSS — without the tokens the components are unstyled. SVG icons live in their own
> package, `@chatool/icons`.

## Install

```bash
pnpm add @chatool/ui @chatool/styles @chatool/icons
# react ^19 and react-dom ^19 are peers
```

Then import the styles once in your global CSS (see `@chatool/styles`):

```css
@import "tailwindcss";
@import "@chatool/styles/styles.css";
@source "../node_modules/@chatool/ui/dist";
```

## Exports

**Subpath-only — there is no `@chatool/ui` root barrel.** Each component is
reached through its own path, so editors auto-import the exact subpath and bundles
stay minimal. All components are client components (`"use client"`).

| Subpath | Exports |
| --- | --- |
| `@chatool/ui/button` | `Button` (also `default`), `buttonVariants` |
| `@chatool/ui/dropdown-menu` | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub`, … |
| `@chatool/ui/bottom-sheet` | `BottomSheet`, `BottomSheetContent`, `BottomSheetTrigger`, `BottomSheetHeader`, … |

## Usage

```tsx
import Button from "@chatool/ui/button"; // default export
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@chatool/ui/dropdown-menu";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@chatool/ui/bottom-sheet";

// Icons come from @chatool/icons, one subpath per icon:
import ChevronDownIcon from "@chatool/icons/ChevronDownIcon";

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Open <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

`bottom-sheet` is built on `radix-ui`'s Dialog and includes `BottomSheetHeader`.

> The component bodies shipped today are reasonable shadcn-style scaffolds — fork
> and replace them with your own; the exports map and directives are in place.

## For AI agents

- **Import per component subpath** (`@chatool/ui/button`, `@chatool/ui/dropdown-menu`,
  `@chatool/ui/bottom-sheet`). There is **no `@chatool/ui` root barrel** — do not
  write `import { Button } from "@chatool/ui"`.
- `Button` is available as both the **default** export and a named export; the
  other components are named exports.
- All components are `"use client"`; they can't be rendered as Server Components.
- **Requires `@chatool/styles`**: install it and import its CSS, or components
  render unstyled.
- **Icons are not here** — import them from `@chatool/icons/<IconName>` (one
  subpath per icon), never from `@chatool/ui`.
- `react` / `react-dom` are peers supplied by the app.

## Related

- `@chatool/styles` — required design tokens (install + import its CSS).
- `@chatool/utils` — provides `cn`.
- `@chatool/icons` — SVG icons used alongside these components.
