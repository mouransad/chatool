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
├─ .cursor/rules/karnameh.mdc      → alwaysApply rule → AGENTS.md
└─ packages/*/AGENTS.md            → package-scoped rules (nearest wins)
```

## Tool → file map

| Tool | File it reads | How it's wired here |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` (+ nested) | imports `AGENTS.md` via `@AGENTS.md`; reads nested `packages/*/AGENTS.md` automatically |
| Cursor | `AGENTS.md`, `.cursor/rules/*.mdc` | native `AGENTS.md` support + an `alwaysApply` rule that points to it |
| GitHub Copilot | `.github/copilot-instructions.md` | pointer **plus** inlined hard rules (Copilot doesn't follow links) |
| Gemini (CLI / Code Assist) | `GEMINI.md` | one-line pointer to `AGENTS.md` |
| Codex / Zed / Jules / Aider / Windsurf | `AGENTS.md` | read the canonical file natively |

Any tool not listed: point it at `AGENTS.md` — that's the contract.

## Why this layout

- **No drift:** rules exist once. The Copilot file is the only intentional
  partial duplication (it inlines ~5 rules because Copilot can't follow links).
- **Monorepo scoping:** `packages/*/AGENTS.md` carries rules that only apply
  inside a package (e.g. "styles is placeholder CSS"; "api has no `process.env`").
  Agents that honor nearest-file precedence pick these up automatically.

## Adding a new tool

1. Find the file/convention that tool reads.
2. Add a short pointer to `AGENTS.md` (copy `GEMINI.md` as a template).
3. Add a row to the table above.

## Related

- [Conventions](conventions.md) — the human-facing version of the same rules.
- [Contributing](guides/contributing.md)

---

Up: [Docs](README.md) · [Repo README](../README.md)
