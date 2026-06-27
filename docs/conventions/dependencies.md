# Dependencies: peer vs dep

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Dependencies**

- **peerDependencies:** libraries the consuming app already owns and must
  deduplicate — `react`, `react-dom`, `tailwindcss`.
- **dependencies:** everything else the package needs at runtime — `clsx`,
  `tailwind-merge`, `radix-ui`, `class-variance-authority`, `axios`, and
  `@chatool/{utils,icons}` (as `workspace:^`).
- Mirror peers in `devDependencies` so the package builds/typechecks in isolation.

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
