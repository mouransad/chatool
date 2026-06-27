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
@import "@chatool/core/styles.css";
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

## The `"use client"` build warning

`@chatool/*` client components ship a `"use client";` directive (required for
Next.js App Router). It is a **no-op in a Vite SPA** — the components render
normally. Vite/Rollup may print a harmless build warning like:

> Module level directives cause errors when bundled, "use client" in
> ".../button.mjs" was ignored.

You can ignore it. **`@vitejs/plugin-react` already silences it** (the config
above), so most apps never see it. To suppress it explicitly:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        defaultHandler(warning);
      },
    },
  },
});
```

## Related

- [App Router](nextjs-app-router.md) · [Pages Router](nextjs-pages-router.md)
- [@chatool/api](../../packages/api.md)
- [Client vs Server Components](../../conventions/client-server-components.md)

---

Up: [Consuming](README.md) · [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
