# Next.js App Router

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → [Consuming](README.md) → **App Router**

Inject `baseURL` from a server env var; call the API in an RSC or a server action.

## Global CSS

```css
/* app/globals.css */
@import "tailwindcss";
@import "@karnameh/styles/styles.css";
```

## Services factory

```ts
// app/lib/services.ts
import { createServices } from "@karnameh/api";

export function getServices() {
  return createServices({ baseURL: process.env.API_BASE_URL! });
}
```

## Call in a Server Component

```tsx
// app/page.tsx  (runs on the server)
import { getServices } from "./lib/services";

export default async function Page() {
  const { items } = await getServices().clutch.getBanners({ placement: "home" });
  return <Banners items={items} />;
}
```

## Call in a server action

```ts
// app/actions.ts
"use server";
import { getServices } from "./lib/services";

export async function fetchBanners() {
  return getServices().clutch.getBanners();
}
```

Client components from [@karnameh/ui](../../packages/ui.md) already ship
`"use client"`, so importing `<Button>` into a Server Component just works.

## Related

- [Pages Router](nextjs-pages-router.md) · [Vite](vite.md)
- [@karnameh/api](../../packages/api.md)

---

Up: [Consuming](README.md) · [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
