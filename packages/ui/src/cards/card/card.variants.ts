import { cva } from "class-variance-authority";

import {
  CHECK,
  CONTAINER,
  DISABLED,
  DRAG,
  FOCUS,
  HOVER,
  MOTION,
  PRESS,
  RESET,
  RIPPLE,
  SELECTED,
  SHAPE,
  VARIANT,
} from "../config";

/*
 * Material Design 3 card — the container. Three variants (elevated / filled /
 * outlined) with the exact Compose / Material Web per-state tokens, the full M3
 * Expressive corner scale, vertical / horizontal layout, and the interaction
 * states (hover / focus / pressed / dragged / selected / disabled) wired through
 * priority chains of `--_c-*` locals — see `../config.ts`.
 */
export const cardVariants = cva(
  `${CONTAINER} ${RESET} ${MOTION} ${HOVER} ${FOCUS} ${PRESS} ${DRAG} ${SELECTED} ${DISABLED}`,
  {
    variants: {
      variant: VARIANT,
      shape: SHAPE,
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row",
      },
    },
    defaultVariants: {
      variant: "filled",
      shape: "medium",
      orientation: "vertical",
    },
  },
);

/** Overlay classes for the shared press ripple (see `RIPPLE`). */
export const CARD_RIPPLE = RIPPLE;

/** The checked-icon slot (see `CHECK`). */
export const CARD_CHECK = CHECK;

/*
 * Bleed: a full-bleed media block cancels the card padding on the edges it
 * touches, so it runs to the container edge (the container's `overflow: clip`
 * rounds it). Which edges depends on the card's orientation and the block's
 * position among the card's **content** children — `:nth-child(1 of …)` skips
 * the card's own decorations (the `aria-hidden` ripple / check icon, rendered
 * first) and a direct `<input>` (a selectable `<label>` card). Selectors are
 * scoped to a **direct** card parent, so a card nested in a card is unaffected.
 */
const BLEED_X =
  "[[data-slot=card][data-orientation=vertical]>&]:mx-[calc(0px_-_var(--_c-pad))] [[data-slot=card][data-orientation=horizontal]>&]:my-[calc(0px_-_var(--_c-pad))]";
const BLEED_AUTO =
  "[[data-slot=card][data-orientation=vertical]>&:nth-child(1_of_:not([aria-hidden=true],input))]:mt-[calc(0px_-_var(--_c-pad))] [[data-slot=card][data-orientation=vertical]>&:last-child]:mb-[calc(0px_-_var(--_c-pad))] [[data-slot=card][data-orientation=horizontal]>&:nth-child(1_of_:not([aria-hidden=true],input))]:ms-[calc(0px_-_var(--_c-pad))] [[data-slot=card][data-orientation=horizontal]>&:last-child]:me-[calc(0px_-_var(--_c-pad))]";
const BLEED_FIRST =
  "[[data-slot=card][data-orientation=vertical]>&]:mt-[calc(0px_-_var(--_c-pad))] [[data-slot=card][data-orientation=horizontal]>&]:ms-[calc(0px_-_var(--_c-pad))]";

/*
 * MD3 card media (thumbnail, image, video). Full-bleed by default; `inset`
 * keeps the padding and rounds the media **optically** — MD3 Expressive's
 * "outer radius − padding = inner radius", floored at `corner-extra-small` (or
 * the card's own radius, if smaller) — so nested corners look concentric at
 * every `shape`. A direct `<img>` / `<video>`
 * / `<picture>` child (or the element itself via `asChild`) covers the box.
 */
export const cardMediaVariants = cva(
  "relative block shrink-0 overflow-clip object-cover [&>img]:size-full [&>img]:object-cover [&>picture]:size-full [&>video]:size-full [&>video]:object-cover",
  {
    variants: {
      inset: {
        false: BLEED_X,
        true: "rounded-[var(--md-comp-card-media-shape,max(min(var(--md-sys-shape-corner-extra-small,0.25rem),var(--_c-shape)),calc(var(--_c-shape)_-_var(--_c-pad))))]",
      },
      placement: {
        auto: "",
        first: "order-first",
      },
    },
    compoundVariants: [
      { inset: false, placement: "auto", class: BLEED_AUTO },
      { inset: false, placement: "first", class: BLEED_FIRST },
    ],
    defaultVariants: { inset: false, placement: "auto" },
  },
);

/** Header row: leading (avatar / thumbnail), the text column, trailing. */
export const CARD_HEADER = "flex min-w-0 items-center gap-4";
export const CARD_HEADER_LEADING = "flex shrink-0 items-center";
export const CARD_HEADER_TEXT = "flex min-w-0 flex-1 flex-col";
export const CARD_HEADER_TRAILING = "flex shrink-0 items-center";

/**
 * The text block. It grows (`flex-1`), so in a grid of equal-height cards the
 * actions below it line up at the bottom of every card.
 */
export const CARD_CONTENT =
  "flex min-w-0 flex-1 flex-col gap-[var(--md-comp-card-content-gap,0.25rem)]";

/** Headline — the card's subject. Title typescale; `size` picks the step. */
export const cardHeadlineVariants = cva(
  "m-0 text-[color:var(--md-comp-card-headline-color,var(--md-sys-color-on-surface))]",
  {
    variants: {
      size: {
        small: "text-title-small",
        medium: "text-title-medium",
        large: "text-title-large",
      },
    },
    defaultVariants: { size: "medium" },
  },
);

/**
 * Subhead — a byline, tagged location, price … Inline links are positioned so
 * they sit (and click) above a stretched `CardPrimaryAction`.
 */
export const CARD_SUBHEAD =
  "m-0 text-body-medium [&_a[href]]:relative text-[color:var(--md-comp-card-subhead-color,var(--md-sys-color-on-surface-variant))]";

/**
 * Supporting text — body content; 8dp from the headline/subhead above it.
 * Inline links are positioned so they stay clickable over a stretched action.
 */
export const CARD_SUPPORTING_TEXT =
  "m-0 text-body-medium [&_a[href]]:relative text-[color:var(--md-comp-card-supporting-text-color,var(--md-sys-color-on-surface-variant))] not-first:mt-1";

/** Line clamp driven by the `maxLines` prop (`--_c-lines`). */
export const LINE_CLAMP = "line-clamp-[var(--_c-lines)]";

/**
 * Actions row (buttons, icon buttons, chips). Pushed to the bottom of the card
 * (`mt-auto`) and wraps on narrow cards; `align` follows MD3's examples (end).
 */
export const cardActionsVariants = cva(
  "mt-auto flex flex-wrap items-center gap-[var(--md-comp-card-actions-gap,0.5rem)]",
  {
    variants: {
      align: {
        start: "justify-start",
        end: "justify-end",
        between: "justify-between",
        stretch: "*:flex-1",
      },
    },
    defaultVariants: { align: "end" },
  },
);

/**
 * The stretched primary action: a real `<a>` / `<button>` (usually the
 * headline's text) whose `::after` covers the whole card, so the card is one
 * big target while headings stay headings and other controls stay reachable.
 * The pseudo-element has **no** `z-index` and the action itself is **not
 * positioned**, so its containing block is the card and any positioned control
 * later in the DOM (every `@chatool/ui` control is) paints — and clicks — above
 * it. Its own outline is suppressed: the card draws the focus indicator.
 */
export const CARD_PRIMARY_ACTION =
  "m-0 cursor-pointer appearance-none border-0 bg-transparent p-0 text-start [color:inherit] [font:inherit] [letter-spacing:inherit] no-underline outline-none [-webkit-tap-highlight-color:transparent] after:absolute after:inset-0 after:content-[''] disabled:cursor-default aria-disabled:cursor-default";
