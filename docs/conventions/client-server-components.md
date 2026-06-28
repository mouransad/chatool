# Client vs Server Components

> **You are here:** [Repo README](../../README.md) → [Docs](../README.md) → [Conventions](README.md) → **Client vs Server Components**

These packages are **registry-agnostic** and must work unchanged in **Next.js App
Router (RSC)**, **Next.js Pages Router**, **Vite SPA**, and other bundlers. This
page is the single source of truth for the `"use client"` / `"use server"` rules
and the **Server-Components-by-default** policy.

## TL;DR policy (conservative server-first)

- **A component that is _pure_ (props → JSX) ships with NO directive** → it can
  render as a React Server Component in Next App Router and works everywhere else.
- **A component that needs _client features_ ships with `"use client";`** → it's
  required for correctness in Next App Router, and is harmless in every other
  framework (see [the warning](#the-vite-build-warning)).
- **When in doubt, add `"use client";`.** The failure mode of _omitting_ it is a
  hard build error in App Router; the failure mode of _adding_ it is, at worst, a
  suppressible build warning in Vite. The asymmetry is deliberate.

## Why this is safe across frameworks

A top-level `"use client"` directive only has meaning in an **RSC-aware** bundler
(Next App Router). Everywhere else it is a **no-op at runtime**:

| Framework                | Pure (no directive)         | Interactive (`"use client"`)                       |
| ------------------------ | --------------------------- | -------------------------------------------------- |
| **Next.js App Router**   | renders as Server Component | required; marks the client boundary                |
| **Next.js Pages Router** | works (directive ignored)   | works (directive ignored)                          |
| **Vite SPA**             | works                       | works (one suppressible build warning — see below) |
| **webpack / others**     | works                       | works (no RSC semantics)                           |

The genuinely dangerous combination is the one this policy prevents: a component
that **uses client features but omits the directive**, imported by a Server
Component in App Router. Next then throws a build error such as:

> You're importing a component that needs `useState`. It only works in a Client
> Component, but none of its parents are marked with `"use client"`, so they're
> Server Components by default.

## Decision checklist — does this module need `"use client"`?

Add `"use client";` if the module does **any** of these:

- calls a React hook — `useState`, `useEffect`, `useRef`, `useReducer`,
  `useContext`, `useMemo`, `useCallback`, **or any custom hook** (e.g. a
  `useLogic` hook — see [below](#a-custom-hook-makes-the-caller-a-client-component));
- creates or consumes React **Context** (`createContext` / `useContext`);
- wires its **own event handlers** to elements (`onClick`, `onChange`, … defined
  inside the component, or forwarded via `{...props}` onto a DOM element);
- touches **browser/DOM APIs** — `window`, `document`, `localStorage`,
  `matchMedia`, `IntersectionObserver`, …;
- is a **class component**;
- imports a **client-only dependency** (e.g. `radix-ui` primitives, which ship
  their own `"use client"`).

If **none** apply, leave it directive-free — it's a Server Component.

> **Edge cases.** `useId` alone is safe in a Server Component. A component that
> only **passes `children` through** stays a Server Component. A component that
> **forwards an `onClick` prop onto a DOM element** is effectively client (it
> renders an interactive element), so mark it `"use client"`.

## Worked examples in this repo

- **Server (no directive):** `@chatool/icons/*` — pure SVG wrappers, `@chatool/utils`
  `cn`. These render anywhere, including as RSC.
- **Client (`"use client"`):** `@chatool/ui/button` (uses `radix-ui`'s `Slot` and
  forwards event handlers onto the element), `@chatool/core`'s `ChatoolProvider`
  (`useState`/`useEffect`/`localStorage`) and `useTheme` (`useContext`), and the
  `@chatool/utils/hooks` (they _are_ hooks).

## How tsdown preserves the directive (the entry rule)

tsdown preserves directives natively — **but only at the top of an entry's own
source.** A **re-export-only barrel does not inherit** the directive from the
files it re-exports. Therefore:

- **Client component** → its `index.tsx` barrel (the `tsdown` entry) **must**
  start with `"use client";`, _and_ the view file carries it too. Precedent:
  [`packages/utils/src/hooks/index.ts`](../../packages/utils/src/hooks/index.ts).
- **Server component** → **no directive anywhere** in the directory (entry or
  files).

See [Build & tooling](../build-and-tooling.md) for the bundler details.

## A custom hook makes the caller a Client Component

Calling **any** hook requires a Client Component. So the
[`useLogic` separation](component-structure.md) (logic in a hook, view in the
`.tsx`) keeps a _client_ component tidy — it does **not** turn the view into a
Server Component, because the view calls the hook. To get server rendering of a
mostly-static piece, use the composition pattern below instead.

## Composition: push the client boundary to the leaves

For **compound / wrapper** components, keep the wrapper a Server Component and
isolate interactivity in a small client leaf, passing server content through as
`children` (Server Components rendered into a Client Component's `children` are
still server-rendered):

```tsx
// wrapper.tsx — Server Component (no directive)
import ClientToggle from "./client-toggle";
const Panel = ({ children }: { children: React.ReactNode }) => (
  <section>
    <ClientToggle /> {/* the only client part */}
    {children} {/* stays server-rendered */}
  </section>
);
export default Panel;
```

For **atomic primitives** (Button, Input) this is overkill — they're either fully
interactive (mark client) or fully pure (leave server).

## The Vite build warning

When a consumer bundles a dependency whose published files contain `"use client"`,
**Rollup (and Vite) emit a build-time warning**, e.g.:

> Module level directives cause errors when bundled, "use client" in
> "…/button.mjs" was ignored.

It is **only a warning** — the code runs fine; the directive is simply stripped in
a non-RSC build. It is **not** emitted by our build; it surfaces in the
**consumer's** Vite/Rollup build. Most consumers never see it because
**`@vitejs/plugin-react` silences it automatically**. To suppress it manually:

```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        defaultHandler(warning);
      },
    },
  },
});
```

See the [Vite consuming guide](../guides/consuming/vite.md).

## Fork guidance (e.g. a future `@chatool/custom` package)

A fork adding complex components for use across multiple apps (Next + Vite) should
follow the same policy so nothing breaks per-framework:

1. Default every component to a **Server Component**; add `"use client";` only
   when the [checklist](#decision-checklist--does-this-module-need-use-client)
   says so.
2. For complex components, split: a server wrapper + small client leaves, so RSC
   consumers get maximal server rendering.
3. Keep the directive on **both** the client component file and its `index.tsx`
   entry barrel; keep pure files directive-free.
4. Tell Vite consumers the `MODULE_LEVEL_DIRECTIVE` warning is harmless (above).

---

Up: [Conventions](README.md) · [Docs](../README.md) · [Repo README](../../README.md)
