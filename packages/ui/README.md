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
stay minimal. `Button` is **Server-Component-safe** (it carries no `"use client"`);
its only client part is the press ripple, a separate island (see
[Accessibility & rendering](#accessibility--rendering)).

| Subpath              | Exports                                     |
| -------------------- | ------------------------------------------- |
| `@chatool/ui/button` | `Button` (also `default`), `buttonVariants` |

> The MD3 button family (icon button, FAB, button group, toggle / segmented) is
> being built out — this release ships the **common Button**.

**`Button`** follows the Material 3 spec — **color is fixed per style**, there is
no free color choice:

| Prop                                               | Values                                                                        |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| `variant`                                          | `filled` _(default)_ · `tonal` · `elevated` · `outlined` · `text`             |
| `size`                                             | `xs` · `s` _(default)_ · `m` · `l` · `xl` (32 / 40 / 56 / 96 / 136 dp)        |
| `shape`                                            | `round` _(default, pill)_ · `square` — both morph their corners while pressed |
| `startIcon` / `endIcon`                            | leading / trailing icon (ignored with `asChild`)                              |
| `loading` / `loadingPosition` / `loadingIndicator` | spinner state (`start`·`center`·`end`)                                        |
| `asChild`                                          | render styles onto the child element (e.g. an `<a>`) via Radix `Slot`         |

MD3 press feedback is **built in** and automatic: a pointer **ripple**, the
**state layer** (hover 8% / focus 10% / press 10%), and a **press shape-morph**
(the corner shrinks while pressed, then springs back). No props or setup required.

## Usage

```tsx
import Button from "@chatool/ui/button";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";

export function Example() {
  return (
    <>
      <Button variant="tonal" endIcon={<ArrowForwardOutlined />}>
        Next
      </Button>
      <Button loading>Saving…</Button>
    </>
  );
}
```

## Customization

Three layers, increasingly specific:

1. **Global tokens** — override `@chatool/core`'s `--md-sys-*` (re-themes
   everything).
2. **Per-component tokens** — override `--md-comp-button-*` globally or per
   instance, without touching anything else:

   ```tsx
   <Button
     style={{ "--md-comp-button-container-color": "#006971" } as CSSProperties}
   >
     Branded
   </Button>
   ```

   Tokens follow `--md-comp-button-<role>`:
   `--md-comp-button-container-color`, `--md-comp-button-label-text-color`,
   `--md-comp-button-outline-color`, `--md-comp-button-focus-color`. Each falls
   back to the computed `--md-sys-*` value.

3. **`className`** (cva + `cn` merge) for one-off overrides.

## Accessibility & rendering

`Button` follows the
[WAI-ARIA APG button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/):

- Renders a **native `<button>`** — role `button` + Space/Enter activation for
  free. Defaults to **`type="button"`** so it never submits a form by accident
  (pass `type="submit"` when you want that).
- **Accessible name** comes from your text content. For an **icon-only** button
  (no visible text) you **must** pass `aria-label`.
- `disabled` and `loading` are conveyed to assistive tech (`disabled` /
  `aria-busy`); a **loading** button is non-actionable by mouse **and** keyboard,
  yet keeps its color + spinner.
- All `aria-*` flow through `{...props}`: `aria-pressed` (toggle — keep the label
  constant when it flips), `aria-haspopup` / `aria-expanded` (menu / disclosure),
  `aria-controls`, `aria-describedby`, `aria-label` / `aria-labelledby`.
- **`asChild`** renders _your_ element via Radix `Slot`. Pass a natively
  interactive element (`<a href>`, `<button>`); a non-interactive element
  (`<div>`) needs `role="button"`, `tabIndex={0}`, and Enter/Space handling **you**
  add — prefer a native element.

**Rendering:** the module has **no `"use client"`**, so `Button` renders as a
**React Server Component** in Next App Router (and works in Pages Router / Vite /
webpack). Static buttons and `asChild` links need no client JS; only the press
**ripple** is a tiny `"use client"` island that hydrates on the client.

## For AI agents

- **Import the subpath** `@chatool/ui/button`. There is **no `@chatool/ui` root
  barrel**. `Button` is both the **default** and a named export.
- `Button` has **no `"use client"`** — it renders as a **Server Component** (only
  the press ripple is a client island). Don't add the directive; passing `onClick`
  just makes the _caller_ a client component, as usual.
- **A11y (APG):** native `<button>`, defaults to **`type="button"`** (pass
  `type="submit"` for forms); give **icon-only** buttons an `aria-label`; `aria-*`
  (`aria-pressed`/`aria-haspopup`/`aria-expanded`/…) pass through; `loading` is
  non-actionable + `aria-busy`. For `asChild`, pass a natively interactive element.
- **MD3 spec:** color is **fixed per style** (no `color` prop) — filled→primary,
  tonal→secondary-container, elevated→surface-container-low + primary,
  outlined/text→primary. Style with tokens, not hex; for per-component theming set
  `--md-comp-button-*` (CSS var, globally or via `style`).
- **Press feedback (ripple, state layer, shape-morph) is built in** — don't re-add
  it. The ripple uses the Web Animations API into a React-empty overlay.
- Token **colors carry a `color:` hint** (`text-[color:var(--…)]`) so `cn`/
  tailwind-merge keeps them next to the typescale class instead of dropping them.
- **Requires `@chatool/core`**: install it and import its CSS, or it renders
  unstyled.
- **Icons are not here** — import them from `@chatool/icons/<IconName>`.
- `react` / `react-dom` are peers supplied by the app.

## Related

- `@chatool/core` — required design tokens / theme CSS (install + import its CSS).
- `@chatool/utils` — provides `cn`.
- `@chatool/icons` — SVG icons used alongside these components.
