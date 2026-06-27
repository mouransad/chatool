# Local development against another repo

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Guides](README.md) → **Local development**

Three ways to iterate on these packages from a consuming app **before
publishing**. Build first (`pnpm build`), or run `pnpm dev` here for watch mode.

## Option A — `pnpm link` (best for active iteration)

From the consuming app, link each package by its directory:

```bash
# in the consuming app
pnpm link /home/mehran/projects/chatool/chatool/packages/ui
pnpm link /home/mehran/projects/chatool/chatool/packages/utils
pnpm link /home/mehran/projects/chatool/chatool/packages/core
pnpm link /home/mehran/projects/chatool/chatool/packages/api
```

Keep `pnpm dev` running in this repo; rebuilds flow straight into the app.
Unlink later with `pnpm unlink <name>` (or remove the linked entries and
reinstall).

> With `npm` instead of `pnpm`: run `npm link` inside each `packages/*`, then
> `npm link @chatool/ui @chatool/utils @chatool/core @chatool/api` in the
> app.

## Option B — `link:` / `file:` dependency

Point the app's `package.json` at the local build, then install:

```jsonc
{
  "dependencies": {
    "@chatool/ui": "link:../chatool/packages/ui",
    "@chatool/utils": "link:../chatool/packages/utils",
    "@chatool/core": "link:../chatool/packages/core",
    "@chatool/api": "link:../chatool/packages/api",
  },
}
```

## Option C — `pnpm pack` (closest to a real publish)

Produces the exact tarball that would be published — best for a final smoke test:

```bash
pnpm build
pnpm -r --filter "./packages/*" exec pnpm pack   # writes *.tgz in each package
# then in the consuming app:
pnpm add /home/mehran/projects/chatool/chatool/packages/ui/chatool-ui-0.0.0.tgz
```

Use `pnpm pack` (not bare `npm pack`) so the `workspace:` protocol on
`@chatool/utils` resolves to a real version in the tarball.

## Related

- [Publishing](publishing.md) — when you're ready to release for real.
- [Consuming guides](consuming/README.md) — framework wiring.

---

Up: [Guides](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
