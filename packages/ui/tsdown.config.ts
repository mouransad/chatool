import { defineChatoolConfig } from "../../tsdown.preset";

export default defineChatoolConfig({
  entry: {
    // Key = published subpath (`./button`); source lives in the buttons/ family
    // directory. tsdown names output by the entry key, not the path.
    button: "src/buttons/button/index.tsx",
  },
  // react / react-dom (peers), @chatool/utils, radix-ui and cva (deps) —
  // including `react/jsx-runtime` — are externalized automatically.
});
