# Conventions

> **You are here:** [Repo README](../README.md) → [Docs](README.md) → **Conventions**

Rules to follow when changing code. AI agents: these are also summarized in
[AGENTS.md](../AGENTS.md).

## Package shape

Every buildable package has:

- `"type": "module"` and `sideEffects: false` (except `@chatool/core`, which
  marks `**/*.css` as side-effectful because it ships theme CSS).
- `"files": ["dist", "llms.txt"]` (core also ships its `.css` files).
  `README.md` is shipped automatically by npm. `llms.txt` is generated — see
  [docs shipped to consumers](ai-agents.md#docs-shipped-to-consumers-node_modules).
- a `build` (`tsdown`), `dev` (`tsdown --watch`), and `typecheck` (`tsc --noEmit`)
  script, plus `"prepack": "node ../../scripts/gen-llms.mjs ."`.
- `"publishConfig": { "access": "public" }` — **no registry** is hardcoded.

## Exports maps

Use explicit conditional `exports`. For each subpath provide both conditions:

```jsonc
"./button": {
  "import": { "types": "./dist/button.d.mts", "default": "./dist/button.mjs" },
  "require": { "types": "./dist/button.d.cts", "default": "./dist/button.cjs" }
}
```

When you add a component/hook/service that should be importable on its own:

1. add a `tsdown` entry for it,
2. add the matching `exports` subpath,
3. re-export it from the package barrel (`src/index.ts`) **only if that package
   still has one** — `@chatool/utils` keeps a `hooks` barrel, but `@chatool/ui`
   and `@chatool/icons` are subpath-only (no root barrel) so there is nothing to
   re-export from.

Keep `import`/`require` filenames consistent with the dual-output naming from
[Build & tooling](build-and-tooling.md).

## `"use client"` / `"use server"`

- React **hooks** and **client components** start with `"use client";`.
- Pure modules — `cn`, SVG icons, the api client/services — have **no** directive.
- tsdown preserves directives natively — but only at the top of an entry's own
  source. A **re-export-only barrel** (`packages/utils/src/hooks/index.ts`)
  carries `"use client";` explicitly; keep it there. (`@chatool/ui` is
  subpath-only — each component entry carries its own directive, no barrel.)
- `@chatool/api` must never contain `"use server"` — it stays framework-agnostic.

## Component structure (`@chatool/ui`)

Every hand-written `@chatool/ui` component lives in **its own directory** under
`packages/ui/src/`, named in **kebab-case**. The directory's `index.tsx` is both
the public surface (barrel) and the `tsdown` entry; everything else is internal.

> **Icons are exempt.** `@chatool/icons` is SVGR-generated, flat, and pure — it
> keeps its PascalCase one-file-per-icon layout and none of these rules apply.
> The ESLint rules below are scoped to `packages/ui/src/**` only; `@chatool/core`
> and `@chatool/utils` keep their existing conventions.

Worked example — `button`:

```
packages/ui/src/button/
  index.tsx           # "use client"; — tsdown ENTRY + public barrel
  button.tsx          # the single, default-exported arrow component (the view)
  button.types.ts     # ButtonProps + any other types (pure, no directive)
  button.variants.ts  # buttonVariants (cva) (pure, no directive)
  use-logic.ts        # the useLogic hook — ONLY when logic is non-trivial
```

Rules:

- **One component per file, default-exported, written as an arrow function.**
  ```tsx
  const Button = (props: ButtonProps) => {
    /* … */
  };
  export default Button;
  ```
- **Types live in a separate `*.types.ts`** (component-prefixed, e.g.
  `button.types.ts`), value-only modules like cva variants in `*.variants.ts`.
  Prefix every file with the component name; only `index.tsx` keeps a generic
  name. The type file may depend on the variants file (`VariantProps<typeof
buttonVariants>`) but **not vice-versa** — keep that dependency one-directional
  to avoid a cycle.
- **`index.tsx` re-exports the public surface** and, because it is the `tsdown`
  entry **and** a re-export-only barrel, it **must start with `"use client";`**
  (see the directive rule above — a barrel does not inherit the directive from
  the files it re-exports). The component keeps its `default`; a named alias is
  added for ergonomics and to satisfy the subpath's `default` + named contract:
  ```tsx
  "use client";
  export { default, default as Button } from "./button";
  export { buttonVariants } from "./button.variants";
  export type { ButtonProps } from "./button.types";
  ```
- **Separate logic from view.** Non-trivial component logic goes in a `useLogic`
  hook in `use-logic.ts` (kebab filename, camelCase `useLogic` export, starts
  with `"use client";`), so `*.tsx` stays presentational. **Skip the hook when
  the logic is trivial** — `button` has none, so it has no `use-logic.ts`.
- **Keep the `tsdown` entry key equal to the subpath** (`{ button:
"src/button/index.tsx" }`). tsdown names output from the entry **key**, so the
  key — not the source path — must stay `button` to keep `dist/button.*` and the
  `exports` map stable.

Enforcement (what ESLint can and can't check, scoped to `packages/ui/src/**`):

| Convention                         | Enforced by                                                     |
| ---------------------------------- | --------------------------------------------------------------- |
| Arrow-function components          | `react/function-component-definition` (error)                   |
| One component per file             | `react/no-multi-comp` (error)                                   |
| Kebab-case file names              | `unicorn/filename-case` (error)                                 |
| Arrow callbacks / concise bodies   | `prefer-arrow-callback`, `arrow-body-style` (error)             |
| Own directory + `index.tsx` barrel | doc convention (structural — not lintable)                      |
| Default-exported component file    | doc convention (no clean rule; the barrel re-exports named too) |
| Types/variants in separate files   | doc convention                                                  |
| Logic in `useLogic`                | doc convention                                                  |
| `"use client";` on the barrel      | doc convention (author discipline, like the hooks barrel)       |

Prettier is **formatting-only** and cannot enforce any of the above — don't add
structural rules to it.

## Dependencies: peer vs dep

- **peerDependencies:** libraries the consuming app already owns and must
  deduplicate — `react`, `react-dom`, `tailwindcss`.
- **dependencies:** everything else the package needs at runtime — `clsx`,
  `tailwind-merge`, `radix-ui`, `class-variance-authority`, `axios`, and
  `@chatool/{utils,icons}` (as `workspace:^`).
- Mirror peers in `devDependencies` so the package builds/typechecks in isolation.

## TypeScript

- Strict mode everywhere; honor `verbatimModuleSyntax` → use `import type` /
  `export type` for type-only symbols.
- Prefer real exported types over ambient globals (e.g. the api `GetBanners*`
  types are real exports).

## Formatting & linting

- **Prettier owns formatting.** Config lives in [`prettier.config.mjs`](../prettier.config.mjs)
  (defaults + [`prettier-plugin-tailwindcss`](https://github.com/tailwindlabs/prettier-plugin-tailwindcss),
  which sorts `className`/`cn`/`cva` class lists). Run `pnpm format` (or
  `pnpm format:check` to verify); `.prettierignore` skips generated output.
- **ESLint owns code quality, not style.** [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)
  is appended last in every ESLint config (root + both apps) so the two tools
  never disagree. The repo-wide rules are `no-unused-vars` /
  `consistent-type-imports` / react-hooks; a `packages/ui/src/**`-scoped block
  (`eslint-plugin-react` + `eslint-plugin-unicorn`) enforces the component
  standard above (arrow components, one-per-file, kebab filenames).
- **Enforced on commit.** A husky pre-commit hook runs `lint-staged`
  (`prettier --write` on staged files repo-wide + `eslint --fix` on `packages/**`).
  The hook installs via the root `prepare` script on `pnpm install`.

## Changesets

Every functional change ships with a Changeset:

```bash
pnpm changeset      # pick packages + bump type + summary
```

See [Publishing](guides/publishing.md) for the full release flow.

## Related

- [Build & tooling](build-and-tooling.md)
- [Contributing](guides/contributing.md) — applying these when adding things.

---

Up: [Docs](README.md) · [Repo README](../README.md)
