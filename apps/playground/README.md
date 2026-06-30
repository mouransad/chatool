# playground

Internal **Next.js 16** (App Router, React 19, Tailwind v4) app for developing
and eyeballing the `@chatool/*` packages. **Private — never published.**

It lives outside `packages/*` (in the `apps/*` workspace), so the library
pipeline (`pnpm build` / `typecheck` / `release`, all filtered to
`./packages/*`) ignores it.

## Dev loop

```bash
# from the repo root
pnpm playground   # next dev  (= pnpm --filter playground dev)
```

Open the URL Next prints, then edit a package's `src/` — it hot-reloads live.
Every `@chatool/*` specifier is resolved to package **source** via `tsconfig.json`
`paths` (Turbopack reads them natively, incl. the `@chatool/icons/*` wildcard) and
`transpilePackages` (in [`next.config.ts`](next.config.ts)) compiles that source,
so no `pnpm build` and no `tsdown` watch are needed.

## How the packages are wired

- **`@chatool/core` (CSS)** — its `styles.css` is imported in
  [`app/globals.css`](app/globals.css)
  after `@import "tailwindcss";`. Two `@source` directives register the
  `@chatool/ui` and `@chatool/icons` source so Tailwind generates the utility
  classes those components use (it skips `node_modules` otherwise).
- **`@chatool/ui` / `@chatool/icons` / `@chatool/utils`** — rendered in
  [`app/page.tsx`](app/page.tsx). Client components ship `"use client"`, so they
  drop into this Server Component directly.

## Scripts

| Script                               | What                                   |
| ------------------------------------ | -------------------------------------- |
| `pnpm --filter playground dev`       | `next dev`                             |
| `pnpm --filter playground build`     | production build                       |
| `pnpm --filter playground typecheck` | `tsc --noEmit`                         |
| `pnpm --filter playground lint`      | `eslint .` (flat `eslint-config-next`) |
