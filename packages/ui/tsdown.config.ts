import { defineChatoolConfig } from "../../tsdown.preset";

export default defineChatoolConfig({
  entry: {
    button: "src/button/index.tsx",
    "icon-button": "src/icon-button/index.tsx",
    fab: "src/fab/index.tsx",
    "button-group": "src/button-group/index.tsx",
    "toggle-button-group": "src/toggle-button-group/index.tsx",
  },
  // react / react-dom (peers), @chatool/utils, radix-ui and cva (deps) —
  // including `react/jsx-runtime` — are externalized automatically.
});
