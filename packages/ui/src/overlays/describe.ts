import { getOverlayRoot } from "./top-layer";

const CONTAINER = "data-chatool-descriptions";

/**
 * Gives `anchor` a description that exists **before** its overlay is ever
 * shown: a hidden node holding `text`, which the anchor references with
 * `aria-describedby={id}`. Hidden nodes still count when they're referenced
 * directly, so a screen reader reads the description on focus without the
 * overlay having to open first (touch screen readers never hover or
 * keyboard-focus, so an open-only description would be lost to them). It's
 * the approach of Angular Material's `AriaDescriber`.
 *
 * The node lives in one hidden container per overlay root, so it never
 * disturbs the anchor's siblings. Returns the cleanup that removes it.
 */
export const describe = (anchor: Element, id: string, text: string) => {
  const root = getOverlayRoot(anchor);
  // Direct children only (`:scope` isn't reliable on a shadow root).
  let container = Array.from(root.children).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.hasAttribute(CONTAINER),
  );
  if (!container) {
    container = document.createElement("div");
    container.setAttribute(CONTAINER, "");
    container.hidden = true;
    root.append(container);
  }
  const host = container;

  const node = document.createElement("span");
  node.id = id;
  node.textContent = text;
  host.append(node);

  return () => {
    node.remove();
    if (host.childElementCount === 0) host.remove();
  };
};
