/*
 * Dismissal shared by every overlay: one **Escape stack** (only the topmost
 * open overlay answers the key) and **outside-press** detection.
 */

/** Return `false` to let the key through to the next layer / the page. */
type EscapeHandler = (event: KeyboardEvent) => boolean | void;

const layers: EscapeHandler[] = [];

const onKeyDown = (event: KeyboardEvent) => {
  if (
    event.key !== "Escape" ||
    event.isComposing ||
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return;
  }
  const top = layers[layers.length - 1];
  if (!top || top(event) === false) return;
  // The overlay consumed the key: a native `<dialog>` underneath (and anything
  // else that honors `defaultPrevented`) stays open. One Escape closes one
  // layer.
  event.preventDefault();
};

/**
 * Registers an overlay as the topmost Escape layer while it's open (WCAG
 * 1.4.13 "dismissible": content shown on hover or focus can be dismissed
 * without moving the pointer or focus). Returns the unregister function.
 */
export const pushEscapeLayer = (handler: EscapeHandler) => {
  if (layers.length === 0) {
    document.addEventListener("keydown", onKeyDown, true);
  }
  layers.push(handler);

  return () => {
    const index = layers.lastIndexOf(handler);
    if (index !== -1) layers.splice(index, 1);
    if (layers.length === 0) {
      document.removeEventListener("keydown", onKeyDown, true);
    }
  };
};

/**
 * Whether an event happened inside any of `elements`. Uses the composed path,
 * so it stays correct across shadow roots and for targets removed mid-event.
 */
export const isEventInside = (
  event: Event,
  ...elements: (Element | null | undefined)[]
) => {
  const path = event.composedPath();
  return elements.some((element) => element != null && path.includes(element));
};

/**
 * Calls `handler` for every press that starts anywhere in the document, in the
 * capture phase (before the pressed element can stop it). Callers decide what
 * counts as "outside" with {@link isEventInside}. Returns the unsubscribe.
 */
export const onDocumentPress = (handler: (event: PointerEvent) => void) => {
  document.addEventListener("pointerdown", handler, true);
  return () => document.removeEventListener("pointerdown", handler, true);
};
