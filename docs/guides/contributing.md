# Contributing

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Guides](README.md) → **Contributing**

Read [Conventions](../conventions/README.md) and [Build & tooling](../build-and-tooling.md)
first. Always finish by running the **`/sync`** skill — it reconciles docs, the
per-tool AI shims, `llms.txt`, exports, Storybook stories, and the Changeset, then
runs `pnpm build && pnpm typecheck && pnpm lint`. See [Skills](#skills) below.

## Add a component/hook/service subpath to a package

1. Create `src/<name>.tsx` (or `.ts`). Add `"use client";` only if it uses
   hooks/client APIs — see [Client vs Server Components](../conventions/client-server-components.md)
   (prefer Server Components for pure modules; a re-export-only barrel needs the
   directive at its own top). For an `@chatool/ui` component, use a per-component
   directory instead — see [Component structure](../conventions/component-structure.md).
2. Add it to the package's `tsdown.config.ts` `entry` map.
3. Add a matching `exports` subpath in `package.json` (ESM `.mjs`/`.d.mts` +
   CJS `.cjs`/`.d.cts`).
   For a new `@chatool/ui` component subpath, also map it to its `src` entry in
   both dev source maps so the internal apps hot-reload it: a line in
   [`dev-aliases.mjs`](../../dev-aliases.mjs) (Storybook/Vite) and a `paths` entry
   in [`apps/playground/tsconfig.json`](../../apps/playground/tsconfig.json)
   (playground/Turbopack).
4. Re-export from the package barrel (`src/index.ts`) **only if the package has
   one** — `@chatool/ui` and `@chatool/icons` are subpath-only (no root barrel).
5. Document it in the **canonical `packages/<pkg>/README.md`** (Exports + Usage +
   the "For AI agents" section), then regenerate the shipped AI index with
   `pnpm gen:llms`. Reconcile any other doc/shim the
   [sync map in `AGENTS.md`](../../AGENTS.md) lists (or run the `/sync-docs` skill).
   `docs/packages/<pkg>.md` is just a pointer — no content change needed.
6. For a new `@chatool/ui` component or `@chatool/icons` icon, add/extend a story
   in [`apps/storybook`](../../apps/storybook) — run the `/sync-storybook` skill
   (stories don't auto-discover new exports; the icon gallery is enumerated by hand).
7. Run **`/sync`** (or at minimum `pnpm build && pnpm typecheck && pnpm lint`, then
   `pnpm changeset`).

## Add a new package

1. `packages/<name>/` with `package.json` (`"type": "module"`,
   `sideEffects`, `files`, `exports`, `publishConfig.access`, peers/deps per the
   [peer-vs-dep rule](../conventions/dependencies.md)).
2. `tsconfig.json` extending `../../tsconfig.json`; `tsdown.config.ts` using
   `defineChatoolConfig`.
3. Add the canonical, self-contained `README.md` (complete reference incl. a
   "For AI agents" section) + `AGENTS.md` (copy an existing package's as a
   template). Add `"llms.txt"` to the package's `files` and a
   `"prepack": "node ../../scripts/gen-llms.mjs ."` script.
4. Add a thin `docs/packages/<name>.md` pointer page and link it from
   [docs/packages/README.md](../packages/README.md).
5. `pnpm gen:llms`, then build/typecheck/lint, add a Changeset.

## Update an AI rule

Edit [`AGENTS.md`](../../AGENTS.md) (or the relevant `packages/*/AGENTS.md`) —
never the per-tool shims. See [AI agents](../ai-agents.md).

## Skills

Repo skills automate the "no drift" contract (in `.claude/skills/`):

- **`/sync`** — the definition-of-done umbrella: runs `/sync-docs` + `/sync-storybook`
  then build/typecheck/lint. Use before declaring any change complete.
- **`/sync-docs`** — reconciles docs, the per-tool AI shims, `llms.txt`, exports
  maps, and the Changeset.
- **`/sync-storybook`** — every `@chatool/ui` subpath is storied and every
  `@chatool/icons` icon is in the gallery.
- **`rename-project`** — re-brand the `@chatool/*` scope for a fork.

## Related

- [Conventions](../conventions/README.md)
- [Publishing](publishing.md)

---

Up: [Guides](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
