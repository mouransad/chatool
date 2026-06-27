// Populate `svg/` from the Material Symbols weight-400 SVG set.
//
// Source: `@material-symbols/svg-400` (a version-pinned, offline mirror of Google
// Material Symbols at weight 400) — devDependency only, nothing is bundled from it.
// For every base icon in `ICONS` we copy four style variants into `svg/` as
// `<base>-<style>.svg`, which SVGR (`pnpm generate`) turns into PascalCase
// components served by the `./*` wildcard export, e.g. `home-outlined.svg` →
// `@chatool/icons/HomeOutlined`.
//
// Weight is fixed at 400: SVGR emits static components, so weight can't be a
// runtime prop (it changes the path geometry). Size (`1em` / `size-*`) and color
// (`currentColor` / `text-*`) stay runtime-tunable.
//
// Run with `pnpm --filter @chatool/icons sync:icons`, then commit `svg/`.
// To extend the set: add a base name below (snake_case, as named upstream) and
// re-run. The build never runs this — `svg/` is the committed source of truth.

import { createRequire } from "node:module";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve("@material-symbols/svg-400/package.json"));
const svgDir = join(dirname(fileURLToPath(import.meta.url)), "..", "svg");

// Output style → source location. `filled` is the fill axis of the outlined set.
const STYLES = [
  { style: "outlined", dir: "outlined", suffix: "" },
  { style: "rounded", dir: "rounded", suffix: "" },
  { style: "sharp", dir: "sharp", suffix: "" },
  { style: "filled", dir: "outlined", suffix: "-fill" },
];

// Curated common set (snake_case base names, as named upstream). Extend freely.
const ICONS = [
  // arrows / navigation (Material Symbols dedupes some aliases — e.g. expand_more
  // is the same glyph as keyboard_arrow_down, done as check, clear as close)
  "arrow_back", "arrow_forward", "arrow_upward", "arrow_downward",
  "chevron_left", "chevron_right", "keyboard_arrow_down", "keyboard_arrow_up",
  "keyboard_arrow_left", "keyboard_arrow_right", "menu", "close", "more_vert",
  "more_horiz", "unfold_more",
  // actions
  "check", "check_circle", "add", "remove", "edit", "delete", "save",
  "content_copy", "content_paste", "share", "download", "upload", "refresh",
  "search", "filter_list", "sort", "settings", "undo", "redo",
  // chat / communication
  "chat", "chat_bubble", "forum", "send", "mail", "notifications", "call",
  // status / feedback
  "info", "warning", "error", "help", "visibility", "visibility_off", "lock",
  "lock_open", "star", "favorite", "thumb_up", "thumb_down",
  // media
  "play_arrow", "pause", "stop", "volume_up", "volume_off", "mic", "mic_off",
  "image", "attach_file",
  // user / app
  "person", "group", "account_circle", "login", "logout", "home", "dashboard",
  "calendar_today", "schedule", "progress_activity", "dark_mode", "light_mode",
  "language", "location_on", "link", "open_in_new", "bookmark", "folder",
  "description",
];

async function main() {
  await rm(svgDir, { recursive: true, force: true });
  await mkdir(svgDir, { recursive: true });

  let written = 0;
  const missing = [];

  for (const base of ICONS) {
    const kebab = base.replace(/_/g, "-");
    for (const { style, dir, suffix } of STYLES) {
      const src = join(pkgDir, dir, `${base}${suffix}.svg`);
      try {
        const svg = await readFile(src, "utf8");
        await writeFile(join(svgDir, `${kebab}-${style}.svg`), svg);
        written += 1;
      } catch {
        missing.push(`${dir}/${base}${suffix}.svg`);
      }
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n✖ ${missing.length} source SVG(s) not found in @material-symbols/svg-400:\n` +
        missing.map((m) => `  - ${m}`).join("\n") +
        `\n\nCheck the name against ${pkgDir}\n`,
    );
    process.exit(1);
  }

  const total = (await readdir(svgDir)).length;
  console.log(
    `✔ Wrote ${written} SVGs for ${ICONS.length} icons × ${STYLES.length} styles ` +
      `(${total} files) to svg/`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
