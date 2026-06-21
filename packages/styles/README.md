# @karnameh/styles

CSS-only Tailwind v4 theme + shadcn token layer for Karnameh apps.

- **Peer:** `tailwindcss` ^4
- **Full docs:** [docs/packages/styles.md](../../docs/packages/styles.md)
- **Monorepo:** [karnameh-kit README](../../README.md)

## Install

```bash
pnpm add @karnameh/styles
pnpm add -D tailwindcss
```

## Usage

In your global CSS — Tailwind first, then this package:

```css
@import "tailwindcss";
@import "@karnameh/styles/styles.css";
```

Exports:

- `@karnameh/styles/styles.css` — tokens + variables + base `@layer` rules.
- `@karnameh/styles/theme.css` — tokens + variables only.

Rebrand by overriding the `:root` variables after the import. See the
[full docs](../../docs/packages/styles.md).
