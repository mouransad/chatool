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

| Subpath                           | Exports                                                                 |
| --------------------------------- | ----------------------------------------------------------------------- |
| `@chatool/ui/button`              | `Button` (also `default`), `buttonVariants`                             |
| `@chatool/ui/icon-button`         | `IconButton` (also `default`), `iconButtonVariants`                     |
| `@chatool/ui/fab`                 | `Fab` (also `default`), `fabVariants`                                   |
| `@chatool/ui/button-group`        | `ButtonGroup` (also `default`), `buttonGroupVariants`                   |
| `@chatool/ui/toggle-button-group` | `ToggleButtonGroup` (also `default`), `ToggleButtonGroupItem`, variants |

The MD3 **button family**. Shared props across the family: `color` (`primary` ·
`secondary` · `tertiary` · `error`) and `size` (`xs` · `s` _(default)_ · `m` ·
`l` · `xl`).

| Component           | Key props                                                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`            | `variant` (`filled`·`tonal`·`elevated`·`outlined`·`text`), `shape` (`round`·`square`), `startIcon`/`endIcon`, `loading`/`loadingPosition`/`loadingIndicator`, `fullWidth`, `disableElevation`, `asChild` |
| `IconButton`        | `variant` (`standard`·`filled`·`tonal`·`outlined`), `width` (`narrow`·`default`·`wide`), `shape`, **toggle** (`selected`/`defaultSelected`/`onSelectedChange`), `loading`, `asChild`                     |
| `Fab`               | `color` (+`surface`), `size` (`sm`·`md`·`lg`), `extended`, `lowered`, `loading`, `asChild`                                                                                                               |
| `ButtonGroup`       | `variant` (`standard`·`connected`), `orientation`, shared `buttonVariant`/`color`/`size` for children                                                                                                    |
| `ToggleButtonGroup` | Radix `ToggleGroup` (`type="single"\|"multiple"`, `value`/`defaultValue`/`onValueChange`) + `ToggleButtonGroupItem` (`value`)                                                                            |

## Usage

```tsx
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";
import EditOutlined from "@chatool/icons/EditOutlined";

export function Example() {
  return (
    <>
      <Button variant="tonal" endIcon={<ArrowForwardOutlined />}>
        Next
      </Button>
      <Button loading>Saving…</Button>
      <IconButton aria-label="Edit" variant="filled">
        <EditOutlined />
      </IconButton>
    </>
  );
}
```

## Customization

Three layers, increasingly specific:

1. **Global tokens** — override `@chatool/core`'s `--md-sys-*` (re-themes
   everything).
2. **`color` prop** — switch a single button's palette
   (`<Button color="tertiary" />`).
3. **Per-component tokens** — override a component's `--md-comp-*` variables
   globally or per-instance, without touching others:

   ```tsx
   <Button
     style={{ "--md-comp-button-container-color": "#006971" } as CSSProperties}
   >
     Branded
   </Button>
   ```

   Tokens follow `--md-comp-<component>-<role>` (e.g.
   `--md-comp-button-container-color`, `--md-comp-button-label-text-color`,
   `--md-comp-button-outline-color`, `--md-comp-icon-button-*`, `--md-comp-fab-*`,
   `--md-comp-toggle-button-*`). Each falls back to the computed `--md-sys-*`
   value. `className` (cva + `cn` merge) remains available for one-off overrides.

## For AI agents

- **Import per component subpath** (`@chatool/ui/button`, `@chatool/ui/icon-button`,
  `@chatool/ui/fab`, `@chatool/ui/button-group`, `@chatool/ui/toggle-button-group`).
  There is **no `@chatool/ui` root barrel**.
- Each component is available as both the **default** export and a named export;
  `toggle-button-group` also exports the named `ToggleButtonGroupItem`.
- All components are `"use client"`; they can't be rendered as Server Components.
- **Style with tokens, not hex.** `color`/`variant` resolve to `--md-sys-*`; for
  per-component theming set `--md-comp-<component>-*` (CSS var, globally or via
  `style`). `IconButton` becomes a **toggle** when given `selected`/
  `defaultSelected`/`onSelectedChange`. `Button`/`IconButton` inherit
  `variant`/`color`/`size` from a surrounding `ButtonGroup`.
- **Requires `@chatool/core`**: install it and import its CSS, or components
  render unstyled.
- **Icons are not here** — import them from `@chatool/icons/<IconName>`.
- `react` / `react-dom` are peers supplied by the app.

## Related

- `@chatool/core` — required design tokens / theme CSS (install + import its CSS).
- `@chatool/utils` — provides `cn`.
- `@chatool/icons` — SVG icons used alongside these components.
