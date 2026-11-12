import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import {
  type cardActionsVariants,
  type cardHeadlineVariants,
  type cardMediaVariants,
  type cardVariants,
} from "./card.variants";

export type { CardShape, CardVariant } from "../config";

export interface CardProps
  extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  /**
   * Render the card onto its single child via Radix `Slot` — an `<article>`,
   * an `<li>` in a collection, or (for a **directly actionable** card) an
   * `<a>` / `<button>` / `<label>`, a Next `<Link>`, …
   */
  asChild?: boolean;
  /**
   * Directly actionable card: hover / pressed / focus states, the press ripple
   * and a pointer cursor. **Auto-detected** for an `asChild` `<a>`, `<button>`,
   * `<label>` or a child with `href` / `onClick`; set it explicitly for other
   * natively interactive children. A card made clickable by a
   * `CardPrimaryAction` needs neither — it reacts to the action through CSS.
   */
  interactive?: boolean;
  /**
   * Disabled card. An actionable `<button>` card gets the native `disabled`,
   * other actionable cards `aria-disabled`; a container card becomes `inert`
   * (its nested controls and stretched action stop responding too).
   */
  disabled?: boolean;
  /** Dragged ("picked up") state: dragged elevation + state layer, on top. */
  dragged?: boolean;
  /**
   * Selected / checked (MDC-Android's checkable card): a `secondary` tint and
   * outline plus the check icon. On a `<button>` card it also sets
   * `aria-pressed`. Selection also follows a checked direct `<input>` child (a
   * `<label>` card) and a pressed toggle `CardPrimaryAction`, with no prop.
   */
  selected?: boolean;
  /**
   * The check icon shown while selected: `true` → the built-in check-circle, a
   * node → your own, `false` → none. Defaults to `true` whenever `selected` is
   * set; pass `true` for a `<label>` / toggle-action card that has no prop.
   */
  checkIcon?: boolean | React.ReactNode;
}

export interface CardMediaProps
  extends React.ComponentProps<"div">, VariantProps<typeof cardMediaVariants> {
  /** Make the child (`<img>`, `<video>`, `<picture>`, `<iframe>`) the media box. */
  asChild?: boolean;
}

export interface CardHeaderProps extends React.ComponentProps<"div"> {
  /** Leading avatar, thumbnail or icon (40dp avatars are typical). */
  leading?: React.ReactNode;
  /** Trailing element — an overflow-menu `IconButton`, a badge, a timestamp. */
  trailing?: React.ReactNode;
}

export interface CardContentProps extends React.ComponentProps<"div"> {
  /** Render onto the child element (e.g. a `<section>`). */
  asChild?: boolean;
}

export interface CardHeadlineProps
  extends
    React.ComponentProps<"h3">,
    VariantProps<typeof cardHeadlineVariants> {
  /**
   * Render onto the child — use it to pick the heading level that fits the
   * page outline (`<h2>`, `<h4>`, …) or a non-heading (`<p>`) in long lists.
   */
  asChild?: boolean;
  /** Truncate to this many lines with an ellipsis (MD3: cards don't scroll). */
  maxLines?: number;
}

export interface CardSubheadProps extends React.ComponentProps<"p"> {
  /** Render onto the child element. */
  asChild?: boolean;
  /** Truncate to this many lines with an ellipsis. */
  maxLines?: number;
}

export interface CardSupportingTextProps extends React.ComponentProps<"p"> {
  /** Render onto the child element (e.g. a `<div>` holding several paragraphs). */
  asChild?: boolean;
  /** Truncate to this many lines with an ellipsis. */
  maxLines?: number;
}

export interface CardActionsProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof cardActionsVariants> {
  /** Render onto the child element. */
  asChild?: boolean;
}

export interface CardPrimaryActionProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLElement>, "type">,
    Omit<React.AnchorHTMLAttributes<HTMLElement>, "type"> {
  ref?: React.Ref<HTMLElement>;
  /** Navigate: renders an `<a href>` (the card gets the link role). */
  href?: string;
  /** `<button>` type when there's no `href`. Defaults to `"button"`. */
  type?: "button" | "submit" | "reset";
  /** Render onto the child — e.g. a Next `<Link>` or a router link. */
  asChild?: boolean;
  /**
   * Disable the action — and with it the whole card's interactive styling. A
   * link loses its `href` (the standard way to disable a link) and gets
   * `aria-disabled`.
   */
  disabled?: boolean;
  /**
   * Make a `<button>` action a **toggle** (`aria-pressed`), which also shows the
   * card as selected — pair with the card's `checkIcon`.
   */
  selected?: boolean;
}
