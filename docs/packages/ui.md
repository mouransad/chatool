# @chatool/ui

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Packages](README.md) → **ui**

Shadcn-based React UI components and SVG icons. All components import `cn` from
[@chatool/utils](utils.md).

- **Deps:** `@chatool/utils` (`workspace:^`), `@chatool/icons`
  (`workspace:^`), `radix-ui`, `class-variance-authority`
- **Peers:** `react` ^19, `react-dom` ^19
- **Source:** [`packages/ui/src`](../../packages/ui/src)
- **Package README:** [`packages/ui/README.md`](../../packages/ui/README.md)
- **Agent rules:** [`packages/ui/AGENTS.md`](../../packages/ui/AGENTS.md)

> Apps using `@chatool/ui` **must also install [@chatool/styles](styles.md)**
> and import its CSS — the components are styled with the shared design tokens.

## Exports

Subpath-only — there is **no `@chatool/ui` root barrel**. Each component is
reached through its own path, so editors auto-import the subpath rather than a
barrel.

| Subpath | Components | Directive |
| --- | --- | --- |
| `@chatool/ui/button` | `Button` (also the `default` export), `buttonVariants` | `"use client"` |
| `@chatool/ui/dropdown-menu` | `DropdownMenu*` (trigger/content/item/checkbox/label/separator/sub/…) | `"use client"` |
| `@chatool/ui/bottom-sheet` | `BottomSheet*` + `BottomSheetHeader` | `"use client"` |

Client components ship `"use client"`. SVG icons live in their own package,
[`@chatool/icons`](icons.md).

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
import ChatoolLogoIcon from "@chatool/icons/ChatoolLogoIcon";
```

Always import from the per-component subpath — there is no root barrel, which
also keeps bundles minimal.

`bottom-sheet` is built on `radix-ui`'s Dialog and includes
`BottomSheetHeader` (its own file, `bottom-sheet-header.tsx`).

> The component bodies shipped today are reasonable shadcn-style scaffolds.
> Replace them with the exact sources from the landing repo; the exports map and
> directives are already in place.

## Related

- [@chatool/styles](styles.md) — required design tokens.
- [@chatool/utils](utils.md) — provides `cn`.

---

Up: [Packages](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
