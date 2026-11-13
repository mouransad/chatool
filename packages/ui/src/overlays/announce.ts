import { getOverlayRoot } from "./top-layer";

const CONTAINER = "data-chatool-announcer";

/** How long a message stays in the live region before it's cleared, in ms. */
const CLEAR_AFTER = 7000;

export type AnnouncePoliteness = "polite" | "assertive";

/**
 * Speaks `text` through a screen reader's **live region**, for overlays that
 * appear without the user asking at that spot: a rich tooltip shown on page
 * load or from code (Compose gives every tooltip popup a live region and a
 * pane title for the same reason). The overlay itself never moves focus.
 *
 * One visually hidden region per overlay root and politeness level, created on
 * first use and kept, because a live region must already be in the page
 * before its content changes for every screen reader to notice. Each call
 * replaces the previous message; it's cleared after a while so a reader
 * browsing the page doesn't stumble on stale text. Returns a cancel function.
 */
export const announce = (
  text: string,
  {
    politeness = "polite",
    near = null,
  }: { politeness?: AnnouncePoliteness; near?: Element | null } = {},
) => {
  const message = text.replace(/\s+/g, " ").trim();
  if (!message) return () => {};

  const root = getOverlayRoot(near);
  const selector = `[${CONTAINER}="${politeness}"]`;
  let region = Array.from(root.children).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.matches(selector),
  );
  if (!region) {
    region = document.createElement("div");
    region.setAttribute(CONTAINER, politeness);
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    region.setAttribute(
      "role",
      politeness === "assertive" ? "alert" : "status",
    );
    // Visually hidden, still in the accessibility tree (`sr-only`).
    Object.assign(region.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: "0",
    });
    root.append(region);
  }
  const host = region;

  // Clear first, then write on the next frame: re-announcing the same text
  // must still count as a change.
  host.textContent = "";
  let clearTimer = 0;
  const frame = window.requestAnimationFrame(() => {
    host.textContent = message;
    clearTimer = window.setTimeout(() => {
      if (host.textContent === message) host.textContent = "";
    }, CLEAR_AFTER);
  });

  return () => {
    window.cancelAnimationFrame(frame);
    window.clearTimeout(clearTimer);
  };
};
