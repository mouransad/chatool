# @chatool/ui

**Material Design 3** React UI components for Chatool apps. Every component
imports `cn` from `@chatool/utils` and is styled with the MD3 design tokens from
`@chatool/core` (`--md-sys-*` → Tailwind utilities).

- **Dependencies:** `@chatool/utils`, `radix-ui`, `class-variance-authority`
- **Peers:** `react` ^19, `react-dom` ^19

> Apps using `@chatool/ui` **must also install `@chatool/core`** and import its
> CSS — without the tokens the components are unstyled. SVG icons live in their own
> package, `@chatool/icons`.

## Install

```bash
pnpm add @chatool/ui @chatool/core @chatool/icons
# react ^19 and react-dom ^19 are peers
```

Then import the styles once in your global CSS (see `@chatool/core`):

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";
@source "../node_modules/@chatool/ui/dist";
```

## Exports

**Subpath-only — there is no `@chatool/ui` root barrel.** Each component is
reached through its own path, so editors auto-import the exact subpath and bundles
stay minimal. All components are client components (`"use client"`).

| Subpath              | Exports                                     |
| -------------------- | ------------------------------------------- |
| `@chatool/ui/button` | `Button` (also `default`), `buttonVariants` |

`Button` follows the MD3 button spec: variants `filled` (default) · `tonal` ·
`elevated` · `outlined` · `text`; sizes `default` · `sm` · `lg` · `icon`.

## Usage

```tsx
import Button from "@chatool/ui/button"; // default export

// Icons come from @chatool/icons, one subpath per icon:
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";

export function Example() {
  return (
    <Button variant="tonal">
      Open <KeyboardArrowDownOutlined />
    </Button>
  );
}
```

> Re-theme the component by overriding `@chatool/core`'s `--md-sys-*` tokens, or
> override classes per-instance via `className` (cva + `cn` merge).

## For AI agents

- **Import per component subpath** (`@chatool/ui/button`). There is **no
  `@chatool/ui` root barrel** — do not write `import { Button } from "@chatool/ui"`.
- `Button` is available as both the **default** export and a named export.
- All components are `"use client"`; they can't be rendered as Server Components.
- **Requires `@chatool/core`**: install it and import its CSS, or components
  render unstyled.
- **Icons are not here** — import them from `@chatool/icons/<IconName>` (one
  subpath per icon), never from `@chatool/ui`.
- `react` / `react-dom` are peers supplied by the app.

## Related

- `@chatool/core` — required design tokens / theme CSS (install + import its CSS).
- `@chatool/utils` — provides `cn`.
- `@chatool/icons` — SVG icons used alongside these components.
