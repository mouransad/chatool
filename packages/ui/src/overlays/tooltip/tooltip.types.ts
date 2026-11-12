import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type ButtonProps } from "../../buttons/button/button.types";
import { type OverlayAlign, type OverlaySide } from "../placement";
import { type tooltipVariants } from "./tooltip.variants";

/** MD3 tooltip variants: `plain` labels an element, `rich` explains it. */
export type TooltipVariant = "plain" | "rich";

/** Side of the anchor (`start` / `end` follow the writing direction). */
export type TooltipSide = OverlaySide;

/**
 * Alignment along that side. `before` / `after` sit beside the anchor, so the
 * two only meet at a corner (MD3's default rich placement).
 */
export type TooltipAlign = OverlayAlign;

/**
 * What the tooltip is to its anchor, for assistive technology:
 *
 * - `description`: extra information (`aria-describedby`).
 * - `label`: the anchor's **name** (`aria-label`), for controls with no text
 *   of their own, like icon buttons. Needs string content.
 * - `none`: purely visual; you wire the semantics yourself.
 */
export type TooltipRelationship = "label" | "description" | "none";

/** Why a tooltip opened or closed (`onOpenChange`'s second argument). */
export type TooltipOpenChangeReason =
  /** The pointer entered / left the anchor or the tooltip. */
  | "hover"
  /** Keyboard focus reached the anchor. */
  | "focus"
  /** Focus left the anchor and the tooltip. */
  | "blur"
  /** A touch long-press on the anchor (and its release, 1.5s later). */
  | "long-press"
  /** A persistent tooltip's anchor was clicked. */
  | "click"
  /** The anchor was pressed while a transient tooltip was showing. */
  | "press"
  /** Escape. */
  | "escape"
  /** A press outside the anchor and the tooltip. */
  | "outside-press"
  /** Focus moved to another element (persistent tooltips). */
  | "focus-outside"
  /** One of the tooltip's action buttons was clicked. */
  | "action"
  /** The anchor scrolled out of view. */
  | "anchor-hidden"
  /** Another tooltip opened (only one shows at a time). */
  | "replaced";

export interface TooltipOpenChangeDetails {
  reason: TooltipOpenChangeReason;
  /** The DOM event behind the change, when there is one. */
  event?: Event;
}

/** Timing shared by every tooltip under a `TooltipProvider`. */
export interface TooltipTiming {
  /**
   * How long the pointer must rest on the anchor before the tooltip shows, in
   * ms. Default `500` (MDC-web / Android). Keyboard focus shows it at once.
   */
  showDelay?: number;
  /**
   * How long the tooltip stays after the pointer leaves, in ms. Default
   * `1500` (MD3: tooltips "disappear 1.5 seconds after navigating away from
   * the target region"). Hovering the tooltip itself keeps it open.
   */
  hideDelay?: number;
  /**
   * While another tooltip is showing, or for this long after one closed, the
   * next one skips `showDelay`, so scanning a toolbar reads fluently. In ms.
   * Default `300`; `0` turns it off.
   */
  skipDelay?: number;
  /** Touch long-press duration that shows the tooltip, in ms. Default `500`. */
  touchShowDelay?: number;
  /**
   * How long the tooltip stays after a long-press is released, in ms. Default
   * `1500` (MD3 / Compose `TooltipDuration`).
   */
  touchHideDelay?: number;
}

export interface TooltipProviderProps extends TooltipTiming {
  /**
   * Where tooltips are rendered. Default: the nearest open `<dialog>`, else
   * `<body>`. Pass an element inside a themed / `.dark` subtree to have
   * tooltips inherit its tokens.
   */
  container?: HTMLElement | null;
  children?: React.ReactNode;
}

export interface TooltipProps
  extends
    Omit<React.ComponentProps<"div">, "children" | "content" | "title">,
    Omit<VariantProps<typeof tooltipVariants>, "withActions">,
    TooltipTiming {
  /**
   * The element the tooltip belongs to (the **anchor**): one element that
   * forwards its props and `ref` to a DOM node, such as `Button`,
   * `IconButton` or any native element.
   */
  children: React.ReactElement;
  /**
   * The tooltip's text: the supporting text of a rich tooltip, the whole
   * message of a plain one. Nothing renders while it's empty (`null`,
   * `undefined`, `false`, `""`).
   */
  content: React.ReactNode;
  /**
   * `plain` (a brief label) or `rich` (longer text, optional subhead and
   * actions). Defaults to `rich` when `title`, `actions` or `persistent` is
   * set, else `plain`.
   */
  variant?: TooltipVariant;
  /** Rich subhead. Keep it to one line. */
  title?: React.ReactNode;
  /**
   * Rich actions: up to two text buttons (`TooltipAction`). Clicking one
   * closes the tooltip unless it carries `data-tooltip-keep-open`.
   */
  actions?: React.ReactNode;
  /**
   * MD3 **persistent** rich tooltip: it opens when the anchor is clicked
   * (hover and focus don't trigger it) and stays until the user presses
   * Escape, presses elsewhere, moves focus to another element or picks an
   * action. Use `defaultOpen` to show one on page load.
   */
  persistent?: boolean;
  /** Draw a caret pointing at the anchor (Compose's optional caret). */
  caret?: boolean;
  /**
   * Preferred side of the anchor. Default `top` for plain, `bottom` for rich
   * (MD3). It flips to the opposite side when there's no room.
   */
  side?: TooltipSide;
  /**
   * Alignment along that side. Default `center` for plain and `after` for
   * rich (MD3: "the bottom right of the parent element"); use `center` to
   * put a rich tooltip straight below its anchor on desktop.
   */
  align?: TooltipAlign;
  /**
   * Distance from the anchor in px. Default `4` (MD3). Use `8` for anchors
   * with no visual boundary, like text.
   */
  offset?: number;
  /** Extra shift along the alignment axis, in px. Default `0`. */
  alignOffset?: number;
  /** Minimum distance kept from the viewport edges, in px. Default `8`. */
  collisionPadding?: number;
  /** Flip to the other side / alignment when the preferred one overflows. */
  flip?: boolean;
  /** Controlled visibility. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial visibility of an uncontrolled tooltip. */
  defaultOpen?: boolean;
  /** Called when the tooltip wants to open or close, with the reason. */
  onOpenChange?: (open: boolean, details: TooltipOpenChangeDetails) => void;
  /** Never show the tooltip (the anchor keeps its accessible name). */
  disabled?: boolean;
  /**
   * Keep the tooltip open while the pointer is over it (WCAG 1.4.13). Default
   * `true`; `false` makes it ignore the pointer entirely.
   */
  hoverable?: boolean;
  /**
   * The tooltip has controls inside (buttons, links). It then takes the
   * non-modal `dialog` role, the anchor gets `aria-haspopup` /
   * `aria-expanded`, and Tab moves into and out of it. Defaults to `true`
   * when `actions` or `persistent` is set.
   */
  interactive?: boolean;
  /** What the tooltip is to its anchor. Default `description`. */
  relationship?: TooltipRelationship;
  /** Where to render this tooltip. Default: see `TooltipProvider`. */
  container?: HTMLElement | null;
}

/** A rich tooltip's text button: `Button`'s props, `variant="text"` preset. */
export type TooltipActionProps = ButtonProps;
