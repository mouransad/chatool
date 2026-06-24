# GEMINI.md

The AI instructions for this repository are maintained in one canonical file:
**[AGENTS.md](AGENTS.md)**.

Read `AGENTS.md` before making changes — it has the build/test commands and the
hard rules (tsdown preserves `"use client"`/`"use server"`, but re-export barrels
need the directive at the top of their own source; `@chatool/api` stays
framework-agnostic with no `process.env`/`"use server"`; keep `exports` maps
correct; every functional change needs a Changeset).

Each package also has a `packages/*/AGENTS.md` with package-scoped rules. Prefer
editing those canonical files over duplicating guidance here.
