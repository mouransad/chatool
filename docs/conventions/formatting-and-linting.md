# Formatting & linting

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Formatting & linting**

- **Prettier owns formatting.** Config lives in [`prettier.config.mjs`](../../prettier.config.mjs)
  (defaults + [`prettier-plugin-tailwindcss`](https://github.com/tailwindlabs/prettier-plugin-tailwindcss),
  which sorts `className`/`cn`/`cva` class lists). Run `pnpm format` (or
  `pnpm format:check` to verify); `.prettierignore` skips generated output.
- **ESLint owns code quality, not style.** [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)
  is appended last in every ESLint config (root + both apps) so the two tools
  never disagree. The repo-wide rules are `no-unused-vars` /
  `consistent-type-imports` / react-hooks; a `packages/ui/src/**`-scoped block
  (`eslint-plugin-react` + `eslint-plugin-unicorn`) enforces the
  [component standard](component-structure.md) (arrow components, one-per-file,
  kebab filenames).
- **Enforced on commit.** A husky pre-commit hook runs `lint-staged`
  (`prettier --write` on staged files repo-wide + `eslint --fix` on `packages/**`).
  The hook installs via the root `prepare` script on `pnpm install`.

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
