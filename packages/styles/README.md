# @chatool/styles

CSS-only Tailwind v4 theme + shadcn token layer for Chatool apps.

- **Peer:** `tailwindcss` ^4
- **Full docs:** [docs/packages/styles.md](../../docs/packages/styles.md)
- **Monorepo:** [chatool-kit README](../../README.md)

## Install

```bash
pnpm add @chatool/styles
pnpm add -D tailwindcss
```

## Usage

In your global CSS — Tailwind first, then this package:

```css
@import "tailwindcss";
@import "@chatool/styles/styles.css";
```

Exports:

- `@chatool/styles/styles.css` — tokens + variables + base `@layer` rules.
- `@chatool/styles/theme.css` — tokens + variables only.

Rebrand by overriding the `:root` variables after the import. See the
[full docs](../../docs/packages/styles.md).
