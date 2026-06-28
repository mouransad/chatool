# Vite SPA

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → [Consuming](README.md) → **Vite SPA**

Add the Tailwind plugin, import the theme CSS, and mount `ChatoolProvider` at the
app root.

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

## Mount `ChatoolProvider` at the app root

```tsx
// src/main.tsx
import "./index.css";
import { createRoot } from "react-dom/client";
import { ChatoolProvider } from "@chatool/core";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <ChatoolProvider>
    <App />
  </ChatoolProvider>,
);
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
- [@chatool/core](../../packages/core.md)
- [Client vs Server Components](../../conventions/client-server-components.md)

---

Up: [Consuming](README.md) · [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
