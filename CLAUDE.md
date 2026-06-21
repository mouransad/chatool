# CLAUDE.md

The instructions for this repo are maintained in a single canonical file. Import
it:

@AGENTS.md

Notes for Claude Code specifically:

- This is a pnpm monorepo. Each package has its own `packages/*/AGENTS.md`, which
  Claude Code auto-loads when you work inside that package directory. The nearest
  file wins; root rules still apply.
- Do not duplicate rules here — edit [AGENTS.md](AGENTS.md) (or the relevant
  per-package `AGENTS.md`) so every tool stays in sync.
