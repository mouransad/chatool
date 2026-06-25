# Packages

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → **Packages**

The **canonical, complete reference for each package is its own
`packages/<pkg>/README.md`** — which ships inside the npm tarball (plus a generated
`llms.txt`), so the docs are available in consumers' `node_modules`. The pages
below are thin pointers to those READMEs. For install + per-framework wiring, see
the [consuming guides](../guides/consuming/README.md).

| Package | Page | One-liner |
| --- | --- | --- |
| `@chatool/styles` | [styles.md](styles.md) | CSS-only Tailwind v4 theme + shadcn tokens |
| `@chatool/utils` | [utils.md](utils.md) | `cn` + hooks |
| `@chatool/ui` | [ui.md](ui.md) | shadcn components |
| `@chatool/icons` | [icons.md](icons.md) | SVGR-generated React SVG icons |
| `@chatool/api` | [api.md](api.md) | framework-agnostic axios client + services |
| `@chatool/core` | [core.md](core.md) | app-root `ChatoolProvider` (theme/dark-mode) |

Each package also has:

- the **canonical** complete reference `README.md` (`packages/<pkg>/README.md`,
  shipped to npm) + a generated `llms.txt`,
- package-scoped agent rules (`packages/<pkg>/AGENTS.md`).

---

Up: [Docs](../README.md) · [Repo README](../../README.md)
