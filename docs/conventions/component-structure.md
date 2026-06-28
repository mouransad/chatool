# Component structure (`@chatool/ui`)

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Component structure**

Every hand-written `@chatool/ui` component lives in **its own directory**, named
in **kebab-case**, grouped under a **family directory** (e.g. `packages/ui/src/buttons/`).
The directory's `index.tsx` is both the public surface (barrel) and the `tsdown`
entry; everything else is internal. Config shared across a family lives in one
file in the family dir (e.g. `src/buttons/config.ts`).

> **Icons are exempt.** `@chatool/icons` is SVGR-generated, flat, and pure — it
> keeps its PascalCase one-file-per-icon layout and none of these rules apply.
> The ESLint rules below are scoped to `packages/ui/src/**` only; `@chatool/core`
> and `@chatool/utils` keep their existing conventions.

Worked example — `button` (a **client** component; see
[Client vs Server Components](client-server-components.md) for when the directive
is needed):

```
packages/ui/src/buttons/        # family directory
  button/
    index.tsx         # tsdown ENTRY + public barrel
    button.tsx        # the single, default-exported arrow component (the view)
    button.types.ts   # ButtonProps + any other types (pure, no directive)
    button.variants.ts# buttonVariants (cva) (pure, no directive)
    use-logic.ts      # the useLogic hook — ONLY when logic is non-trivial
  config.ts           # shared family config (sizes / shape / class fragments)
  spinner.tsx         # shared helper component
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
- **`index.tsx` re-exports the public surface.** The component keeps its
  `default`; a named alias is added for ergonomics and to satisfy the subpath's
  `default` + named contract:
  ```tsx
  export { default, default as Button } from "./button";
  export { buttonVariants } from "./button.variants";
  export type { ButtonProps } from "./button.types";
  ```
- **The `"use client";` directive is conditional** (see
  [Client vs Server Components](client-server-components.md)). It is **not**
  automatic:
  - **Client component** (hooks/state/context/event-wiring/browser APIs/client-only
    deps): the view file **and** the `index.tsx` entry barrel each start with
    `"use client";` (tsdown only preserves the directive on the entry's own
    source — a barrel doesn't inherit it). `button` is a client component (it uses
    `radix-ui`'s `Slot` and forwards event handlers), so both carry it.
  - **Server component** (pure props → JSX): **no directive anywhere** in the
    directory. Prefer this whenever the component is pure.
- **Separate logic from view.** Non-trivial component logic goes in a `useLogic`
  hook in `use-logic.ts` (kebab filename, camelCase `useLogic` export, starts with
  `"use client";`), so `*.tsx` stays presentational. **Skip the hook when the
  logic is trivial** — `button` has none, so it has no `use-logic.ts`. Note that a
  component which **calls** `useLogic` is necessarily a **client** component (any
  hook call forces it) — the split organizes a client component, it does not make
  the view a Server Component.
- **Keep the `tsdown` entry key equal to the subpath** (`{ button:
"src/buttons/button/index.tsx" }`). tsdown names output from the entry **key**, so
  the key — not the source path — must stay `button` to keep `dist/button.*` and
  the `exports` map stable (the source can be nested in a family dir).

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
| Server-vs-client directive         | doc convention (author discipline; build/runtime is the check)  |

Prettier is **formatting-only** and cannot enforce any of the above — don't add
structural rules to it.

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
