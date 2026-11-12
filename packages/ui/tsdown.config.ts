import { defineChatoolConfig } from "../../tsdown.preset.ts";

export default defineChatoolConfig({
  entry: {
    // Key = published subpath (`./button`); source lives in the buttons/ family
    // directory. tsdown names output by the entry key, not the path.
    button: "src/buttons/button/index.tsx",
    // Icon-only family member; same subpath=key rule (`./icon-button`). Shares
    // config.ts / spinner / ripple with `button`.
    "icon-button": "src/buttons/icon-button/index.tsx",
    // Layout container that spaces/shapes Button + IconButton children
    // (`./button-group`). Pure server component; no ripple/config wiring.
    "button-group": "src/buttons/button-group/index.tsx",
    // MD3 Expressive FAB + extended FAB in one morphing element (`./fab`).
    // Pure Server Component; its client pieces are the shared `ripple` island
    // and the `fab-label` island below.
    fab: "src/buttons/fab/index.tsx",
    // The loading family (`src/loading/`). All three are client components: they
    // draw per frame, so the directive sits on the view + entry barrel.
    "loading-indicator": "src/loading/loading-indicator/index.tsx",
    "linear-progress": "src/loading/linear-progress/index.tsx",
    "circular-progress": "src/loading/circular-progress/index.tsx",
    // The divider family (`src/dividers/`). Pure Server Component (`./divider`).
    divider: "src/dividers/divider/index.tsx",
    // The badge family (`src/badges/`). Pure Server Component (`./badge`); its
    // motion is CSS-only (`@starting-style` + spring `linear()` easings).
    badge: "src/badges/badge/index.tsx",
    // The selection family (`src/selection/`). `./checkbox` is a Server
    // Component over a native input; its client pieces are islands.
    checkbox: "src/selection/checkbox/index.tsx",
    // `./radio` is a Server Component over a native input too; its input is a
    // client island (`radio-input`) so it can join an enclosing `RadioGroup`.
    radio: "src/selection/radio/index.tsx",
    // `./radio-group` is a client component (it provides context): the
    // directive sits on its view + entry barrel.
    "radio-group": "src/selection/radio-group/index.tsx",
    // `./switch` is a Server Component over a native `<input role=switch>`;
    // Enter / touch press / drag live in the `switch-interaction` island.
    switch: "src/selection/switch/index.tsx",
    // The card family (`src/cards/`). `./card` is a Server Component with its
    // parts (media, header, headline, actions, primary action, …) on the same
    // subpath; its only client piece is the shared `ripple` island.
    card: "src/cards/card/index.tsx",
    // The overlay family (`src/overlays/`). `./tooltip` is a client component
    // (it holds the open state): the directive sits on its view + entry
    // barrel. `TooltipProvider` and `TooltipAction` ship on the same subpath.
    // The shared overlay modules (`config`, `position`, `use-presence`, …) are
    // inlined, not subpaths.
    tooltip: "src/overlays/tooltip/index.tsx",
    // The text-field family (`src/text-fields/`). `./text-field` is a Server
    // Component over a native `<input>` / `<textarea>`; every state is CSS.
    "text-field": "src/text-fields/text-field/index.tsx",
    // The chip family (`src/chips/`). `./chip` is a Server Component shell
    // (container + glyphs, every state CSS); its actions are the
    // `chip-actions` island below. `./chip-set` is a client component (it
    // provides context and owns selection + the roving tabindex).
    chip: "src/chips/chip/index.tsx",
    "chip-set": "src/chips/chip-set/index.tsx",
    // INTERNAL chunk (no `exports` entry — not a public subpath). The press
    // ripple is the button family's only `"use client"` module; giving it its
    // own entry guarantees the directive is preserved as a distinct client
    // chunk (directive preservation is entry-level), so `button.mjs` can stay
    // directive-free (Server-Component-safe) while importing `./ripple.mjs` as a
    // client boundary. Don't expose `@chatool/ui/ripple`.
    ripple: "src/buttons/ripple.tsx",
    // INTERNAL chunk: the extended FAB's `"use client"` label island, which
    // measures the label so expand ⇄ collapse can spring its width. Keeps
    // `fab.mjs` directive-free. Not a public subpath.
    "fab-label": "src/buttons/fab/fab-label.tsx",
    // INTERNAL chunk, same reason as `ripple`: the checkbox's `"use client"`
    // island that mirrors the `indeterminate` prop onto the DOM-only
    // `input.indeterminate` property. Not a public subpath.
    "checkbox-indeterminate":
      "src/selection/checkbox/checkbox-indeterminate.tsx",
    // INTERNAL chunk: the radio's native `<input>` as a `"use client"` island
    // that reads the optional `RadioGroup` context. Keeps `radio.mjs`
    // directive-free. Not a public subpath.
    "radio-input": "src/selection/radio/radio-input.tsx",
    // INTERNAL chunk: the `RadioGroup` context object. Both `radio-input` and
    // `radio-group` import it, and it must be ONE module instance for the
    // provider and the radios to see each other — an explicit entry gives it a
    // stable, directive-preserving chunk instead of a hashed shared one.
    "radio-group-context": "src/selection/radio-group/radio-group-context.ts",
    // INTERNAL chunk: the switch's `"use client"` interaction island (Enter
    // to toggle, touch/keyboard press feedback, drag to toggle). Keeps
    // `switch.mjs` directive-free. Not a public subpath.
    "switch-interaction": "src/selection/switch/switch-interaction.tsx",
    // INTERNAL chunk: the text field's `"use client"` interaction island
    // (click-to-focus, clear / Escape, password toggle, live counter,
    // auto-grow fallback). Keeps `text-field.mjs` directive-free. Not a public
    // subpath.
    "text-field-interaction":
      "src/text-fields/text-field/text-field-interaction.tsx",
    // INTERNAL chunk: the chip's `"use client"` actions island (primary +
    // remove actions, selection, keyboard, focus after removal). Keeps
    // `chip.mjs` directive-free. Not a public subpath. It must import nothing
    // from `chips/config.ts` / `chip.variants.ts` (the view passes it class
    // strings) so the bundler can't hoist it into a shared chunk.
    "chip-actions": "src/chips/chip/chip-actions.tsx",
    // INTERNAL chunk: the `ChipSet` context + DOM focus helpers. Both
    // `chip-actions` and `chip-set` import it, and it must be ONE module
    // instance for the set and its chips to see each other.
    "chip-set-context": "src/chips/chip-set/chip-set-context.ts",
  },
  // react / react-dom (peers), @chatool/utils, radix-ui and cva (deps) —
  // including `react/jsx-runtime` — are externalized automatically.
});
