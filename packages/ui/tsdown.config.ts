import { defineKarnamehConfig } from "../../tsdown.preset";

export default defineKarnamehConfig({
  entry: {
    index: "src/index.ts",
    button: "src/button.tsx",
    "dropdown-menu": "src/dropdown-menu.tsx",
    "bottom-sheet": "src/bottom-sheet.tsx",
  },
  // react / react-dom (peers), @karnameh/utils, @karnameh/icons, radix-ui and
  // cva (deps) — including `react/jsx-runtime` — are externalized automatically.
});
