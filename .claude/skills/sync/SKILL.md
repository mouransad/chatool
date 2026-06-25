---
name: sync
description: The end-to-end "before you're done" check for this monorepo — orchestrates every no-drift audit (docs, AI shims, llms.txt, exports, changesets, and Storybook coverage) then runs the full build/typecheck/lint verify. Use before declaring any change complete, or when you want a single command that reconciles everything the sync map in AGENTS.md couples together.
---

# sync

The single **definition-of-done** entry point. This repo's premise is **no
drift**: a change isn't finished until every coupled file is reconciled (see the
sync map in [`AGENTS.md`](../../../AGENTS.md), hard rule #8). This skill sequences
the focused sub-skills so nothing is missed — each is also runnable on its own.

Work from the repo root.

## 1. Scope the change

```bash
git status --short
git diff --stat            # working tree
git diff --stat main...    # vs base branch (whole feature)
```

Bucket the touched paths so you know which sub-checks actually matter:
`packages/*/src` + `package.json` `exports` + `tsdown.config.ts` (→ docs/exports),
`AGENTS.md`/commands (→ shims), `@chatool/ui|icons` surface (→ Storybook),
functional code (→ changeset).

## 2. Run the docs / shims / exports / changeset audit

Run the [`sync-docs`](../sync-docs/SKILL.md) skill. It reconciles `AGENTS.md` ↔ the
per-tool shims (`.github/copilot-instructions.md`, `GEMINI.md`, `.cursor`) ↔
`docs/`, regenerates `llms.txt` (`pnpm gen:llms`), asserts each package's
`exports` ↔ `tsdown` ↔ README agree, and checks the Changeset is present **and
accurate**.

## 3. Run the Storybook coverage audit

Run the [`sync-storybook`](../sync-storybook/SKILL.md) skill — every `@chatool/ui`
subpath is storied and every published `@chatool/icons` icon is in the gallery.
Only material when the UI/icons surface changed, but it's cheap to run always.

## 4. Verify

```bash
pnpm build && pnpm typecheck && pnpm lint
```

If `apps/storybook` or any `@chatool/ui` / `@chatool/icons` changed, also:

```bash
pnpm build-storybook
```

## 5. Report

Give one consolidated summary: which files each sub-skill synced, that the
changeset is correct (or that none is needed — docs/skill-only changes touch
nothing shipped in a package's `files`), and that build/typecheck/lint pass. If
nothing was out of sync, say so explicitly.

---

Related skills: [`sync-docs`](../sync-docs/SKILL.md) ·
[`sync-storybook`](../sync-storybook/SKILL.md) ·
[`rename-project`](../rename-project/SKILL.md) (re-brand the scope, then run this).
