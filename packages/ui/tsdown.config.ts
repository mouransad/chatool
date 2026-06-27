import { defineChatoolConfig } from "../../tsdown.preset";

export default defineChatoolConfig({
  entry: {
    button: "src/button.tsx",
  },
  // react / react-dom (peers), @chatool/utils, radix-ui and cva (deps) —
  // including `react/jsx-runtime` — are externalized automatically.
});
