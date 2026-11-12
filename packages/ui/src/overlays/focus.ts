/*
 * Focus helpers for **non-modal** overlays. An overlay is rendered at the end
 * of its root (see `top-layer.ts`), far from its anchor in DOM order, so the
 * browser's own Tab order would skip it or reach it last. These let an overlay
 * hand focus in and out by hand, as if it sat right after its anchor, without
 * ever trapping it (MD3: "Avoid trapping screen reader and keyboard focus").
 */

const CANDIDATES = [
  "a[href]",
  "area[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "summary",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
].join(",");

const isTabbable = (element: HTMLElement) =>
  element.tabIndex >= 0 &&
  !element.matches(":disabled") &&
  element.closest("[inert]") === null &&
  // Rendered at all (`display: none` has no boxes) and not `visibility: hidden`.
  element.getClientRects().length > 0 &&
  getComputedStyle(element).visibility !== "hidden";

/** Every element inside `root` that Tab can reach, in DOM order. */
export const getTabbables = (root: ParentNode): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(CANDIDATES)).filter(isTabbable);

/**
 * The element Tab would land on after `anchor` if `skip` (the overlay) weren't
 * in the page: the first tabbable that follows `anchor` in the document and is
 * neither inside it nor inside `skip`.
 */
export const getTabbableAfter = (
  anchor: Element,
  skip?: Element | null,
): HTMLElement | null => {
  const root = anchor.getRootNode() as ParentNode;
  return (
    getTabbables(root).find(
      (element) =>
        Boolean(
          anchor.compareDocumentPosition(element) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ) &&
        !anchor.contains(element) &&
        !skip?.contains(element),
    ) ?? null
  );
};

/** Whether `element` currently shows keyboard focus (true if unsupported). */
export const isFocusVisible = (element: EventTarget | null) => {
  if (!(element instanceof Element)) return false;
  try {
    return element.matches(":focus-visible");
  } catch {
    return true;
  }
};
