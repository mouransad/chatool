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

| Subpath                    | Exports                                               |
| -------------------------- | ----------------------------------------------------- |
| `@chatool/ui/button`       | `Button` (also `default`), `buttonVariants`           |
| `@chatool/ui/icon-button`  | `IconButton` (also `default`), `iconButtonVariants`   |
| `@chatool/ui/button-group` | `ButtonGroup` (also `default`), `buttonGroupVariants` |
| `@chatool/ui/input`        | `Input` (also `default`), `inputVariants`             |

> The MD3 button family (FAB, segmented) is still being built out — this release
> ships the **common Button**, the **Icon button**, and the **Button group**.

**`Button`** follows the Material 3 spec — **color is fixed per style**, there is
no free color choice:

| Prop                                               | Values                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `variant`                                          | `filled` _(default)_ · `tonal` · `elevated` · `outlined` · `text`                |
| `size`                                             | `xs` · `s` _(default)_ · `m` · `l` · `xl` (32 / 40 / 56 / 96 / 136 dp)           |
| `shape`                                            | `round` _(default, pill)_ · `square` — both morph their corners while pressed    |
| `startIcon` / `endIcon`                            | leading / trailing icon (ignored with `asChild`)                                 |
| `selected` / `selectedIcon`                        | MD3 **toggle**: sets `aria-pressed`, morphs round→square, swaps the leading icon |
| `loading` / `loadingPosition` / `loadingIndicator` | spinner state (`start`·`center`·`end`)                                           |
| `asChild`                                          | render styles onto the child element (e.g. an `<a>`) via Radix `Slot`            |

MD3 press feedback is **built in** and automatic: a pointer **ripple**, the
**state layer** (hover 8% / focus 10% / press 10%), and a **press shape-morph**
(the corner shrinks while pressed, then springs back). No props or setup required.

**`IconButton`** is the **icon-only** family member — a square container holding a
single `@chatool/icons` glyph (passed as `children`). It shares the size scale,
shape-morph, ripple, and state layer with `Button`; **color is fixed per style**:

| Prop                           | Values                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `variant`                      | `standard` _(default)_ · `filled` · `tonal` · `outlined`                       |
| `size`                         | `xs` · `s` _(default)_ · `m` · `l` · `xl` (square; 32 / 40 / 56 / 96 / 136 dp) |
| `shape`                        | `round` _(default, circle)_ · `square` — both morph their corners on press     |
| `selected`                     | MD3 **toggle**: sets `aria-pressed`, morphs round→square, swaps `selectedIcon` |
| `selectedIcon`                 | glyph shown while `selected` (defaults to `children`)                          |
| `loading` / `loadingIndicator` | spinner state (non-actionable + `aria-busy`)                                   |
| `asChild`                      | render styles onto the child element (e.g. an `<a>`) via Radix `Slot`          |

> An icon button has **no visible text**, so you **must** pass `aria-label` (or
> `aria-labelledby`) — for a toggle, keep that label constant when `selected` flips.

**`ButtonGroup`** is the MD3 **Expressive** invisible container that arranges its
`Button` / `IconButton` children and adds the group interaction. It owns no
selection state — each child keeps its own `selected` / `aria-pressed`:

| Prop          | Values                                                         |
| ------------- | -------------------------------------------------------------- |
| `variant`     | `standard` _(default)_ · `connected`                           |
| `orientation` | `horizontal` _(default)_ · `vertical`                          |
| `asChild`     | render the group + `role="group"` onto your element via `Slot` |

- **standard** — children stay flexible (equal share); **pressing one expands it
  and compresses its neighbors** (the Expressive squish). Children keep their own
  shape and per-button press morph. ~12dp gap.
- **connected** — a tight **2dp** cluster (no width interaction between buttons).
  Children keep their **own default radius**; per the spec, selection morphs the
  **selected** child's shape — handled by the button's own smooth round→square
  animation. A single- / multi-select segmented control is just a connected group
  of toggle buttons.

> Pass the group an `aria-label` (or `aria-labelledby`) to name the set. The group
> never overrides a child's `border-radius`, so each button keeps its default
> finite shape and the select/deselect morph stays smooth.

**`Input`** is the MD3 **Text Field** component for user input (supporting single-line text, passwords, email, etc., and textareas via `asChild`). Color and floating states are fixed per variant:

| Prop         | Values                                                                                |
| ------------ | ------------------------------------------------------------------------------------- |
| `variant`    | `filled` _(default)_ · `outlined`                                                     |
| `size`       | `s` _(default, 56dp)_ · `xs` _(compact, 40dp)_                                        |
| `label`      | text label that floats above the input container on focus / content                   |
| `startIcon`  | leading icon node (e.g. search icon)                                                  |
| `endIcon`    | trailing icon node (e.g. error icon)                                                  |
| `helperText` | supporting description text displayed below the field container                       |
| `errorText`  | error message displayed below the field container (overrides `helperText` when error) |
| `error`      | boolean that triggers the error state styling                                         |
| `asChild`    | render styles onto the child element (e.g. a `<textarea>`) via Radix `Slot`           |

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

```tsx
import IconButton from "@chatool/ui/icon-button";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import FavoriteFilled from "@chatool/icons/FavoriteFilled";

export function Like({ liked }: { liked: boolean }) {
  return (
    <IconButton
      variant="tonal"
      aria-label="Add to favorites"
      selected={liked}
      selectedIcon={<FavoriteFilled />}
    >
      <FavoriteOutlined />
    </IconButton>
  );
}
```

```tsx
import ButtonGroup from "@chatool/ui/button-group";
import Button from "@chatool/ui/button";

export function Range({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ButtonGroup variant="connected" aria-label="Range">
      {["Day", "Week", "Month"].map((v) => (
        <Button
          key={v}
          variant={value === v ? "filled" : "tonal"}
          selected={value === v}
          onClick={() => onChange(v)}
        >
          {v}
        </Button>
      ))}
    </ButtonGroup>
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
   back to the computed `--md-sys-*` value. **`IconButton`** has the parallel set
   `--md-comp-icon-button-container-color`, `--md-comp-icon-button-icon-color`,
   `--md-comp-icon-button-outline-color`, `--md-comp-icon-button-focus-color`.
   **`ButtonGroup`** exposes `--md-comp-button-group-gap` (the gap between
   children).
   **`Input`** exposes `--md-comp-input-container-color`, `--md-comp-input-text-color`,
   `--md-comp-input-label-color`, `--md-comp-input-outline-color`,
   `--md-comp-input-focus-color`, and `--md-comp-input-error-color`.

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
- **Toggle** — pass `selected` to make it a toggle: it reflects `aria-pressed`,
  morphs round→square, fills `outlined` with inverse-surface, and swaps the leading
  icon to `selectedIcon`. Keep the label constant when `selected` flips (per the
  APG); omit `selected` for a plain button (no `aria-pressed`).
- Other `aria-*` flow through `{...props}`: `aria-haspopup` / `aria-expanded` (menu
  / disclosure), `aria-controls`, `aria-describedby`, `aria-label` /
  `aria-labelledby`.
- **`asChild`** renders _your_ element via Radix `Slot`. Pass a natively
  interactive element (`<a href>`, `<button>`); a non-interactive element
  (`<div>`) needs `role="button"`, `tabIndex={0}`, and Enter/Space handling **you**
  add — prefer a native element.

**Rendering:** the module has **no `"use client"`**, so `Button` renders as a
**React Server Component** in Next App Router (and works in Pages Router / Vite /
webpack). Static buttons and `asChild` links need no client JS; only the press
**ripple** is a tiny `"use client"` island that hydrates on the client.

`IconButton` follows the same APG button pattern and shares the rendering model
(Server Component, ripple island). Two icon-only specifics:

- **`aria-label` is required** — there is no text to name it. Without it the button
  has no accessible name.
- **Toggle** — when you pass `selected`, it becomes a toggle: it reflects
  `aria-pressed`, morphs round→square, and swaps to `selectedIcon`. **Keep the
  `aria-label` constant** across the toggle (per the APG); omit `selected` for a
  plain, non-toggle icon button (no `aria-pressed`).

`ButtonGroup` is a **`role="group"`** container (give it an `aria-label`). It's a
pure **Server Component** — a layout that spaces/shapes its children and owns no
state; each child keeps its own role + `aria-pressed`. Children stay individual Tab
stops (no roving focus). `asChild` forwards the group styles + role onto your
element.

`Input` renders a **native `<input>`** (or child element like `<textarea>` when using `asChild`).
It does not contain any React client hooks (is a pure **Server Component**). The floating label transition,
outline highlights, and placeholder showing are handled entirely in CSS:

- The input requires no client JS for interactive focus and content tracking; it leverages CSS peer selectors.
- Supports error text below the component container with `aria-describedby` or standard readable hierarchy.
- For `asChild`, pass a natively focusable and text-editable element.

## For AI agents

- **Import the subpath** `@chatool/ui/button`. There is **no `@chatool/ui` root
  barrel**. `Button` is both the **default** and a named export.
- `Button` has **no `"use client"`** — it renders as a **Server Component** (only
  the press ripple is a client island). Don't add the directive; passing `onClick`
  just makes the _caller_ a client component, as usual.
- **A11y (APG):** native `<button>`, defaults to **`type="button"`** (pass
  `type="submit"` for forms); give **icon-only** buttons an `aria-label`; `aria-*`
  (`aria-haspopup`/`aria-expanded`/…) pass through; `loading` is non-actionable +
  `aria-busy`. For `asChild`, pass a natively interactive element.
- **Toggle:** pass `selected` (sets `aria-pressed`, morphs round→square, swaps to
  `selectedIcon`) — keep the label constant; omit it for a plain button. Same
  `selected`/`selectedIcon` API as `IconButton`.
- **MD3 spec:** color is **fixed per style** (no `color` prop) — filled→primary,
  tonal→secondary-container, elevated→surface-container-low + primary,
  outlined/text→primary. Style with tokens, not hex; for per-component theming set
  `--md-comp-button-*` (CSS var, globally or via `style`).
- **Press feedback (ripple, state layer, shape-morph) is built in** — don't re-add
  it. The ripple uses the Web Animations API into a React-empty overlay.
- **`IconButton`** (`@chatool/ui/icon-button`): icon-only, square; same Server
  Component + ripple model. The glyph is `children`; **`aria-label` is required**.
  Styles `standard` _(default)_ · `filled` · `tonal` · `outlined`; sizes `xs`–`xl`;
  `shape` `round` _(default, circle)_ · `square`. Pass `selected` to make it an MD3
  **toggle** (reflects `aria-pressed`, morphs round→square, swaps `selectedIcon`) —
  keep the label constant; omit `selected` for a plain button. Per-component tokens
  `--md-comp-icon-button-*`.
- **`ButtonGroup`** (`@chatool/ui/button-group`): the MD3 **Expressive**
  `role="group"` container for `Button`/`IconButton` children — pure **Server
  Component** (CSS-only interaction), owns no state. `variant` `standard`
  _(default)_ presses-squish (pressed child expands, neighbors compress) ·
  `connected` (tight 2dp cluster; children keep their own radius, the selected
  child morphs via its own smooth round→square animation). `orientation`
  `horizontal` _(default)_ · `vertical`. The group never overrides a child's
  border-radius. Give it an `aria-label`; build a segmented control by toggling the
  children's `selected`. Gap token `--md-comp-button-group-gap`.
- Token **colors carry a `color:` hint** (`text-[color:var(--…)]`) so `cn`/
  tailwind-merge keeps them next to the typescale class instead of dropping them.
- **Requires `@chatool/core`**: install it and import its CSS, or it renders
  unstyled.
- **Icons are not here** — import them from `@chatool/icons/<IconName>`.
- `react` / `react-dom` are peers supplied by the app.
- **`Input`** (`@chatool/ui/input`): Text field component, supports `filled` and `outlined` variants, sizes `s`/`xs`, and `error` state. Features pure CSS floating label transitions (using `:placeholder-shown` + sibling selectors). Supports custom start/end icons, helper/error text below the container, and `asChild` wrapping (perfect for textareas). Exposes component custom properties: `--md-comp-input-*`.

## Related

- `@chatool/core` — required design tokens / theme CSS (install + import its CSS).
- `@chatool/utils` — provides `cn`.
- `@chatool/icons` — SVG icons used alongside these components.
