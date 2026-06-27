# AI agents

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → **AI agents**

This repo is set up so **any** AI coding tool loads the same project rules,
without duplicating content that would drift out of sync.

## The strategy: one canonical file + thin shims

[`AGENTS.md`](../AGENTS.md) at the repo root is the **single source of truth**.
Every tool-specific file is a short pointer to it. Edit `AGENTS.md` (or a
per-package `AGENTS.md`) — never the shims.

```
AGENTS.md                          ← canonical (full rules)
├─ CLAUDE.md                       → `@AGENTS.md` import
├─ GEMINI.md                       → "read AGENTS.md"
├─ .github/copilot-instructions.md → pointer + inlined hard rules
├─ .cursor/rules/chatool.mdc      → alwaysApply rule → AGENTS.md
└─ packages/*/AGENTS.md            → package-scoped rules (nearest wins)
```

## Tool → file map

| Tool                                   | File it reads                      | How it's wired here                                                                     |
| -------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| Claude Code                            | `CLAUDE.md` (+ nested)             | imports `AGENTS.md` via `@AGENTS.md`; reads nested `packages/*/AGENTS.md` automatically |
| Cursor                                 | `AGENTS.md`, `.cursor/rules/*.mdc` | native `AGENTS.md` support + an `alwaysApply` rule that points to it                    |
| GitHub Copilot                         | `.github/copilot-instructions.md`  | pointer **plus** inlined hard rules (Copilot doesn't follow links)                      |
| Gemini (CLI / Code Assist)             | `GEMINI.md`                        | one-line pointer to `AGENTS.md`                                                         |
| Codex / Zed / Jules / Aider / Windsurf | `AGENTS.md`                        | read the canonical file natively                                                        |

Any tool not listed: point it at `AGENTS.md` — that's the contract.

## Why this layout

- **No drift:** rules exist once. The Copilot file is the only intentional
  partial duplication (it inlines ~5 rules because Copilot can't follow links).
- **Monorepo scoping:** `packages/*/AGENTS.md` carries rules that only apply
  inside a package (e.g. "styles is placeholder CSS"; "api has no `process.env`").
  Agents that honor nearest-file precedence pick these up automatically.

## Docs shipped to consumers (node_modules)

The wiring above is for AI tools working **in this repo**. There's a second
audience: AI tools (and humans) working in a **downstream app** that merely
`pnpm add`ed an `@chatool/*` package. They can't see `docs/` — only what's in
`node_modules`. So every package ships its own docs inside its npm tarball:

```
node_modules/@chatool/<pkg>/
├─ README.md   ← canonical, complete, self-contained reference (npm ships it)
├─ llms.txt    ← llmstxt.org-style LLM entry point (listed in `files`)
└─ dist/ …     ← code + .d.ts types
```

- **`packages/<pkg>/README.md` is the single canonical per-package doc.** It must
  be **self-contained** (no `../../docs` links, which break once installed). The
  central `docs/packages/<pkg>.md` is just a pointer to it; the future docs website
  aggregates these READMEs plus the central guides.
- **`llms.txt` is generated, never hand-edited.**
  [`scripts/gen-llms.mjs`](../scripts/gen-llms.mjs) builds it from the README's
  `## For AI agents` section + `package.json` (name, description, exports, peers).
  Run `pnpm gen:llms`; it also runs on `pnpm build` (`postbuild`) and at publish
  time (each package's `prepack`). A root `llms.txt` indexes all packages for the
  future website.

This keeps a single source of truth (the README) while putting complete,
AI-readable guidance exactly where a consumer's agent will look.

## Adding a new tool

1. Find the file/convention that tool reads.
2. Add a short pointer to `AGENTS.md` (copy `GEMINI.md` as a template).
3. Add a row to the table above.

## Related

- [Conventions](conventions.md) — the human-facing version of the same rules.
- [Contributing](guides/contributing.md)

---

Up: [Docs](README.md) · [Repo README](../README.md)
