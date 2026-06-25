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
| A package's `exports` / subpaths / `tsdown` entries / directives | `packages/<pkg>/AGENTS.md`, the canonical **`packages/<pkg>/README.md`** (Exports + Usage + "For AI agents"), then `pnpm gen:llms`, `docs/guides/contributing.md`, `docs/conventions.md` (`docs/packages/<pkg>.md` is just a pointer) |
| A `@chatool/ui` component or `@chatool/icons` icon | a Storybook story in `apps/storybook` — run the [`sync-storybook`](../sync-storybook/SKILL.md) skill |
| A package's `README.md` "For AI agents" / `package.json` `description` | `pnpm gen:llms` (regenerates `llms.txt`; never hand-edit it) |
| Add / remove a package | `AGENTS.md` table + count, root `README.md`, `docs/README.md`, `docs/packages/README.md`, Copilot shim count |
| Add / remove an AI-tool shim | `docs/ai-agents.md` table |
| Any functional change | a `.changeset/*.md` exists **and is accurate** (see step 4) |

This skill covers docs, shims, llms.txt, exports, and changesets; **Storybook
coverage** is its own check — run [`sync-storybook`](../sync-storybook/SKILL.md)
(or the umbrella [`sync`](../sync/SKILL.md), which runs both).

Rule of thumb: **edit canonical files, never hand-regenerate a shim** beyond the
rules Copilot intentionally inlines.

## 3. Always-on drift checks

Run these regardless of what changed — they catch stale text the diff doesn't
point at:

The package list is **derived from the filesystem** so these checks track new
packages (e.g. `core`) automatically — never hardcode the five originals. The
loops below use a `packages/*/` glob and node-internal iteration so they work the
same in **bash and zsh** (zsh doesn't word-split an unquoted `$var`).

```bash
ALT=$(ls packages | paste -sd'|' -)       # styles|utils|ui|icons|api|core

# (a) Package list/count agreement — should be identical everywhere
rg -n "@chatool/($ALT)" AGENTS.md README.md docs/README.md docs/packages/README.md .github/copilot-instructions.md
rg -ni "(four|five|six|seven|eight) .{0,20}packages" AGENTS.md README.md docs .github   # spelled-out count must equal `ls packages | wc -l`

# (b) Dead references to things that no longer exist
#     (e.g. removed barrels / deleted source files)
rg -n "src/index\.ts" docs .github            # UI/icons no longer have one
rg -n 'from "@chatool/(ui|icons)"' docs README.md .github   # root-barrel imports

# (c) Import examples must match each package's real exports map
for d in packages/*/; do
  p=${d#packages/}; p=${p%/}
  echo "== $p =="; node -e "console.log(Object.keys(require('./$d/package.json').exports))"
done

# (d) Shipped consumer docs: every package keeps "llms.txt" in `files`, then
#     regenerate (llms.txt is derived; never hand-edited). One node pass:
node -e '
  const fs = require("fs");
  for (const p of fs.readdirSync("packages")) {
    const f = (require("./packages/" + p + "/package.json").files) || [];
    if (!f.includes("llms.txt")) console.log(p + ": missing \"llms.txt\" in files");
  }
'
pnpm gen:llms                                   # regenerate; llms.txt is gitignored
rg -n '\.\./\.\./docs' packages/*/README.md     # shipped READMEs must be self-contained (expect none)

# (e) exports ↔ tsdown ↔ README agree. Every published subpath has a matching
#     tsdown entry (for built packages) and appears in the README; static (CSS)
#     exports must point at a file that exists.
node -e '
  const fs = require("fs"); let issues = 0;
  for (const p of fs.readdirSync("packages")) {
    const dir = "./packages/" + p;
    const pkg = require(dir + "/package.json");
    const subs = Object.keys(pkg.exports || {}).filter(k => k !== "./package.json" && k !== ".").map(k => k.slice(2));
    const hasTsdown = fs.existsSync(dir + "/tsdown.config.ts");
    const cfg = hasTsdown ? fs.readFileSync(dir + "/tsdown.config.ts", "utf8") : "";
    const readme = fs.existsSync(dir + "/README.md") ? fs.readFileSync(dir + "/README.md", "utf8") : "";
    const wildcard = subs.includes("*");                       // @chatool/icons uses ./*
    const noTsdown = (wildcard || !hasTsdown) ? [] : subs.filter(s => !cfg.includes(s));
    const noReadme = wildcard ? [] : subs.filter(s => !readme.includes(s));
    const missingFile = Object.entries(pkg.exports || {})
      .filter(([k, v]) => typeof v === "string" && k !== "./package.json")
      .filter(([, v]) => !v.includes("/dist/") && !fs.existsSync(dir + "/" + v.replace(/^\.\//, "")))
      .map(([k]) => k);
    if (noTsdown.length)    { console.log(p + ": subpaths missing a tsdown entry -> " + noTsdown.join(", ")); issues++; }
    if (noReadme.length)    { console.log(p + ": subpaths missing from README -> " + noReadme.join(", ")); issues++; }
    if (missingFile.length) { console.log(p + ": exports point to missing files -> " + missingFile.join(", ")); issues++; }
  }
  console.log(issues ? issues + " issue(s)" : "exports <-> tsdown <-> README in sync");
'
```

For each hit, confirm against the real `package.json` `exports` / `src/` and fix
the doc (or delete the dead line). Wildcard exports like `@chatool/icons/*` mean
"any icon name" — examples should use a real icon (e.g. `ChevronDownIcon`); icon
gallery coverage is checked by [`sync-storybook`](../sync-storybook/SKILL.md).

## 4. Changeset check — present **and accurate**

A Changeset is needed only when a **published** package changes — i.e. a file that
ships in some `packages/<pkg>` (its `src`/`package.json`/etc.). Docs-only edits,
and changes confined to `apps/*` (private), the root, `.claude/`, or `.github/`,
need **none** (nothing is versioned). Decide which it is:

```bash
# Which published packages did this change actually touch?
git diff --name-only main... | rg '^packages/([^/]+)/' -or '$1' | sort -u
```

If that list is empty → no changeset required; note it and move on. Otherwise
ensure a changeset exists **and** matches:

```bash
ls .changeset/*.md            # exclude README.md / config.json
# Inspect the frontmatter: the bumped @chatool/* packages should cover the list above.
rg -n '^"@chatool/' .changeset/*.md
```

Reconcile:
- **Missing** → create one (`pnpm changeset`, or write `.changeset/<slug>.md` with
  the standard frontmatter).
- **Wrong scope** → the changeset must bump exactly the published packages that
  changed (a consumer of `@chatool/ui` won't get a fix recorded only under
  `@chatool/utils`). Add/remove package lines to match.
- **Wrong bump** → breaking → `major`, new surface → `minor`, fix/internal →
  `patch`.
- **Stale prose** → if an **unreleased** changeset describes behavior this change
  supersedes, update its summary so the eventual changelog isn't
  self-contradictory.

## 5. Verify

```bash
pnpm build && pnpm typecheck && pnpm lint
```

Then re-run the step-3 greps — they should come back clean. Report a short
summary: which files were synced and confirmation that no drift remains. If
nothing was out of sync, say so explicitly.
