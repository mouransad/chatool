/*
 * The browser's **top layer**, through the native Popover API. An element
 * shown with `showPopover()` renders above every stacking context, `overflow`
 * clip and modal `<dialog>`, wherever it sits in the DOM, so overlays need no
 * `z-index` scale. `popover="manual"` gives exactly that and nothing else: no
 * light dismiss and no focus changes; those stay ours.
 *
 * Browsers without the Popover API ignore the attribute and the overlay falls
 * back to `position: fixed` + `z-index` (see `POSITIONER` in `config.ts`).
 */

const canPopover = (element: HTMLElement) =>
  typeof element.showPopover === "function";

const isPopoverOpen = (element: HTMLElement) => {
  try {
    return element.matches(":popover-open");
  } catch {
    // The selector itself is unknown to browsers without the Popover API.
    return false;
  }
};

/** Promote a `popover="manual"` element into the top layer. */
export const showInTopLayer = (element: HTMLElement) => {
  if (!canPopover(element) || !element.isConnected || isPopoverOpen(element)) {
    return;
  }
  try {
    element.showPopover();
  } catch {
    // Not a popover, or detached in between: the fixed fallback still shows it.
  }
};

/**
 * Where an overlay anchored to `anchor` must be rendered:
 *
 * - inside the nearest open `<dialog>`: everything outside a **modal** dialog
 *   is inert, so an overlay portalled to `<body>` would be unclickable and
 *   invisible to assistive technology;
 * - inside the fullscreen element, for browsers without the top layer;
 * - inside the anchor's shadow root, so its styles and ID references resolve;
 * - otherwise `<body>`.
 */
export const getOverlayRoot = (anchor: Element | null): HTMLElement => {
  const dialog = anchor?.closest<HTMLElement>("dialog[open]");
  if (dialog) return dialog;

  const fullscreen = document.fullscreenElement;
  if (
    anchor &&
    fullscreen instanceof HTMLElement &&
    fullscreen.contains(anchor)
  ) {
    return fullscreen;
  }

  const root = anchor?.getRootNode();
  if (typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot) {
    // A shadow root is a valid portal container for our purposes.
    return root as unknown as HTMLElement;
  }

  return document.body;
};
