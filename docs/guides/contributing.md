# Contributing

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Guides](README.md) → **Contributing**

Read [Conventions](../conventions.md) and [Build & tooling](../build-and-tooling.md)
first. Always finish with `pnpm build && pnpm typecheck && pnpm lint` and a
Changeset.

## Add a component/hook/service subpath to a package

1. Create `src/<name>.tsx` (or `.ts`). Add `"use client";` only if it uses
   hooks/client APIs — see the [`"use client"` rules](../conventions.md#use-client--use-server).
   (A re-export-only barrel needs the directive at its own top.)
2. Add it to the package's `tsdown.config.ts` `entry` map.
3. Add a matching `exports` subpath in `package.json` (ESM `.mjs`/`.d.mts` +
   CJS `.cjs`/`.d.cts`).
4. Re-export from the package barrel (`src/index.ts`) **only if the package has
   one** — `@chatool/ui` and `@chatool/icons` are subpath-only (no root barrel).
5. Document it: update the relevant [package page](../packages/README.md), and
   any shim/doc the [sync map in `AGENTS.md`](../../AGENTS.md) lists (or run the
   `/sync-docs` skill).
6. `pnpm build && pnpm typecheck && pnpm lint`, then `pnpm changeset`.

## Add a new package

1. `packages/<name>/` with `package.json` (`"type": "module"`,
   `sideEffects`, `files`, `exports`, `publishConfig.access`, peers/deps per the
   [peer-vs-dep rule](../conventions.md#dependencies-peer-vs-dep)).
2. `tsconfig.json` extending `../../tsconfig.json`; `tsdown.config.ts` using
   `defineChatoolConfig`.
3. Add `README.md` + `AGENTS.md` (copy an existing package's as a template).
4. Add a `docs/packages/<name>.md` page and link it from
   [docs/packages/README.md](../packages/README.md).
5. Build/typecheck/lint, add a Changeset.

## Update an AI rule

Edit [`AGENTS.md`](../../AGENTS.md) (or the relevant `packages/*/AGENTS.md`) —
never the per-tool shims. See [AI agents](../ai-agents.md).

## Related

- [Conventions](../conventions.md)
- [Publishing](publishing.md)

---

Up: [Guides](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
