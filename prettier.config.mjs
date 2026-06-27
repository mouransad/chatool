/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 has no JS config; point the plugin at the CSS entry that runs
  // `@import "tailwindcss"` so it can resolve the canonical class order.
  tailwindStylesheet: "./packages/styles/styles.css",
  // Sort the class strings passed to these helpers too, not just `className`.
  tailwindFunctions: ["cn", "cva"],
};
