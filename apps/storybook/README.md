# Storybook (internal)

Interactive catalog for the `@chatool/*` component packages. **Private — never
published.** Stories consume the packages through their built `dist` (via
`workspace:*`), exactly like a real consumer.

## Run it

```bash
# from the repo root
pnpm build       # build the @chatool/* dist the stories import
pnpm storybook   # → http://localhost:6006
```

The stories import the prebuilt `dist`, so `pnpm build` must have run first. For
live component editing, run `pnpm dev` (tsdown watch) in another terminal —
Vite HMR picks up the rebuilt `dist`.

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
