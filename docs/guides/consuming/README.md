# Consuming the packages

> **You are here:** [Repo README](../../../README.md) → [Docs](../../README.md) → [Guides](../README.md) → **Consuming**

`@chatool/styles`, `@chatool/utils`, and `@chatool/ui` work the same in every
framework: import the CSS once, then use components/hooks normally. The part that
differs is **where you call [@chatool/api](../../packages/api.md) and where
`baseURL` comes from**.

## Install (any framework)

```bash
pnpm add @chatool/styles @chatool/utils @chatool/ui @chatool/api
pnpm add -D tailwindcss        # peer of @chatool/styles
# react / react-dom are peers of utils + ui (your app already has them)
```

Then import the CSS in your global stylesheet:

```css
@import "tailwindcss";
@import "@chatool/styles/styles.css";
```

## Pick your framework

| Framework | Where you call the API | `baseURL` source |
| --- | --- | --- |
| [Next.js App Router](nextjs-app-router.md) | RSC / server action | `process.env` |
| [Next.js Pages Router](nextjs-pages-router.md) | `getServerSideProps` / API route | `process.env` |
| [Vite SPA](vite.md) | client-side | `import.meta.env` |

## Related

- [@chatool/styles](../../packages/styles.md) · [@chatool/ui](../../packages/ui.md) ·
  [@chatool/api](../../packages/api.md)

---

Up: [Guides](../README.md) · [Docs](../../README.md) · [Repo README](../../../README.md)
