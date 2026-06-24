import { defineChatoolConfig } from "../../tsdown.preset";

export default defineChatoolConfig({
  entry: {
    button: "src/button.tsx",
    "dropdown-menu": "src/dropdown-menu.tsx",
    "bottom-sheet": "src/bottom-sheet.tsx",
  },
  // react / react-dom (peers), @chatool/utils, @chatool/icons, radix-ui and
  // cva (deps) — including `react/jsx-runtime` — are externalized automatically.
});
