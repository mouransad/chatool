# playground

Internal **Next.js 16** (App Router, React 19, Tailwind v4) app for developing
and eyeballing the `@chatool/*` packages. **Private — never published.**

It lives outside `packages/*` (in the `apps/*` workspace), so the library
pipeline (`pnpm build` / `typecheck` / `release`, all filtered to
`./packages/*`) ignores it.

## Dev loop

The app imports the packages' **built `dist/`**, so build them once, then watch:

```bash
# from the repo root
pnpm build                      # produce every package's dist/ (first time)
pnpm dev                        # terminal 1: tsdown --watch across packages
pnpm --filter playground dev    # terminal 2: next dev   (or: pnpm playground)
```

Open the URL Next prints. Editing a package re-emits its `dist/`; refresh the
app to see it. (Rebuild manually with `pnpm --filter @chatool/<pkg> build` if
you aren't running `pnpm dev`.)

## How the packages are wired

- **`@chatool/core` (CSS)** — its `styles.css` is imported in
  [`app/globals.css`](app/globals.css)
  after `@import "tailwindcss";`. Two `@source` directives register the prebuilt
  `@chatool/ui` and `@chatool/icons` dist so Tailwind generates the utility
  classes baked into those components (it skips `node_modules` otherwise).
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
