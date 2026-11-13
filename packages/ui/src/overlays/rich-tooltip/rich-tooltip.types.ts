import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type AnnouncePoliteness } from "../announce";
import { type OverlayAlign, type OverlaySide } from "../placement";
import { type ButtonProps } from "../../buttons/button/button.types";
import {
  type TooltipOpenChangeReason,
  type TooltipTiming,
} from "../tooltip/tooltip.types";
import { type richTooltipVariants } from "./rich-tooltip.variants";

/**
 * What opens a rich tooltip:
 *
 * - `hover`: MD3's default **transient** rich tooltip. Hover (after
 *   `showDelay`), keyboard focus and a touch long-press show it; it leaves
 *   1.5s after the pointer does.
 * - `click`: MD3's **persistent** rich tooltip. The anchor's click toggles
 *   it; it stays until Escape, a press elsewhere, focus moving to another
 *   element or one of its actions. Pair with `defaultOpen` to show it on page
 *   load (feature discovery).
 * - `manual`: only your code opens it (`open`, `defaultOpen` or
 *   `useRichTooltipState().show()`); the anchor's own input does nothing.
 *   It dismisses like a persistent one. Compose's `enableUserInput = false`.
 */
export type RichTooltipTriggerMode = "hover" | "click" | "manual";

/** Side of the anchor (`start` / `end` follow the writing direction). */
export type RichTooltipSide = OverlaySide;

/**
 * Alignment along that side. `after` (default) puts the tooltip past the
 * anchor's end, so the two only meet at a corner: MD3's "bottom right of the
 * parent element". `center` is MD3's desktop alternative.
 */
export type RichTooltipAlign = OverlayAlign;

/** Why a rich tooltip opened or closed (`onOpenChange`'s second argument). */
export type RichTooltipOpenChangeReason =
  | TooltipOpenChangeReason
  /** `useRichTooltipState()`'s `show` / `dismiss` / `toggle` / `setOpen`. */
  | "programmatic";

export interface RichTooltipOpenChangeDetails {
  reason: RichTooltipOpenChangeReason;
  /** The DOM event behind the change, when there is one. */
  event?: Event;
}

/**
 * A point the tooltip can be anchored to without a DOM element of its own:
 * a text selection, a canvas hit, the cursor. Floating UI's virtual element.
 */
export interface RichTooltipVirtualAnchor {
  getBoundingClientRect: () => DOMRect;
  /**
   * The element it lives in. Scrolling / resizing ancestors of it re-place
   * the tooltip, and it picks the render root and writing direction.
   */
  contextElement?: Element;
}

/**
 * What the tooltip points at, when that isn't its trigger: an element, a ref
 * to one, or a virtual anchor.
 */
export type RichTooltipAnchor =
  | Element
  | RichTooltipVirtualAnchor
  | React.RefObject<Element | null>
  | null;

/** The caret: `true` for MD3's 16×8dp, or its own size (px or any length). */
export type RichTooltipCaret =
  | boolean
  | { width?: number | string; height?: number | string };

/** `useRichTooltipState()`'s options. */
export interface RichTooltipStateOptions {
  /** Initial visibility. Default `false`. */
  defaultOpen?: boolean;
  /** Called on every change, with the reason. */
  onOpenChange?: (open: boolean, details: RichTooltipOpenChangeDetails) => void;
}

/**
 * A rich tooltip's open state as an object you hold, like Compose's
 * `TooltipState`: pass it to `RichTooltip`'s `state` prop and call `show()`
 * / `dismiss()` / `toggle()` from anywhere (a tour, a timer, a menu item).
 */
export interface RichTooltipState {
  /** Whether the tooltip is showing. */
  readonly open: boolean;
  /** Shows it (reason `programmatic`). */
  show: () => void;
  /** Hides it (reason `programmatic`). */
  dismiss: () => void;
  /** Flips it. */
  toggle: () => void;
  /** Sets it; `RichTooltip` calls this with the user's reason. */
  setOpen: (open: boolean, details?: RichTooltipOpenChangeDetails) => void;
}

/** `useRichTooltip()`: the nearest rich tooltip, for custom parts inside it. */
export interface RichTooltipApi {
  /** Whether the tooltip is showing. */
  open: boolean;
  /** Whether it has controls (it's a non-modal `dialog`, not a `tooltip`). */
  interactive: boolean;
  /** Closes it as an action would (focus returns to the anchor). */
  dismiss: (event?: Event) => void;
  /**
   * Keeps it open through soft dismissals (the pointer or focus leaving, a
   * press elsewhere) until the returned release function is called. Async
   * work inside the tooltip uses it so the tooltip can't vanish mid-task.
   */
  hold: () => () => void;
}

export interface RichTooltipProps extends TooltipTiming {
  /**
   * **Composed:** a `RichTooltipTrigger` and a `RichTooltipContent` (in any
   * order, at any depth). **Shorthand** (`supportingText` set): the anchor
   * element itself, which is wrapped in a trigger for you.
   */
  children?: React.ReactNode;
  /**
   * Shorthand: the supporting text. Setting it switches `RichTooltip` to
   * shorthand mode, where it renders the trigger and the content itself.
   */
  supportingText?: React.ReactNode;
  /** Shorthand: the optional one-line subhead. */
  subhead?: React.ReactNode;
  /** Shorthand: up to two `RichTooltipAction`s. */
  actions?: React.ReactNode;
  /** Shorthand: props for the generated `RichTooltipContent` (the surface). */
  contentProps?: RichTooltipContentProps;
  /** What opens it. Default `hover` (MD3's transient rich tooltip). */
  trigger?: RichTooltipTriggerMode;
  /** Controlled visibility. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial visibility of an uncontrolled tooltip (e.g. on page load). */
  defaultOpen?: boolean;
  /** Called when the tooltip wants to open or close, with the reason. */
  onOpenChange?: (open: boolean, details: RichTooltipOpenChangeDetails) => void;
  /** An external state from `useRichTooltipState()`. Wins over `open`. */
  state?: RichTooltipState;
  /** Never show the tooltip. */
  disabled?: boolean;
  /**
   * The tooltip has controls (buttons, links). It then takes the non-modal
   * `dialog` role, the trigger gets `aria-haspopup` / `aria-expanded`, and Tab
   * moves into and out of it without trapping. Detected automatically from
   * `RichTooltipActions` / `RichTooltipAction` / links in the content and for
   * `click` / `manual` triggers; set it to override.
   */
  interactive?: boolean;
  /**
   * What the tooltip points at, if not its trigger: an element, a ref or a
   * virtual anchor. With no `RichTooltipTrigger`, an element anchor also
   * gets the trigger's behavior and ARIA.
   */
  anchor?: RichTooltipAnchor;
  /** Preferred side. Default `bottom` (MD3). Flips when there's no room. */
  side?: RichTooltipSide;
  /** Alignment along that side. Default `after` (MD3's bottom-right). */
  align?: RichTooltipAlign;
  /** Distance from the anchor (or the caret tip), in px. Default `4`. */
  offset?: number;
  /** Extra shift along the alignment axis, in px. Default `0`. */
  alignOffset?: number;
  /** Minimum distance kept from the viewport edges, in px. Default `8`. */
  collisionPadding?: number;
  /** Flip to the other side / alignment when the preferred one overflows. */
  flip?: boolean;
  /**
   * Collision shifts move in multiples of this many px. Default `8` (MD3:
   * "adjusts in increments of 8dp"); `0` shifts by the exact amount.
   */
  positionStep?: number;
  /** Draw a caret pointing at the anchor, optionally with its own size. */
  caret?: RichTooltipCaret;
  /**
   * Keep a transient tooltip open while the pointer is over it (WCAG
   * 1.4.13). Default `true`.
   */
  hoverable?: boolean;
  /**
   * Announce the tooltip through a live region when it appears without the
   * user asking at that spot (`defaultOpen`, code, a click / long-press).
   * Hover and focus never announce: there the trigger's description does.
   * Default `true` (`polite`).
   */
  announce?: boolean | AnnouncePoliteness;
  /**
   * Where to render. Default: the `TooltipProvider`'s container, else the
   * nearest open `<dialog>`, else `<body>`.
   */
  container?: HTMLElement | null;
}

export interface RichTooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The element the tooltip belongs to: one element that forwards its props
   * and `ref` to a DOM node (`Button`, `IconButton`, a native element…).
   */
  children: React.ReactElement;
}

export interface RichTooltipContentProps
  // The id is the tooltip's own: the trigger's ARIA points at it.
  extends
    Omit<React.ComponentProps<"div">, "title" | "id">,
    VariantProps<typeof richTooltipVariants> {
  /**
   * Max width: a px number or any CSS length. Default `20rem` (MD3's 320dp),
   * never wider than the viewport minus 1rem.
   */
  maxWidth?: number | string;
}

export interface RichTooltipSubheadProps extends React.ComponentProps<"div"> {
  /** Render the styles onto your own element (e.g. an `<h2>`) via `Slot`. */
  asChild?: boolean;
}

export interface RichTooltipSupportingTextProps extends React.ComponentProps<"div"> {
  /** Render the styles onto your own element (e.g. a `<p>`) via `Slot`. */
  asChild?: boolean;
}

export type RichTooltipActionsProps = React.ComponentProps<"div">;

/**
 * A rich tooltip's text button: every `Button` prop, `variant="text"`
 * preset. `onClick` may return a promise: the button shows its spinner and
 * the tooltip stays open until it settles.
 */
export interface RichTooltipActionProps extends Omit<ButtonProps, "onClick"> {
  /** Close the tooltip after a click (after the promise, if any). Default `true`. */
  closeOnClick?: boolean;
  /**
   * Click handler. Return a promise to show a spinner and keep the tooltip
   * open until it settles; call `event.preventDefault()` to keep it open.
   */
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<unknown>;
}
