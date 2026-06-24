---
name: rename-project
description: Re-brand this whole monorepo from one name/scope to another (e.g. fork it and rename `@chatool/*` → `@your-scope/*`). Use when the user wants to rename the project, change the npm scope, re-brand a fork, or replace every occurrence of the current brand token across package names, imports, exports maps, docs, AI shims, identifiers, and file/dir names.
---

# rename-project

Re-brands the entire monorepo from one **token** to another in a single,
case-aware pass — the npm scope (`@old/*`), lowercase slugs, PascalCase
identifiers (`defineOldConfig`, `OldLogoIcon`), display strings, and file/dir
names. This is the fork-and-customize path for goal #1 of this repo: clone it,
rename it, publish to your own registry. The engine is
[`rename.mjs`](rename.mjs); this file is the runbook around it.

Work from the repo root.

## 1. Choose the new token and preview

Pick the new brand token (lowercase, e.g. `chatool`). Check the current footprint:

```bash
rg -ic chatool                  # how many lines mention the old token
node .claude/skills/rename-project/rename.mjs <new> --dry   # what would change
```

The old token is auto-detected from the root `package.json` scope; override with
`--old <oldToken>` if needed. The dry run lists every file it would edit and
every path it would rename — **read it** before committing.

## 2. Run the rename

```bash
node .claude/skills/rename-project/rename.mjs <new>
```

This rewrites tracked file contents (case-preserving: `old→new`, `Old→New`,
`OLD→NEW`) and `git mv`s any path whose name contains the token. It skips
`node_modules/`, `dist/`, `.git/`, gitignored files, binaries, and
`pnpm-lock.yaml` (regenerated below). It also covers two known-untracked configs
if present: `.npmrc` and `.claude/settings.local.json`.

## 3. Re-brand the root name (optional)

The root `package.json` name is just the token, so the pass renames it to
`<new>`. If you want a different root name, edit the root `package.json` `"name"`
field by hand.

## 4. Point at your registry

Update [`.npmrc`](../../../.npmrc.example) / `.npmrc.example` so the new
`@<new>:registry=…` line targets the registry you'll publish the fork to. Keep
the repo **registry-agnostic** — never hardcode a registry elsewhere.

## 5. Reinstall

```bash
pnpm install
```

Relinks the renamed `@<new>/*` workspace packages and regenerates
`pnpm-lock.yaml` under the new names.

## 6. Changeset

Renaming the published scope is **breaking** for consumers. Add a major
Changeset for every renamed package:

```bash
pnpm changeset        # or write .changeset/<slug>.md by hand
```

## 7. Verify

```bash
pnpm build && pnpm typecheck && pnpm lint
grep -ri <old> . --exclude-dir={node_modules,dist,.git}   # expect: no output
```

Then run the [`sync-docs`](../sync-docs/SKILL.md) skill — its package-scope greps
now read `@<new>/*` and must pass, confirming docs and AI shims have no drift.
