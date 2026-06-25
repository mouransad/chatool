# @chatool/core

App-root provider for Chatool apps. `ChatoolProvider` owns theme/dark-mode state
— `light | dark | system` — persists it to `localStorage`, and applies it via the
`dark` class that `@chatool/styles` keys its dark tokens off, with an inline
script that prevents a flash of the wrong theme on first paint (SSR-safe).

- **Dependencies:** none
- **Peers:** `react` ^19

## Install

```bash
pnpm add @chatool/core
# react ^19 is a peer — install it if your app doesn't already have it
```

You also need `@chatool/styles` imported in your global CSS (it defines the
`.dark` tokens this provider toggles). The provider does **not** import CSS for
you — Tailwind needs those `@import`/`@source` lines at build time:

```css
@import "tailwindcss";
@import "@chatool/styles/styles.css";
```

## Exports

One subpath. The whole package is a client boundary (`"use client"`).

| Subpath | Exports | Directive |
| --- | --- | --- |
| `@chatool/core` | `ChatoolProvider`, `useTheme`, `Theme`, `ResolvedTheme`, `ThemeContextValue`, `ChatoolProviderProps` | `"use client"` |

## Usage

Wrap your app once at the root and add `suppressHydrationWarning` to `<html>`
(the provider sets the theme class imperatively, not through React).

### Next.js App Router — `app/layout.tsx`

```tsx
import { ChatoolProvider } from "@chatool/core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme === "dark" ? "Light" : "Dark"} ({theme})
    </button>
  );
}
```

- `theme` — the current selection: `"light" | "dark" | "system"`.
- `resolvedTheme` — the concrete theme on the document now: `"light" | "dark"`.
- `setTheme(next)` — persist and apply a new selection.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultTheme` | `"light" \| "dark" \| "system"` | `"system"` | Selection used before a stored value is read (and on the server). |
| `storageKey` | `string` | `"chatool-theme"` | `localStorage` key the selection is persisted under. |
| `enableSystem` | `boolean` | `true` | Allow `system` to follow `prefers-color-scheme`. |

## For AI agents

- Mount **one** `ChatoolProvider` at the app root. Import it (and `useTheme`) from
  the root `@chatool/core` — the only subpath.
- The whole package is `"use client"`. You can render `ChatoolProvider` inside a
  Server Component (e.g. an App Router layout); it creates a client boundary.
- Add `suppressHydrationWarning` to `<html>`. The provider toggles the `dark`
  class on `document.documentElement` imperatively, so React must not be asked to
  reconcile that attribute.
- This package is **theme-only**. It does not wrap `@chatool/api` (the API stays
  framework-agnostic and server-injectable via `createServices`/`getServices`),
  and it does not import CSS — keep `@import "@chatool/styles/..."` in your global
  CSS.
- Dark mode is class-based: the provider matches the `.dark` selector defined by
  `@chatool/styles`. `useTheme()` throws if used outside the provider.
- `react` is a peer (your app supplies it); there are no runtime dependencies.

## Related

- `@chatool/styles` — defines the `.dark` design tokens this provider toggles.
- `@chatool/ui` — components styled by those tokens.
