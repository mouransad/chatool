import { defineKarnamehConfig } from "../../tsdown.preset";

export default defineKarnamehConfig({
  entry: {
    // Single tree-shakeable barrel. `react` / `react/jsx-runtime` (peer) is
    // externalized automatically by the preset.
    index: "src/index.ts",
  },
});
