# AGENTS.md — @karnameh/styles

Package-scoped rules. Root rules still apply: [../../AGENTS.md](../../AGENTS.md).
Human docs: [docs/packages/styles.md](../../docs/packages/styles.md).

- **CSS-only, no build.** No tsdown, no JS. The `build`/`typecheck` scripts are
  intentional no-ops.
- The shipped `styles.css` / `theme.css` are **placeholders** mirroring a
  standard shadcn + Tailwind v4 token layer. Replace with the exact CSS from the
  landing repo's `src/styles/main.css` — keep the same two-file split.
- `styles.css` must `@import "./theme.css"` (single source for tokens). Keep base
  `@layer` rules in `styles.css`; keep tokens + `:root`/`.dark` vars in `theme.css`.
- Do **not** add `@import "tailwindcss";` here — the consumer adds that.
- `tailwindcss` is a `peerDependency`, never a dependency.
- Both files stay exported (`./styles.css`, `./theme.css`) and listed in `files`.
