import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type ButtonProps } from "../../buttons/button/button.types";
import { type IconButtonProps } from "../../buttons/icon-button/icon-button.types";
import {
  type snackbarHostVariants,
  type snackbarVariants,
} from "./snackbar.variants";

/* ------------------------------------------------------------------------ */
/* Timing, results                                                          */
/* ------------------------------------------------------------------------ */

/**
 * How long a snackbar stays before it dismisses itself:
 *
 * - `"short"`: 4s (Compose `SnackbarDuration.Short`).
 * - `"long"`: 10s (Compose `SnackbarDuration.Long`).
 * - `"auto"`: reading time for the message, clamped to MD3's 4–10s.
 * - `"indefinite"`: until the user acts on or dismisses it.
 * - a number: that many milliseconds.
 *
 * Unset, a snackbar **with an action** is `"indefinite"` (MD3: "Snackbars with
 * actions should remain on the screen until the user takes an action … or
 * dismisses it") and one without uses the host's `duration` (default
 * `"short"`).
 */
export type SnackbarDuration =
  | "short"
  | "long"
  | "auto"
  | "indefinite"
  | number;

/**
 * Why a snackbar closed. `"action"` is Compose's `ActionPerformed`; every other
 * reason is a flavour of `Dismissed`.
 */
export type SnackbarCloseReason =
  /** The action button was pressed. */
  | "action"
  /** The close (✕) button was pressed. */
  | "dismiss"
  /** Its duration ran out. */
  | "timeout"
  /** It was swiped away. */
  | "swipe"
  /** Escape, while focus was inside it. */
  | "escape"
  /** A newer snackbar replaced it (`replace` / `strategy: "replace"`). */
  | "replaced"
  /** Code dismissed it (`handle.dismiss()`, `snackbar.dismiss(id)`). */
  | "programmatic"
  /** `snackbar.clear()` removed it, shown or still waiting. */
  | "cleared";

/** What a host does when a snackbar arrives while another is showing. */
export type SnackbarStrategy =
  /**
   * Wait: show it once the current one closes (Compose's
   * `SnackbarHostState`; MD3: "Consecutive snackbars must appear one at a
   * time").
   */
  | "queue"
  /**
   * Replace the current one at once, crossfading (MDC-Android's
   * `SnackbarManager`; MD3: "a snackbar with updated information can
   * immediately replace an outdated snackbar").
   */
  | "replace";

/** Which way a snackbar can be swiped away. `start` / `end` follow `dir`. */
export type SnackbarSwipeDirection = "start" | "end" | "up" | "down";

/** How a message is announced: MD3 asks for `polite` (queued). */
export type SnackbarPoliteness = "polite" | "assertive";

/* ------------------------------------------------------------------------ */
/* The imperative API                                                       */
/* ------------------------------------------------------------------------ */

/** Everything one snackbar can carry (`snackbar(options)`). */
export interface SnackbarOptions {
  /**
   * Identifies the snackbar. Showing an `id` that is already on screen or
   * waiting **updates it in place** (and restarts its timer) instead of
   * adding another. Defaults to a generated id.
   */
  id?: string;
  /** The supporting text. Keep it to one or two short lines (MD3). */
  message: React.ReactNode;
  /**
   * The action's label, rendered as a `SnackbarAction` text button (MD3
   * allows one, e.g. "Undo"). Pressing it closes the snackbar with
   * `"action"`.
   */
  action?: React.ReactNode;
  /** Called when the action is pressed, before the snackbar closes. */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Show the ✕ close affordance. Defaults to `true` for an `"indefinite"`
   * snackbar (Compose recommends "an additional close affordance" there) and
   * `false` otherwise.
   */
  withDismissAction?: boolean;
  /** See {@link SnackbarDuration}. */
  duration?: SnackbarDuration;
  /**
   * Show it **now**, replacing whatever is on screen, instead of waiting in
   * the queue. Overrides the host's `strategy` for this snackbar.
   */
  replace?: boolean;
  /** `polite` (default, MD3) or `assertive` (errors that can't wait). */
  politeness?: SnackbarPoliteness;
  /**
   * What screen readers hear. Defaults to the rendered message text, then the
   * action label.
   */
  announcement?: string;
  /** See `SnackbarProps.actionOnNewLine`. Defaults to the host's. */
  actionOnNewLine?: boolean | "auto";
  /** See `SnackbarProps.maxLines`. Defaults to the host's. */
  maxLines?: number;
  /** Accessible name of the close button. Defaults to the host's. */
  dismissLabel?: string;
  /** Extra classes for this snackbar's surface. */
  className?: string;
  /** Called once when it closes, with the reason. */
  onClose?: (reason: SnackbarCloseReason) => void;
  /**
   * Render this snackbar yourself (Compose's `SnackbarHost(snackbar = …)`).
   * Return a `Snackbar` with your own props, or anything else; the host still
   * positions, animates, times and announces it.
   */
  render?: (data: SnackbarData) => React.ReactNode;
  /** Free-form payload for custom renders. */
  data?: unknown;
}

/** One snackbar as a host renders it (Compose's `SnackbarData`). */
export interface SnackbarData extends Omit<SnackbarOptions, "id"> {
  id: string;
  /**
   * Unique per appearance (an `id` shown again after closing gets a new
   * one): the React key.
   */
  key: string;
  /**
   * Bumps on every update. The host restarts the timer when it changes, and
   * custom renders can key animations off it.
   */
  version: number;
  /** The element focused when it was shown: focus returns there on close. */
  trigger: HTMLElement | null;
  /** Run the action and close with `"action"` (Compose's `performAction`). */
  performAction: () => void;
  /** Close it (Compose's `dismiss`). */
  dismiss: (reason?: SnackbarCloseReason) => void;
}

/** What `snackbar()` returns. */
export interface SnackbarHandle {
  id: string;
  /**
   * Settles when the snackbar closes: `"action"` if its action was pressed
   * (Compose's `ActionPerformed`), otherwise the dismissal reason.
   *
   * ```ts
   * const { result } = snackbar({ message: "Archived", action: "Undo" });
   * if ((await result) === "action") restore();
   * ```
   */
  result: Promise<SnackbarCloseReason>;
  /** Update it in place (its timer restarts). */
  update: (patch: Partial<Omit<SnackbarOptions, "id">>) => void;
  /** Close it (or drop it from the queue) with `"programmatic"`. */
  dismiss: () => void;
}

/** The three messages of `snackbar.promise()`. */
export interface SnackbarPromiseMessages<T> {
  /** Shown (indefinitely) while the promise is pending. */
  loading: React.ReactNode;
  /** Replaces it when the promise resolves. */
  success: React.ReactNode | ((value: T) => React.ReactNode);
  /** Replaces it when the promise rejects. */
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
}

/** A snapshot of a queue: the snackbar on screen and the ones waiting. */
export interface SnackbarQueueState {
  current: SnackbarData | null;
  pending: readonly SnackbarData[];
}

/**
 * A queue of snackbars, shown one at a time by the `SnackbarHost` that
 * renders it. `snackbar` drives the default, global queue; create more with
 * `createSnackbarQueue()` for scoped hosts (a dialog, a side panel, …).
 */
export interface SnackbarQueue {
  /** Show a snackbar: a message, or full options. */
  show: (
    message: React.ReactNode | SnackbarOptions,
    options?: Omit<SnackbarOptions, "message">,
  ) => SnackbarHandle;
  /** Update a shown or waiting snackbar by id. No-op if it's gone. */
  update: (id: string, patch: Partial<Omit<SnackbarOptions, "id">>) => void;
  /**
   * Close one snackbar (or drop it from the queue). Without an id, closes the
   * one on screen; the next waiting one follows.
   */
  dismiss: (id?: string, reason?: SnackbarCloseReason) => void;
  /** Close the one on screen and drop every waiting one. */
  clear: () => void;
  /**
   * Shows `loading` until `promise` settles, then replaces it **in place**
   * with `success` / `error` (MD3: updated information replaces the outdated
   * snackbar). Returns the snackbar's handle plus the original promise.
   */
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: SnackbarPromiseMessages<T>,
    options?: Omit<SnackbarOptions, "message">,
  ) => SnackbarHandle & { promise: Promise<T> };
  /** The default strategy for snackbars that don't set `replace`. */
  setStrategy: (strategy: SnackbarStrategy) => void;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => SnackbarQueueState;
}

/** `snackbar(…)`: shows on the default queue, plus the queue's methods. */
export interface SnackbarFunction {
  (
    message: React.ReactNode | SnackbarOptions,
    options?: Omit<SnackbarOptions, "message">,
  ): SnackbarHandle;
  update: SnackbarQueue["update"];
  dismiss: SnackbarQueue["dismiss"];
  clear: SnackbarQueue["clear"];
  promise: SnackbarQueue["promise"];
  /** The default queue itself (for `<SnackbarHost queue>` or tests). */
  queue: SnackbarQueue;
}

/* ------------------------------------------------------------------------ */
/* Components                                                               */
/* ------------------------------------------------------------------------ */

/**
 * The snackbar **surface**: Compose's `Snackbar(…)` composable. It only draws;
 * a `SnackbarHost` positions, times, animates and announces it. Use it inside
 * a host's `renderSnackbar`, or on its own in your own layout.
 */
export interface SnackbarProps
  extends
    Omit<React.ComponentProps<"div">, "children">,
    Omit<VariantProps<typeof snackbarVariants>, "layout" | "dismissible"> {
  /** The supporting text. */
  children?: React.ReactNode;
  /**
   * The action. A string / number renders a `SnackbarAction`; any other node
   * (e.g. your own `<SnackbarAction asChild><a/></SnackbarAction>`) is used
   * as-is.
   */
  action?: React.ReactNode;
  /** Called when the built-in action button is pressed. */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Show the ✕ close affordance (an icon button with a "Dismiss" tooltip). */
  withDismissAction?: boolean;
  /** Called when the close button is pressed. */
  onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name (and tooltip) of the close button. Default `"Dismiss"`. */
  dismissLabel?: string;
  /**
   * Put the action on its own line under the text (Compose's
   * `actionOnNewLine`; MD3: "If an action is long, it can be displayed on a
   * third line"). `"auto"` (default) does what MDC-Android does: on compact
   * screens, a wrapping message whose action is wider than 128dp stacks.
   */
  actionOnNewLine?: boolean | "auto";
  /**
   * Clamp the text to this many lines with an ellipsis (MDC-Android uses 2;
   * MD3 allows "up to two lines" on compact screens). Unset = no clamp.
   */
  maxLines?: number;
}

/** The snackbar's action: MD3's text button in `inverse-primary`. */
export type SnackbarActionProps = ButtonProps;

/** The ✕ close affordance: a standard icon button with a tooltip. */
export interface SnackbarDismissActionProps extends Omit<
  IconButtonProps,
  "children" | "aria-label"
> {
  /** Accessible name and tooltip text. Default `"Dismiss"`. */
  label?: string;
  /** The glyph. Defaults to Material Symbols `close`. */
  children?: React.ReactNode;
  /** Wrap it in a plain tooltip (Compose does). Default `true`. */
  tooltip?: boolean;
}

/** Element, ref or CSS selector of something the snackbar must sit above. */
export type SnackbarAnchor =
  | React.RefObject<HTMLElement | null>
  | HTMLElement
  | string
  | null;

/** The viewport-level container that shows a queue's snackbars. */
export interface SnackbarHostProps
  extends
    Omit<React.ComponentProps<"section">, "children">,
    VariantProps<typeof snackbarHostVariants> {
  /**
   * Your app (optional). Wrapping it makes `useSnackbar()` inside resolve to
   * this host's queue; a bare `<SnackbarHost />` works with `snackbar()`.
   */
  children?: React.ReactNode;
  /** The queue to show. Defaults to the global one that `snackbar()` uses. */
  queue?: SnackbarQueue;
  /** Default `"queue"`. See {@link SnackbarStrategy}. */
  strategy?: SnackbarStrategy;
  /** Default duration for snackbars **without** an action. Default `"short"`. */
  duration?: SnackbarDuration;
  /**
   * Extra distance from the edge, as a CSS length or px. Also
   * `--md-comp-snackbar-host-offset`.
   */
  offset?: number | string;
  /**
   * Sit above this element: a FAB, a bottom app bar, a docked toolbar
   * (MDC-Android's `setAnchorView`; MD3: "snackbars should appear above
   * FABs"). Tracked as it moves or resizes.
   */
  anchor?: SnackbarAnchor;
  /**
   * Where to render instead of in place. Defaults to in place; while a modal
   * `<dialog>` is open the host moves into it automatically, so snackbars stay
   * visible and operable above it.
   */
  container?: HTMLElement | null;
  /** Landmark name. Default `"Notifications"` (the hotkey is appended). */
  label?: string;
  /**
   * Keys that move focus to the snackbar, as `KeyboardEvent.code`s and
   * modifier flags (`"altKey"`, `"ctrlKey"`, `"metaKey"`, `"shiftKey"`).
   * Default `["altKey", "KeyG"]` (MD3 suggests "a shortcut … like Alt+G").
   * `false` turns it off.
   */
  hotkey?: readonly string[] | false;
  /**
   * Swipe-to-dismiss directions. Default `"end"` (MDC-Android:
   * start → end, mirrored in RTL). `false` turns swiping off.
   */
  swipeDirection?:
    | SnackbarSwipeDirection
    | readonly SnackbarSwipeDirection[]
    | false;
  /** Pause the timer while the pointer is over the snackbar. Default `true`. */
  pauseOnHover?: boolean;
  /** Pause the timer while the window is blurred or hidden. Default `true`. */
  pauseOnFocusLoss?: boolean;
  /** Default `actionOnNewLine` for every snackbar. */
  actionOnNewLine?: boolean | "auto";
  /** Default `maxLines` for every snackbar. */
  maxLines?: number;
  /** Default close-button label. Default `"Dismiss"`. */
  dismissLabel?: string;
  /** Render every snackbar yourself (see `SnackbarOptions.render`). */
  renderSnackbar?: (data: SnackbarData) => React.ReactNode;
  /** Classes for every snackbar surface the host renders. */
  snackbarClassName?: string;
}
