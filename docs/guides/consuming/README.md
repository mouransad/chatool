# Consuming the packages

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → **Consuming**

`@chatool/core`, `@chatool/utils`, `@chatool/icons`, and `@chatool/ui` work the
same in every framework: import the theme CSS once, mount `ChatoolProvider` at
the app root, then use components/hooks normally. The only part that differs per
framework is **where you mount `ChatoolProvider`** (and the Vite `"use client"`
build warning).

## Install (any framework)

```bash
pnpm add @chatool/utils @chatool/ui @chatool/icons @chatool/core
pnpm add -D tailwindcss        # (optional) peer of @chatool/core
# react / react-dom are peers of utils + ui (your app already has them)
```

Then import the CSS in your global stylesheet:

```css
@import "tailwindcss";
@import "@chatool/core/styles.css";
```

## Pick your framework

| Framework                                      | Where you mount `ChatoolProvider` |
| ---------------------------------------------- | --------------------------------- |
| [Next.js App Router](nextjs-app-router.md)     | `app/layout.tsx`                  |
| [Next.js Pages Router](nextjs-pages-router.md) | `pages/_app.tsx`                  |
| [Vite SPA](vite.md)                            | `main.tsx` (app root)             |

## Related

- [@chatool/core](../../packages/core.md) · [@chatool/ui](../../packages/ui.md)

---

Up: [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
