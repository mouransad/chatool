# @karnameh/ui

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Packages](README.md) → **ui**

Shadcn-based React UI components and SVG icons. All components import `cn` from
[@karnameh/utils](utils.md).

- **Deps:** `@karnameh/utils` (`workspace:^`), `@karnameh/icons`
  (`workspace:^`), `radix-ui`, `class-variance-authority`
- **Peers:** `react` ^19, `react-dom` ^19
- **Source:** [`packages/ui/src`](../../packages/ui/src)
- **Package README:** [`packages/ui/README.md`](../../packages/ui/README.md)
- **Agent rules:** [`packages/ui/AGENTS.md`](../../packages/ui/AGENTS.md)

> Apps using `@karnameh/ui` **must also install [@karnameh/styles](styles.md)**
> and import its CSS — the components are styled with the shared design tokens.

## Exports

Subpath-only — there is **no `@karnameh/ui` root barrel**. Each component is
reached through its own path, so editors auto-import the subpath rather than a
barrel.

| Subpath | Components | Directive |
| --- | --- | --- |
| `@karnameh/ui/button` | `Button` (also the `default` export), `buttonVariants` | `"use client"` |
| `@karnameh/ui/dropdown-menu` | `DropdownMenu*` (trigger/content/item/checkbox/label/separator/sub/…) | `"use client"` |
| `@karnameh/ui/bottom-sheet` | `BottomSheet*` + `BottomSheetHeader` | `"use client"` |

Client components ship `"use client"`. SVG icons live in their own package,
[`@karnameh/icons`](icons.md).

## Usage

```tsx
import Button from "@karnameh/ui/button"; // default export
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@karnameh/ui/dropdown-menu";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@karnameh/ui/bottom-sheet";
import KarnamehLogoIcon from "@karnameh/icons/KarnamehLogoIcon";
```

Always import from the per-component subpath — there is no root barrel, which
also keeps bundles minimal.

`bottom-sheet` is built on `radix-ui`'s Dialog and includes
`BottomSheetHeader` (its own file, `bottom-sheet-header.tsx`).

> The component bodies shipped today are reasonable shadcn-style scaffolds.
> Replace them with the exact sources from the landing repo; the exports map and
> directives are already in place.

## Related

- [@karnameh/styles](styles.md) — required design tokens.
- [@karnameh/utils](utils.md) — provides `cn`.

---

Up: [Packages](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
