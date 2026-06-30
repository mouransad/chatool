import { defineChatoolConfig } from "../../tsdown.preset";

export default defineChatoolConfig({
  entry: {
    // Key = published subpath (`./button`); source lives in the buttons/ family
    // directory. tsdown names output by the entry key, not the path.
    button: "src/buttons/button/index.tsx",
    // INTERNAL chunk (no `exports` entry — not a public subpath). The press
    // ripple is the button family's only `"use client"` module; giving it its
    // own entry guarantees the directive is preserved as a distinct client
    // chunk (directive preservation is entry-level), so `button.mjs` can stay
    // directive-free (Server-Component-safe) while importing `./ripple.mjs` as a
    // client boundary. Don't expose `@chatool/ui/ripple`.
    ripple: "src/buttons/ripple.tsx",
  },
  // react / react-dom (peers), @chatool/utils, radix-ui and cva (deps) —
  // including `react/jsx-runtime` — are externalized automatically.
});
