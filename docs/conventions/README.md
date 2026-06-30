# Conventions

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → **Conventions**

Rules to follow when changing code, one file per category. AI agents: these are
also summarized in [AGENTS.md](../../AGENTS.md) (and each
[`packages/*/AGENTS.md`](../../AGENTS.md)).

- [Material Design 3 tokens & theming](material-design.md) — the MD3 token
  system (`--md-sys-*` color/typescale/shape/elevation/state/motion), the Tailwind
  `@theme inline` mapping, and how consumers customize everything.
- [Package shape](package-shape.md) — the invariants every buildable package
  shares (`type: module`, `files`, scripts, `publishConfig`).
- [Exports maps](exports.md) — explicit conditional `exports`, and the steps to
  add an importable subpath.
- [Client vs Server Components](client-server-components.md) — the
  `"use client"` / `"use server"` rules, the **Server-Components-by-default**
  policy, the decision checklist, cross-framework compatibility (Next App Router /
  Pages Router / Vite / webpack), the Vite build warning, and fork guidance.
- [Component structure (`@chatool/ui`)](component-structure.md) — one directory
  per component, arrow functions, separate types/variants, `useLogic`.
- [Accessibility](accessibility.md) — the WAI-ARIA APG patterns components follow
  (native semantics, accessible names, `aria-*`, `asChild`) + consumer duties.
- [Dependencies: peer vs dep](dependencies.md) — which libraries are peers vs
  dependencies.
- [TypeScript](typescript.md) — strict mode, `verbatimModuleSyntax`, real
  exported types.
- [Formatting & linting](formatting-and-linting.md) — Prettier owns formatting,
  ESLint owns code quality, enforced on commit.
- [Changesets](changesets.md) — every functional change ships with one.

## Related

- [Build & tooling](../build-and-tooling.md)
- [Contributing](../guides/contributing.md) — applying these when adding things.

---

Up: [Docs](../README.md) · [Repo README](../../README.md)
