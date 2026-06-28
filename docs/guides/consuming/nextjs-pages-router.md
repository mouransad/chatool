# Next.js Pages Router

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → [Consuming](README.md) → **Pages Router**

Import the theme CSS in your global stylesheet and mount `ChatoolProvider` in
`pages/_app.tsx`.

## Global CSS

```css
/* styles/globals.css imported in pages/_app.tsx */
@import "tailwindcss";
@import "@chatool/core/styles.css";
```

## Mount `ChatoolProvider` in `pages/_app.tsx`

```tsx
// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChatoolProvider } from "@chatool/core";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChatoolProvider>
      <Component {...pageProps} />
    </ChatoolProvider>
  );
}
```

To avoid a flash of the wrong theme on first paint, the provider also runs an
inline no-flash script — no extra setup required.

## Related

- [App Router](nextjs-app-router.md) · [Vite](vite.md)
- [@chatool/core](../../packages/core.md)

---

Up: [Consuming](README.md) · [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
