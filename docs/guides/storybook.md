# Storybook

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Guides](README.md) → **Storybook**

The repo ships an internal **Storybook** catalog at
[`apps/storybook`](../../apps/storybook) — an interactive, auto-documented gallery
for the `@chatool/*` component packages. It's a **private** app (never published).

It uses **Vite** (`@storybook/react-vite`) with **Tailwind v4** (`@tailwindcss/vite`),
and consumes the packages through their built `dist` via `workspace:*` — exactly
like a real consumer.

## Run it

```bash
pnpm build       # build the @chatool/* dist the stories import (required first)
pnpm storybook   # → http://localhost:6006
```

Stories import the prebuilt `dist`, so `pnpm build` must run first. For live
component editing, run `pnpm dev` (tsdown watch) in another terminal — Vite HMR
picks up the rebuilt `dist`.

Static build (e.g. for hosting):

```bash
pnpm build-storybook   # outputs apps/storybook/storybook-static/
```

## What's documented

- **UI** — `Button` (variant/size controls + autodocs), `DropdownMenu`,
  `BottomSheet`.
- **Icons** — gallery of the `@chatool/icons` set (sizing + `currentColor`).
- **Design / Tokens** — `@chatool/styles` color tokens in light and dark.
- **Core** — `@chatool/core`'s `ChatoolProvider` + `useTheme`.

Use the **theme toggle** in the toolbar to view any story light or dark — it sets
the `.dark` class `@chatool/styles` keys its tokens off. (`@chatool/core`'s
`ChatoolProvider` drives that same class in a real app, so it's showcased in its
own story rather than applied globally, to avoid both toggling `.dark` at once.)

## Add a story

Add a `*.stories.tsx` under [`apps/storybook/stories/`](../../apps/storybook/stories)
and import the component from its published subpath (e.g. `@chatool/ui/button`).
Add `tags: ["autodocs"]` for a generated Docs page. Tailwind is wired in
[`.storybook/preview.css`](../../apps/storybook/.storybook/preview.css), which
`@source`s the component `dist` so their utility classes are generated.

---

Up: [Guides](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
