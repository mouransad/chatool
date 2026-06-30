# Storybook

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Guides](README.md) → **Storybook**

The repo ships an internal **Storybook** catalog at
[`apps/storybook`](../../apps/storybook) — an interactive, auto-documented gallery
for the `@chatool/*` component packages. It's a **private** app (never published).

It uses **Vite** (`@storybook/react-vite`) with **Tailwind v4** (`@tailwindcss/vite`).
For a fast dev loop it **dev-aliases** every `@chatool/*` specifier to package
**source** (see [`dev-aliases.mjs`](../../dev-aliases.mjs), consumed by
[`.storybook/main.ts`](../../apps/storybook/.storybook/main.ts)); the published
packages still point at `dist`, so this affects the internal app only.

## Run it

```bash
pnpm storybook   # → http://localhost:6006
```

Stories import package **source**, so editing a component's `src/` hot-reloads
live — **no `pnpm build` and no `tsdown` watch needed.**

Static build (e.g. for hosting):

```bash
pnpm build-storybook   # outputs apps/storybook/storybook-static/
```

## What's documented

- **UI** — `Button` (variant/size controls + autodocs), `DropdownMenu`,
  `BottomSheet`.
- **Icons** — gallery of the `@chatool/icons` set (sizing + `currentColor`).
- **Design / Tokens** — `@chatool/core` color tokens in light and dark.
- **Core** — `@chatool/core`'s `ChatoolProvider` + `useTheme`.

Use the **theme toggle** in the toolbar to view any story light or dark — it sets
the `.dark` class `@chatool/core` keys its tokens off. (`@chatool/core`'s
`ChatoolProvider` drives that same class in a real app, so it's showcased in its
own story rather than applied globally, to avoid both toggling `.dark` at once.)

## Add a story

Add a `*.stories.tsx` under [`apps/storybook/stories/`](../../apps/storybook/stories)
and import the component from its published subpath (e.g. `@chatool/ui/button`).
Add `tags: ["autodocs"]` for a generated Docs page. Tailwind is wired in
[`.storybook/preview.css`](../../apps/storybook/.storybook/preview.css), which
`@source`s the component `src` so their utility classes are generated.

---

Up: [Guides](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
