# @chatool/core

App-root provider for Chatool apps. `ChatoolProvider` owns theme/dark-mode state
— `light | dark | system` — persists it to `localStorage`, and applies it via the
`dark` class that this package's theme CSS keys its dark tokens off, with an
inline script that prevents a flash of the wrong theme on first paint (SSR-safe).

This package also ships the **CSS-only** Tailwind v4 + **Material Design 3**
token layer (`@chatool/core/styles.css` / `@chatool/core/theme.css`) that
`@chatool/ui` is styled with — import it in your global CSS (see
[Theme CSS](#theme-css)).

- **Dependencies:** none
- **Peers:** `react` ^19; `tailwindcss` ^4 (optional — only needed to process
  the theme CSS)

## Install

```bash
pnpm add @chatool/core
# react ^19 is a peer — install it if your app doesn't already have it
# tailwindcss ^4 is an optional peer — needed if you import the theme CSS
```

Import the theme CSS once in your global CSS (it defines the `.dark` tokens this
provider toggles). The provider does **not** import CSS for you — Tailwind needs
those `@import`/`@source` lines at build time:

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";
```

## Exports

The JS surface is one subpath and is a client boundary (`"use client"`). Two
additional CSS-only subpaths ship the theme layer.

| Subpath                    | Exports / Contents                                                                                   | Directive      |
| -------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| `@chatool/core`            | `ChatoolProvider`, `useTheme`, `Theme`, `ResolvedTheme`, `ThemeContextValue`, `ChatoolProviderProps` | `"use client"` |
| `@chatool/core/styles.css` | tokens + variables **+** base `@layer` rules                                                         | CSS only       |
| `@chatool/core/theme.css`  | tokens + variables only (no base resets)                                                             | CSS only       |

## Theme CSS

The CSS-only layer is the **Material Design 3** token system: the
`--md-sys-*` system tokens (color / typescale / shape / elevation / state /
motion) in `:root` + `.dark`, mapped to Tailwind utilities via `@theme inline`
(`bg-primary`, `text-on-surface`, `rounded-*`, `text-label-large`,
`shadow-elevation-1`, …). `styles.css` `@import`s `theme.css`, so the tokens have
a single source. The token names follow the Material Design 3 spec, so output
from the **Material Theme Builder** / `material-color-utilities` drops in directly.

> The color values shipped today are the MD3 **baseline** scheme (default
> Material purple) — replace them with your brand palette (see
> [Rebranding](#rebranding)).

In your app's global CSS — Tailwind **first**, then this package:

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";
```

`@import "tailwindcss";` must come first so Tailwind's layers exist before these
tokens and base rules extend them. If you only want the tokens/variables without
the base resets, import `@chatool/core/theme.css` instead of `styles.css`.

### Making Tailwind see component classes

When you also use `@chatool/ui` / `@chatool/icons`, point Tailwind at their
compiled output so their utility classes aren't tree-shaken away:

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";

@source "../node_modules/@chatool/ui/dist";
@source "../node_modules/@chatool/icons/dist";
```

### Rebranding

Override the MD3 system tokens **after** the import (paste the Material Theme
Builder export straight into `:root` / `.dark`, or set individual roles):

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";

:root {
  --md-sys-color-primary: #00639b;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #cde5ff;
  --md-sys-color-on-primary-container: #001d33;
  --md-sys-shape-corner-full: 12px; /* squarer buttons, etc. */
}
.dark {
  --md-sys-color-primary: #95cbff;
  /* …dark scheme roles… */
}

/* Swap the whole type family in one place: */
:root {
  --md-ref-typeface-plain: "Inter", system-ui, sans-serif;
  --md-ref-typeface-brand: "Inter", system-ui, sans-serif;
}
```

The `@theme inline` block maps these `--md-sys-*` tokens to Tailwind utilities, so
a single token change re-themes every component that uses them.

## Usage

Wrap your app once at the root and add `suppressHydrationWarning` to `<html>`
(the provider sets the theme class imperatively, not through React).

### Next.js App Router — `app/layout.tsx`

```tsx
import { ChatoolProvider } from "@chatool/core";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ChatoolProvider>{children}</ChatoolProvider>
      </body>
    </html>
  );
}
```

`ChatoolProvider` is a client component, but you can render it from a Server
Component layout — it creates a client boundary around `children`.

### Vite SPA — `main.tsx`

```tsx
import { ChatoolProvider } from "@chatool/core";

createRoot(document.getElementById("root")!).render(
  <ChatoolProvider>
    <App />
  </ChatoolProvider>,
);
```

### Reading & changing the theme — `useTheme()`

```tsx
"use client";

import { useTheme } from "@chatool/core";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? "Light" : "Dark"} ({theme})
    </button>
  );
}
```

- `theme` — the current selection: `"light" | "dark" | "system"`.
- `resolvedTheme` — the concrete theme on the document now: `"light" | "dark"`.
- `setTheme(next)` — persist and apply a new selection.

### Props

| Prop           | Type                            | Default           | Description                                                       |
| -------------- | ------------------------------- | ----------------- | ----------------------------------------------------------------- |
| `defaultTheme` | `"light" \| "dark" \| "system"` | `"system"`        | Selection used before a stored value is read (and on the server). |
| `storageKey`   | `string`                        | `"chatool-theme"` | `localStorage` key the selection is persisted under.              |
| `enableSystem` | `boolean`                       | `true`            | Allow `system` to follow `prefers-color-scheme`.                  |

## For AI agents

- Mount **one** `ChatoolProvider` at the app root. Import it (and `useTheme`) from
  the root `@chatool/core` — the only subpath.
- The whole package is `"use client"`. You can render `ChatoolProvider` inside a
  Server Component (e.g. an App Router layout); it creates a client boundary.
- Add `suppressHydrationWarning` to `<html>`. The provider toggles the `dark`
  class on `document.documentElement` imperatively, so React must not be asked to
  reconcile that attribute.
- This package is **theme-only** — it provides the theme provider and the
  Material Design 3 CSS token layer, nothing more.
- **Theming contract = MD3 system tokens.** Apps customize by overriding
  `--md-sys-color-*` / `--md-sys-typescale-*` / `--md-sys-shape-corner-*` (and
  `--md-ref-typeface-*`) in `:root` / `.dark` after the import; `@theme inline`
  re-exposes them as Tailwind utilities. Material Theme Builder output drops in 1:1.
- It ships the theme CSS (`@chatool/core/styles.css` / `theme.css`) but the JS
  provider does **not** import CSS for you — keep `@import "@chatool/core/styles.css"`
  in your global CSS so Tailwind processes it at build time.
- The CSS subpaths are **CSS-only** — there is no JS entry for them, no default
  import. Consume them via the CSS `@import` statements above. Always import
  `tailwindcss` **before** `@chatool/core/styles.css`.
- Dark mode is class-based: the provider matches the `.dark` selector defined in
  `theme.css`. `useTheme()` throws if used outside the provider.
- `react` is a peer (your app supplies it); `tailwindcss` is an **optional** peer
  (only needed to process the theme CSS). There are no runtime dependencies.

## Related

- `@chatool/ui` — components styled by the theme tokens this package ships.
