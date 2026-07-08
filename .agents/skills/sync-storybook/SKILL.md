---
name: sync-storybook
description: Audit and fix Storybook coverage drift in apps/storybook after adding/removing a @chatool/ui component or a @chatool/icons icon. Use whenever the UI or icons surface changes (a new subpath, a new SVG) — or before declaring work "done" — to keep every published component storied and every icon listed in the gallery.
---

# sync-storybook

Keep [`apps/storybook`](../../../apps/storybook) in lockstep with the **published**
component/icon surface. The catalog consumes the packages' built `dist` like a real
consumer, but stories don't auto-discover new exports — a new `@chatool/ui` subpath
needs a story, and `Icons.stories.tsx` enumerates icons **by hand**. This skill is
the executable check for that coupling. It's also run by the umbrella
[`sync`](../sync/SKILL.md) skill.

Work from the repo root.

## 1. UI component coverage

Every `@chatool/ui` subpath (from its `exports`, minus `./package.json`) must be
imported by some story file:

```bash
node -e '
  const fs = require("fs");
  const e = require("./packages/ui/package.json").exports;
  const subs = Object.keys(e).filter(k => k !== "./package.json").map(k => k.slice(2));
  const dir = "apps/storybook/stories";
  const blob = fs.readdirSync(dir).map(f => fs.readFileSync(dir + "/" + f, "utf8")).join("\n");
  const missing = subs.filter(s => !blob.includes("@chatool/ui/" + s));
  console.log(missing.length ? "MISSING ui stories: " + missing.join(", ") : "ui stories in sync");
'
```

## 2. Icons gallery coverage

Every published icon (`packages/icons/src/*.tsx`; the SVGR `index.ts` barrel is
`.ts`, so it's excluded) must appear in
[`apps/storybook/stories/Icons.stories.tsx`](../../../apps/storybook/stories/Icons.stories.tsx).
The check also flags listed icons that no longer exist:

```bash
node -e '
  const fs = require("fs");
  const icons = fs.readdirSync("packages/icons/src")
    .filter(f => f.endsWith(".tsx")).map(f => f.replace(/\.tsx$/, ""));
  const story = fs.readFileSync("apps/storybook/stories/Icons.stories.tsx", "utf8");
  const missing = icons.filter(n => !story.includes(n));
  const stale = [...story.matchAll(/\b(\w+Icon)\b/g)].map(m => m[1])
    .filter((v, i, a) => a.indexOf(v) === i).filter(n => !icons.includes(n));
  console.log(missing.length ? "MISSING from gallery: " + missing.join(", ") : "icons gallery in sync");
  if (stale.length) console.log("STALE in gallery (no longer published): " + stale.join(", "));
'
```

## 3. Fix the drift

- **Missing UI story** — add `apps/storybook/stories/<Name>.stories.tsx`. Import the
  component from its subpath and follow the existing pattern (see
  [`Button.stories.tsx`](../../../apps/storybook/stories/Button.stories.tsx)):

  ```tsx
  import type { Meta, StoryObj } from "@storybook/react-vite";
  import Thing from "@chatool/ui/thing";

  const meta = {
    title: "UI/Thing",
    component: Thing,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
  } satisfies Meta<typeof Thing>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  export const Default: Story = {};
  ```

  Cover the meaningful variants/props (cva variants get `argTypes` select
  controls, like Button does). Compose interactive primitives in a `render`.

- **Missing icon** — add its `import <Name> from "@chatool/icons/<Name>"` and an
  entry in the `icons` map in
  [`Icons.stories.tsx`](../../../apps/storybook/stories/Icons.stories.tsx) (keep it
  alphabetical-ish, matching the existing block). Remove any **stale** entry the
  check flagged.

`@chatool/core` (`ChatoolProvider` + tokens) is covered by the `Core` and
`Design/Tokens` stories — when a **new** package ships something
visual, consider a story for it too (advisory, not enforced by the checks above).

## 4. Verify

```bash
pnpm build && pnpm build-storybook
node -e 'const i=require("./apps/storybook/storybook-static/index.json"); console.log(Object.values(i.entries).filter(e=>e.type==="story").length, "stories")'
```

The build must succeed and the new stories appear in the built `index.json`
(`"use client"` lines from third-party Radix deps are harmless Vite warnings).
Re-run steps 1–2 — both should report "in sync." Report a short summary; if
nothing was missing, say so explicitly.
