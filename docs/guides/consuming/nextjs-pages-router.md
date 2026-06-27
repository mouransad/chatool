# Next.js Pages Router

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → [Consuming](README.md) → **Pages Router**

Inject `baseURL` in `getServerSideProps` (or an API route) — server-side env.

## Global CSS

```css
/* styles/globals.css imported in pages/_app.tsx */
@import "tailwindcss";
@import "@chatool/core/styles.css";
```

## `getServerSideProps`

```tsx
// pages/index.tsx
import type { GetServerSideProps } from "next";
import { createServices, type GetBannersResponse } from "@chatool/api";

export const getServerSideProps: GetServerSideProps<{
  data: GetBannersResponse;
}> = async () => {
  const services = createServices({ baseURL: process.env.API_BASE_URL! });
  const data = await services.clutch.getBanners({ placement: "home" });
  return { props: { data } };
};
```

## API route

```ts
// pages/api/banners.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServices } from "@chatool/api";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const services = createServices({ baseURL: process.env.API_BASE_URL! });
  res.json(await services.clutch.getBanners());
}
```

## Related

- [App Router](nextjs-app-router.md) · [Vite](vite.md)
- [@chatool/api](../../packages/api.md)

---

Up: [Consuming](README.md) · [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
