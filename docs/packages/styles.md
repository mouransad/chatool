# @karnameh/styles

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Packages](README.md) → **styles**

CSS-only package: the Tailwind v4 `@theme`, the shadcn token layer
(`@theme inline` mappings), the `:root` / `.dark` CSS variables, and the base
`@layer` rules. No JavaScript, no build step.

- **Peer:** `tailwindcss` ^4
- **Source:** [`packages/styles/styles.css`](../../packages/styles/styles.css),
  [`packages/styles/theme.css`](../../packages/styles/theme.css)
- **Package README:** [`packages/styles/README.md`](../../packages/styles/README.md)
- **Agent rules:** [`packages/styles/AGENTS.md`](../../packages/styles/AGENTS.md)

> ⚠️ The CSS shipped today is a **placeholder** mirroring a standard shadcn +
> Tailwind v4 token layer. Replace it with the exact CSS from the landing repo's
> `src/styles/main.css`.

## Exports

| Subpath | Contents |
| --- | --- |
| `@karnameh/styles/styles.css` | tokens + variables **+** base `@layer` rules |
| `@karnameh/styles/theme.css` | tokens + variables only (no base resets) |

`styles.css` `@import`s `theme.css`, so there is a single source for the tokens.

## Usage

In the app's global CSS — Tailwind **first**, then the package:

```css
@import "tailwindcss";
@import "@karnameh/styles/styles.css";
```

`@import "tailwindcss";` must come first so Tailwind's layers exist before these
tokens/base rules extend them.

## Rebranding

Override the `:root` variables **after** the import:

```css
@import "tailwindcss";
@import "@karnameh/styles/styles.css";

:root {
  --primary: oklch(0.55 0.2 265);
  --radius: 0.5rem;
}
```

The shadcn `@theme inline` block maps these variables to Tailwind tokens, so a
single variable change re-themes every component that uses them.

## Related

- [@karnameh/ui](ui.md) — components that rely on these tokens.
- [Consuming guides](../guides/consuming/README.md) — per-framework CSS wiring.

---

Up: [Packages](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
