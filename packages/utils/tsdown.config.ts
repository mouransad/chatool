import { defineKarnamehConfig } from "../../tsdown.preset";

export default defineKarnamehConfig({
  entry: {
    index: "src/index.ts",
    "hooks/index": "src/hooks/index.ts",
  },
});
