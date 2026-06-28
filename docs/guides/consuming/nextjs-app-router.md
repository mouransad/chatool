# Next.js App Router

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → [Consuming](README.md) → **App Router**

Import the theme CSS in your global stylesheet and mount `ChatoolProvider` in the
root layout.

## Global CSS

```css
/* app/globals.css */
@import "tailwindcss";
@import "@chatool/core/styles.css";
```

## Mount `ChatoolProvider` in the root layout

```tsx
// app/layout.tsx
import "./globals.css";
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

`ChatoolProvider` is a client component, but you can render it from this Server
Component layout — it creates a client boundary around `children`. Add
`suppressHydrationWarning` to `<html>` because the provider sets the theme class
imperatively.

Client components from [@chatool/ui](../../packages/ui.md) already ship
`"use client"`, so importing `<Button>` into a Server Component just works.

## Related

- [Pages Router](nextjs-pages-router.md) · [Vite](vite.md)
- [@chatool/core](../../packages/core.md)

---

Up: [Consuming](README.md) · [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
