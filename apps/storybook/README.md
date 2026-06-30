# Storybook (internal)

Interactive catalog for the `@chatool/*` component packages. **Private — never
published.**

## Run it

```bash
# from the repo root
pnpm storybook   # → http://localhost:6006
```

Stories import the packages from `src` — Storybook dev-aliases every `@chatool/*`
specifier to package **source** (see [`dev-aliases.mjs`](../../dev-aliases.mjs),
consumed by [`.storybook/main.ts`](.storybook/main.ts)). So editing a component's
`src/` hot-reloads live; **no `pnpm build` and no `tsdown` watch needed.**

A static build:

```bash
pnpm build-storybook   # outputs apps/storybook/storybook-static/
```

## What's documented

- **UI** — `Button` (variants/sizes via controls + autodocs), `DropdownMenu`,
  `BottomSheet`.
- **Icons** — gallery of the `@chatool/icons` set with sizing/color demos.
- **Design / Tokens** — `@chatool/core` color tokens (light + dark).
- **Core** — `@chatool/core`'s `ChatoolProvider` + `useTheme`.

Use the **theme toggle** in the toolbar to view any story in light or dark. It
sets the `.dark` class `@chatool/core` keys its tokens off.

## Add a story

Drop a `*.stories.tsx` in [`stories/`](stories/) and import the component from
its published subpath (e.g. `@chatool/ui/button`). Add `tags: ["autodocs"]` to
generate a Docs page. Tailwind v4 is wired via `@tailwindcss/vite`; the preview
CSS lives in [`.storybook/preview.css`](.storybook/preview.css).

Stories don't auto-discover new exports, and the icon gallery is enumerated by
hand — after adding a `@chatool/ui` component or a `@chatool/icons` icon, run the
**`/sync-storybook`** skill to catch/fix missing coverage.
