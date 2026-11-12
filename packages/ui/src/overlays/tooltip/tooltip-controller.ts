import { isEventInside, onDocumentPress, pushEscapeLayer } from "../dismiss";
import { getTabbableAfter, getTabbables, isFocusVisible } from "../focus";
import { isTooltipWarm } from "./tooltip-manager";
import { type TooltipOpenChangeReason } from "./tooltip.types";

/** The tooltip's current props, read fresh on every event. */
export interface TooltipLive {
  open: boolean;
  persistent: boolean;
  disabled: boolean;
  showDelay: number;
  hideDelay: number;
  skipDelay: number;
  touchShowDelay: number;
  touchHideDelay: number;
  setOpen: (
    open: boolean,
    reason: TooltipOpenChangeReason,
    event?: Event,
  ) => void;
}

/** A touch may drift this far (CSS px) and still count as a long-press. */
const TOUCH_SLOP = 10;
/** How long after a long-press is released its click is still swallowed. */
const CLICK_WINDOW = 400;

const hasModifier = (event: KeyboardEvent) =>
  event.altKey || event.ctrlKey || event.metaKey;

/**
 * The tooltip's behavior, as plain DOM listeners around one mutable state.
 * It never touches React: `read()` returns the latest props and `setOpen`
 * reports what should happen, so the same controller serves controlled and
 * uncontrolled tooltips and nothing re-renders while timers run.
 *
 * **Transient** tooltips (MD3's default):
 * - **Hover** (mouse / pen): shows after `showDelay`, or at once while
 *   tooltips are "warm". Leaving starts `hideDelay` (1.5s); entering the
 *   anchor or the tooltip again cancels it (WCAG 1.4.13 "hoverable").
 * - **Keyboard focus** (`:focus-visible` only, never a mouse click) shows it
 *   at once, so a screen reader finds the description as focus lands. Blur
 *   hides it at once (APG).
 * - **Touch**: a long-press shows it; it stays `touchHideDelay` after release,
 *   and the click a long-press would otherwise fire is swallowed (Compose).
 * - A press on the anchor, a press anywhere else, Escape, or the anchor
 *   scrolling away closes it immediately.
 *
 * **Persistent** tooltips open and close on the anchor's click, and otherwise
 * only close on Escape, a press outside, focus moving to another element, or
 * one of their actions.
 */
export const createTooltipController = (read: () => TooltipLive) => {
  let anchor: HTMLElement | null = null;
  let surface: HTMLElement | null = null;

  let showTimer = 0;
  let hideTimer = 0;
  let pressTimer = 0;
  let swallowTimer = 0;

  /** A mouse press disarms hover until the pointer leaves and comes back. */
  let hoverArmed = true;
  /** The window lost focus: ignore the focus event it replays on return. */
  let windowBlurred = false;
  /** We are handing focus back to the anchor ourselves. */
  let restoringFocus = false;
  /** A long-press just showed the tooltip: its click must not act. */
  let swallowClick = false;
  let press: { id: number; x: number; y: number; shown: boolean } | null = null;

  const clearShow = () => {
    window.clearTimeout(showTimer);
    showTimer = 0;
  };
  const clearHide = () => {
    window.clearTimeout(hideTimer);
    hideTimer = 0;
  };
  const endPress = () => {
    window.clearTimeout(pressTimer);
    pressTimer = 0;
    press = null;
  };

  const contains = (target: EventTarget | null) =>
    target instanceof Node &&
    Boolean(anchor?.contains(target) || surface?.contains(target));

  /** Keyboard focus is on the anchor or inside the tooltip. */
  const holdsFocus = () => {
    if (surface?.matches(":focus-within")) return true;
    const focused = anchor?.ownerDocument.activeElement;
    return Boolean(
      focused && anchor?.contains(focused) && isFocusVisible(focused),
    );
  };

  /** Closing with focus inside the tooltip: hand it back to the anchor. */
  const restoreFocus = () => {
    if (!anchor || !surface?.matches(":focus-within")) return;
    const target =
      anchor.tabIndex >= 0 ? anchor : (getTabbables(anchor).pop() ?? anchor);
    restoringFocus = true;
    target.focus({ preventScroll: true });
    restoringFocus = false;
  };

  const open = (reason: TooltipOpenChangeReason, event?: Event, delay = 0) => {
    clearHide();
    clearShow();
    const live = read();
    if (live.disabled || live.open) return;

    const run = () => {
      showTimer = 0;
      const now = read();
      // The anchor may have left the page while the delay ran.
      if (now.disabled || now.open || !anchor?.isConnected) return;
      now.setOpen(true, reason, event);
    };
    if (delay > 0) showTimer = window.setTimeout(run, delay);
    else run();
  };

  const close = (reason: TooltipOpenChangeReason, event?: Event, delay = 0) => {
    clearShow();
    clearHide();
    if (!read().open) return;

    const run = () => {
      hideTimer = 0;
      const now = read();
      if (!now.open) return;
      // A pointer walking away never takes a tooltip from under the keyboard.
      if ((reason === "hover" || reason === "long-press") && holdsFocus()) {
        return;
      }
      if (reason !== "blur" && reason !== "focus-outside") restoreFocus();
      now.setOpen(false, reason, event);
    };
    if (delay > 0) hideTimer = window.setTimeout(run, delay);
    else run();
  };

  /** Wires the anchor. Returns the cleanup. */
  const bindAnchor = (node: HTMLElement) => {
    anchor = node;

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const live = read();
      if (live.persistent || !hoverArmed) return;
      open("hover", event, isTooltipWarm(live.skipDelay) ? 0 : live.showDelay);
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hoverArmed = true;
      const live = read();
      if (live.persistent) return;
      close("hover", event, live.hideDelay);
    };

    const onPointerDown = (event: PointerEvent) => {
      const live = read();
      if (event.pointerType !== "touch") {
        hoverArmed = false;
        if (!live.persistent) close("press", event);
        return;
      }

      endPress();
      if (live.persistent || live.disabled) return;
      close("press", event);
      press = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        shown: false,
      };
      pressTimer = window.setTimeout(() => {
        pressTimer = 0;
        if (!press) return;
        press.shown = true;
        swallowClick = true;
        open("long-press", event);
      }, live.touchShowDelay);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!press || press.shown || event.pointerId !== press.id) return;
      const travelled = Math.hypot(
        event.clientX - press.x,
        event.clientY - press.y,
      );
      if (travelled > TOUCH_SLOP) endPress();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.id) return;
      const { shown } = press;
      endPress();
      if (!shown) return;
      close("long-press", event, read().touchHideDelay);
      window.clearTimeout(swallowTimer);
      swallowTimer = window.setTimeout(() => {
        swallowClick = false;
      }, CLICK_WINDOW);
    };

    const onContextMenu = (event: MouseEvent) => {
      // A touch long-press also asks for the context menu (Android). The
      // tooltip is this element's long-press action, except on links, whose
      // native menu ("Open in new tab") is worth more than the tooltip.
      if ((press || swallowClick) && !node.closest("a[href]")) {
        event.preventDefault();
      }
    };

    const onClick = (event: MouseEvent) => {
      if (swallowClick) {
        swallowClick = false;
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const live = read();
      if (!live.persistent || live.disabled) return;
      if (live.open) close("click", event);
      else open("click", event);
    };

    const onFocusIn = (event: FocusEvent) => {
      if (restoringFocus || read().persistent) return;
      if (windowBlurred) {
        windowBlurred = false;
        return;
      }
      if (!isFocusVisible(event.target)) return;
      open("focus", event);
    };

    const onFocusOut = (event: FocusEvent) => {
      if (!node.ownerDocument.hasFocus()) {
        // Switching windows blurs the anchor; coming back focuses it again.
        // That replayed focus isn't the user asking for the tooltip.
        windowBlurred = true;
        window.addEventListener(
          "focus",
          () => {
            window.setTimeout(() => {
              windowBlurred = false;
            }, 0);
          },
          { once: true },
        );
      }
      if (read().persistent || contains(event.relatedTarget)) return;
      close("blur", event);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      // Tab from the anchor goes *into* an open tooltip that has controls,
      // as if it sat right after the anchor in the page.
      if (event.key !== "Tab" || event.shiftKey || hasModifier(event)) return;
      if (!surface || !read().open) return;
      const inner = getTabbables(node);
      if (inner.length > 0 && event.target !== inner[inner.length - 1]) return;
      const first = getTabbables(surface)[0];
      if (!first) return;
      event.preventDefault();
      first.focus();
    };

    node.addEventListener("pointerenter", onPointerEnter);
    node.addEventListener("pointerleave", onPointerLeave);
    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerup", onPointerUp);
    node.addEventListener("pointercancel", onPointerUp);
    node.addEventListener("contextmenu", onContextMenu);
    node.addEventListener("click", onClick, true);
    node.addEventListener("focusin", onFocusIn);
    node.addEventListener("focusout", onFocusOut);
    node.addEventListener("keydown", onKeyDown);

    return () => {
      node.removeEventListener("pointerenter", onPointerEnter);
      node.removeEventListener("pointerleave", onPointerLeave);
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerup", onPointerUp);
      node.removeEventListener("pointercancel", onPointerUp);
      node.removeEventListener("contextmenu", onContextMenu);
      node.removeEventListener("click", onClick, true);
      node.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("focusout", onFocusOut);
      node.removeEventListener("keydown", onKeyDown);
      // Timers are left running: a ref that merely re-attaches (a parent
      // re-rendering with an inline ref) must not cancel a pending tooltip.
      // `open` checks the anchor is still in the page, and `dispose` clears
      // everything when the tooltip itself unmounts.
      if (anchor === node) anchor = null;
    };
  };

  /** Wires the tooltip itself (its positioner). Returns the cleanup. */
  const bindSurface = (node: HTMLElement) => {
    surface = node;

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || read().persistent) return;
      clearHide();
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const live = read();
      if (live.persistent) return;
      close("hover", event, live.hideDelay);
    };

    const onFocusOut = (event: FocusEvent) => {
      // `relatedTarget` is null when focus goes nowhere focusable (a click on
      // the tooltip's own text, a screen reader browsing): stay open.
      if (read().persistent || !event.relatedTarget) return;
      if (contains(event.relatedTarget)) return;
      close("blur", event);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      // Tab leaves the tooltip the way it came in: forwards to whatever
      // follows the anchor, backwards to the anchor. Never trapped (MD3).
      if (event.key !== "Tab" || hasModifier(event) || !anchor) return;
      const tabbables = getTabbables(node);
      if (tabbables.length === 0) return;

      if (event.shiftKey) {
        if (event.target !== tabbables[0]) return;
        event.preventDefault();
        const target =
          anchor.tabIndex >= 0
            ? anchor
            : (getTabbables(anchor).pop() ?? anchor);
        target.focus();
        return;
      }

      if (event.target !== tabbables[tabbables.length - 1]) return;
      const next = getTabbableAfter(anchor, node);
      if (!next) return;
      event.preventDefault();
      next.focus();
    };

    const onClick = (event: MouseEvent) => {
      // An action was taken: the tooltip has done its job.
      const target = event.target;
      if (!(target instanceof Element)) return;
      const actions = target.closest("[data-slot=tooltip-actions]");
      if (!actions || !node.contains(actions)) return;
      const control = target.closest(
        "button, a[href], [role=button], [role=link]",
      );
      if (!control || !actions.contains(control)) return;
      if (control.matches(":disabled, [aria-disabled=true]")) return;
      if (control.closest("[data-tooltip-keep-open]")) return;
      close("action", event);
    };

    node.addEventListener("pointerenter", onPointerEnter);
    node.addEventListener("pointerleave", onPointerLeave);
    node.addEventListener("focusout", onFocusOut);
    node.addEventListener("keydown", onKeyDown);
    node.addEventListener("click", onClick);

    return () => {
      node.removeEventListener("pointerenter", onPointerEnter);
      node.removeEventListener("pointerleave", onPointerLeave);
      node.removeEventListener("focusout", onFocusOut);
      node.removeEventListener("keydown", onKeyDown);
      node.removeEventListener("click", onClick);
      if (surface === node) surface = null;
    };
  };

  /** Document-level listeners that only matter while the tooltip is open. */
  const whileOpen = () => {
    const popEscape = pushEscapeLayer((event) => {
      close("escape", event);
    });

    // The anchor answers its own presses (`press` / `click`).
    const offPress = onDocumentPress((event) => {
      if (isEventInside(event, surface, anchor)) return;
      close("outside-press", event);
    });

    const onFocusIn = (event: FocusEvent) => {
      // MD3: persistent tooltips "only disappear once a person interacts
      // with another UI element".
      if (!read().persistent || isEventInside(event, surface, anchor)) return;
      close("focus-outside", event);
    };
    document.addEventListener("focusin", onFocusIn, true);

    return () => {
      popEscape();
      offPress();
      document.removeEventListener("focusin", onFocusIn, true);
      clearHide();
    };
  };

  /** Stops every pending timer (the tooltip is going away). */
  const dispose = () => {
    clearShow();
    clearHide();
    endPress();
    window.clearTimeout(swallowTimer);
  };

  return { bindAnchor, bindSurface, whileOpen, close, dispose };
};

export type TooltipController = ReturnType<typeof createTooltipController>;
