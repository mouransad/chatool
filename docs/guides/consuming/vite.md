# Vite SPA

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → [Consuming](README.md) → **Vite SPA**

Inject `baseURL` from `import.meta.env`; call client-side.

## Tailwind + global CSS

Install the Vite plugin and add it to the config:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import "tailwindcss";
@import "@chatool/styles/styles.css";
```

## Services factory

```ts
// src/lib/services.ts
import { createServices } from "@chatool/api";

export const services = createServices({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

## Call client-side

```tsx
// src/components/Banners.tsx
import { useEffect, useState } from "react";
import { services } from "../lib/services";
import type { GetBannersItem } from "@chatool/api";

export function Banners() {
  const [items, setItems] = useState<GetBannersItem[]>([]);
  useEffect(() => {
    services.clutch
      .getBanners({ placement: "home" })
      .then((r) => setItems(r.items));
  }, []);
  return <>{/* render items */}</>;
}
```

## Related

- [App Router](nextjs-app-router.md) · [Pages Router](nextjs-pages-router.md)
- [@chatool/api](../../packages/api.md)

---

Up: [Consuming](README.md) · [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
