---
name: sync-docs
description: Audit and fix documentation / changeset / AI-shim drift after code changes in this monorepo. Use after editing package exports, tsdown entries, directives, hard rules, commands, or adding/removing a package — or any time before declaring work "done" — to keep AGENTS.md, the per-tool shims (.github/copilot-instructions.md, GEMINI.md, .cursor), docs/, and .changeset/ consistent with the code.
---

# sync-docs

Keep documentation, the per-tool AI shims, and Changesets in lockstep with the
code. This repo's premise is **no drift**: rules live once in the canonical
[`AGENTS.md`](../../../AGENTS.md) and human docs mirror them
(see [docs/ai-agents.md](../../../docs/ai-agents.md)). This skill enforces that
contract. The canonical **sync map** lives in `AGENTS.md` ("Docs, shims &
changesets stay in sync") — this skill is its executable form.

Work from the repo root.

## 1. Scope the change

List what actually changed so you only touch the docs that matter:

```bash
git status --short
git diff --stat            # working tree
git diff --stat main...    # vs base branch (whole feature)
```

Bucket the touched paths: `packages/*/src` (exports/directives), `package.json`
`exports`, `tsdown.config.ts`, `AGENTS.md` (rules), new/removed packages, new AI
shims, root-level config.

## 2. Walk the sync map

For each bucket that changed, open the mapped targets and reconcile them with the
code as it is **now** (not how the docs describe it):

| Changed | Reconcile |
| --- | --- |
| Hard rule / command / package count in `AGENTS.md` | `.github/copilot-instructions.md` (inlines rules + count), `docs/conventions.md` |
| A package's `exports` / subpaths / `tsdown` entries / directives | `packages/<pkg>/AGENTS.md`, `docs/packages/<pkg>.md` (Exports table + Usage examples), `docs/guides/contributing.md`, `docs/conventions.md` |
| Add / remove a package | `AGENTS.md` table + count, root `README.md`, `docs/README.md`, `docs/packages/README.md`, Copilot shim count |
| Add / remove an AI-tool shim | `docs/ai-agents.md` table |
| Any functional change | a `.changeset/*.md` exists (see step 4) |

Rule of thumb: **edit canonical files, never hand-regenerate a shim** beyond the
rules Copilot intentionally inlines.

## 3. Always-on drift checks

Run these regardless of what changed — they catch stale text the diff doesn't
point at:

```bash
# (a) Package list/count agreement — should be identical everywhere
rg -n "@chatool/(styles|utils|ui|icons|api)" AGENTS.md README.md docs/README.md docs/packages/README.md .github/copilot-instructions.md
rg -ni "(four|five|six) .{0,20}packages" AGENTS.md README.md docs .github

# (b) Dead references to things that no longer exist
#     (e.g. removed barrels / deleted source files)
rg -n "src/index\.ts" docs .github            # UI/icons no longer have one
rg -n 'from "@chatool/(ui|icons)"' docs README.md .github   # root-barrel imports

# (c) Import examples must match each package's real exports map
for p in styles utils ui icons api; do
  echo "== $p =="; node -e "console.log(Object.keys(require('./packages/$p/package.json').exports))"
done
```

For each hit, confirm against the real `package.json` `exports` / `src/` and fix
the doc (or delete the dead line). Wildcard exports like `@chatool/icons/*` mean
"any icon name" — examples should use a real icon (e.g. `ChevronDownIcon`).

## 4. Changeset check

If the change is functional (not docs-only), ensure a Changeset exists and is
accurate:

```bash
ls .changeset/*.md            # exclude README.md / config.json
```

If missing, create one (`pnpm changeset`, or write `.changeset/<slug>.md` with
the standard frontmatter). If an **unreleased** changeset describes behavior this
change supersedes, update its prose so the eventual changelog isn't
self-contradictory.

## 5. Verify

```bash
pnpm build && pnpm typecheck && pnpm lint
```

Then re-run the step-3 greps — they should come back clean. Report a short
summary: which files were synced and confirmation that no drift remains. If
nothing was out of sync, say so explicitly.
