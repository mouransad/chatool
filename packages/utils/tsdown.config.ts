import { defineChatoolConfig } from "../../tsdown.preset.ts";

export default defineChatoolConfig({
  entry: {
    index: "src/index.ts",
    "hooks/index": "src/hooks/index.ts",
  },
});
