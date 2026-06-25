# @chatool/styles

CSS-only package: the Tailwind v4 `@theme`, the shadcn token layer
(`@theme inline` mappings), the `:root` / `.dark` CSS variables, and the base
`@layer` rules. No JavaScript, no build step.

- **Peers:** `tailwindcss` ^4

> The CSS shipped today is a **placeholder** mirroring a standard shadcn +
> Tailwind v4 token layer. Fork it and replace with your own design tokens.

## Install

```bash
pnpm add @chatool/styles
pnpm add -D tailwindcss   # ^4 peer
```

## Exports

| Subpath | Contents |
| --- | --- |
| `@chatool/styles/styles.css` | tokens + variables **+** base `@layer` rules |
| `@chatool/styles/theme.css` | tokens + variables only (no base resets) |

`styles.css` `@import`s `theme.css`, so the tokens have a single source.

## Usage

In your app's global CSS — Tailwind **first**, then this package:

```css
@import "tailwindcss";
@import "@chatool/styles/styles.css";
```

`@import "tailwindcss";` must come first so Tailwind's layers exist before these
tokens and base rules extend them.

If you only want the tokens/variables without the base resets, import
`@chatool/styles/theme.css` instead of `styles.css`.

### Making Tailwind see component classes

When you also use `@chatool/ui` / `@chatool/icons`, point Tailwind at their
compiled output so their utility classes aren't tree-shaken away:

```css
@import "tailwindcss";
@import "@chatool/styles/styles.css";

@source "../node_modules/@chatool/ui/dist";
@source "../node_modules/@chatool/icons/dist";
```

### Rebranding

Override the `:root` variables **after** the import:

```css
@import "tailwindcss";
@import "@chatool/styles/styles.css";

:root {
  --primary: oklch(0.55 0.2 265);
  --radius: 0.5rem;
}
```

The shadcn `@theme inline` block maps these variables to Tailwind tokens, so a
single variable change re-themes every component that uses them.

## For AI agents

- This package is **CSS-only** — there is no JS entry, no default import. Consume
  it through the CSS `@import` statements above.
- Always import `tailwindcss` **before** `@chatool/styles/styles.css`.
- Use `styles.css` for tokens + base layer rules; use `theme.css` for tokens only.
- `tailwindcss` is a peer the app installs; it is never bundled here.
- Apps using `@chatool/ui` must import this package's CSS for components to be
  styled.

## Related

- `@chatool/ui` — components that rely on these tokens (requires this package).
