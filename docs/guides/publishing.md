# Publishing

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Guides](README.md) → **Publishing**

Releases are managed with **Changesets**. The flow is registry-agnostic until you
add a `.npmrc`.

## 0. Forking? Re-brand first

This repo is meant to be forked and re-branded. Before you publish under your own
name, rename the `@chatool/*` scope (and every reference to it) to your own with
the **`rename-project`** skill — it does a case-aware replace across package
names, imports, exports maps, docs, AI shims, identifiers, and file/dir names in
one pass:

```bash
node .agents/skills/rename-project/rename.mjs <your-scope>
pnpm install
```

See [`.agents/skills/rename-project/SKILL.md`](../../.agents/skills/rename-project/SKILL.md)
for the full runbook (registry config, changeset, verification).

## 1. Pick a registry and configure `.npmrc`

The repo hardcodes **no** registry. Copy the documented template (kept out of
git via `.gitignore`) and fill it in:

```bash
cp .npmrc.example .npmrc
# edit: set @chatool:registry=... and the matching _authToken
```

Each package already declares `"publishConfig": { "access": "public" }`; add a
per-scope registry in `.npmrc` — npm, GitHub Packages, Verdaccio/Nexus/
Artifactory are all shown in [`.npmrc.example`](../../.npmrc.example).

## 2. Record changes

```bash
pnpm changeset      # choose packages + bump type, write a summary
```

Commit the generated file in `.changeset/`.

## 3. Version + changelog

```bash
pnpm version-packages   # changeset version — bumps versions, updates changelogs
```

## 4. Build + publish

```bash
pnpm release            # pnpm build && changeset publish
```

`changeset publish` runs through pnpm, so the `workspace:^` dependency of
`@chatool/ui` on `@chatool/utils` is rewritten to the published version
automatically. (This is why you must release through `pnpm release` and not a
bare `npm publish`.)

## Notes

- `README.md` is auto-included in every package tarball by npm — no `files`
  change needed.
- `@chatool/core` publishes its `.css` files (in its `files` field) alongside
  `dist`; the rest publish `dist`.

## Related

- [Local development](local-development.md) — iterate before publishing.
- [Architecture › workspace graph](../architecture.md) — why `workspace:^` needs
  rewriting.

---

Up: [Guides](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
