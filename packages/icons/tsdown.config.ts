import { defineChatoolConfig } from "../../tsdown.preset";

export default defineChatoolConfig({
  // One entry per icon → one `dist/<IconName>.{mjs,cjs,d.mts,d.cts}` each, served
  // by the `./*` wildcard subpath export. The glob matches the SVGR-generated
  // `src/*.tsx` files only (the `src/index.ts` barrel `.ts` is excluded, so it is
  // not built or published). `react` / `react/jsx-runtime` (peer) is externalized
  // automatically by the preset.
  entry: ["src/*.tsx"],
});
