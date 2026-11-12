import {
  computePosition,
  flip,
  hide,
  offset,
  shift,
  type Middleware,
} from "@floating-ui/dom";

import {
  fromPlacement,
  isOutside,
  resolveSide,
  toPlacement,
  type OverlayAlign,
  type OverlaySide,
  type PhysicalSide,
} from "./placement";

export interface OverlayPositionOptions {
  /** Preferred side of the anchor. */
  side: OverlaySide;
  /** Preferred alignment along that side. */
  align: OverlayAlign;
  /** Gap between the anchor and the overlay (or its caret tip), in px. */
  offset: number;
  /** Extra shift along the alignment axis, in px. */
  alignOffset: number;
  /** Minimum distance kept from the viewport edges, in px. */
  padding: number;
  /** Move to the opposite side / alignment when the preferred one overflows. */
  flip: boolean;
  /** The caret element, if the overlay has one. */
  caret?: HTMLElement | null;
  /** How close the caret may get to the overlay's corners, in px. */
  caretInset: number;
}

export interface OverlayPositionResult {
  /** The side the overlay ended up on, after collisions. */
  side: PhysicalSide;
  /** The alignment it ended up with. */
  align: OverlayAlign;
  /** The anchor is scrolled / clipped out of view. */
  anchorHidden: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

/** Snap to the device pixel grid so text never lands on a half pixel. */
const snap = (value: number) => {
  const ratio = window.devicePixelRatio || 1;
  return Math.round(value * ratio) / ratio;
};

/** A caret overlaps the surface by this much, so no hairline shows between. */
const CARET_OVERLAP = 1;

/**
 * Places `floating` next to `anchor` and writes the result straight onto the
 * element (no React state, so tracking a scrolling anchor never re-renders):
 *
 * - `translate`: the position, in viewport coordinates (`position: fixed`;
 *   Floating UI knows about the top layer).
 * - `data-side` / `data-align`: where it ended up, for styling.
 * - `--_ov-origin`: the point on the anchor-facing edge nearest the anchor's
 *   centre. Entrances scale out of it and a caret hangs from it.
 * - `--_ov-gap`: the distance to the anchor, for the hover bridge.
 * - `data-anchor-hidden`: the anchor is scrolled / clipped out of view.
 *
 * Collisions follow MD3 ("adjust position to avoid going off screen" without
 * covering the parent element): **flip** to the opposite side, or to the
 * mirrored alignment for edge-aligned overlays (the "four rich tooltip
 * locations"), then **shift** along the edge to stay `padding` inside the
 * viewport (MDC's 8dp minimum viewport threshold).
 */
export const positionOverlay = async (
  anchor: Element,
  floating: HTMLElement,
  options: OverlayPositionOptions,
): Promise<OverlayPositionResult> => {
  const rtl = getComputedStyle(floating).direction === "rtl";
  const outside = isOutside(options.align);
  const caret = options.caret ?? null;
  const caretWidth = caret?.offsetWidth ?? 0;
  const caretHeight = caret?.offsetHeight ?? 0;
  // The gap is measured to the caret's tip (the caret tucks `CARET_OVERLAP`
  // under the surface, so that much of it doesn't count).
  const gap = options.offset + Math.max(0, caretHeight - CARET_OVERLAP);

  const middleware: Middleware[] = [
    offset(({ rects, placement }) => {
      const vertical =
        placement.startsWith("top") || placement.startsWith("bottom");
      const beside = vertical ? rects.reference.width : rects.reference.height;
      return {
        mainAxis: gap,
        crossAxis: options.alignOffset,
        // Aligned placements only: `before` / `after` clear the anchor's own
        // span, so the overlay starts where the anchor ends.
        alignmentAxis: (outside ? beside : 0) + options.alignOffset,
      };
    }),
  ];
  if (options.flip) {
    middleware.push(
      flip({
        padding: options.padding,
        // A centred overlay only changes side; `shift` keeps it on screen. An
        // aligned one may also mirror its alignment before it shifts.
        crossAxis: options.align === "center" ? false : "alignment",
        fallbackAxisSideDirection: "none",
      }),
    );
  }
  middleware.push(shift({ padding: options.padding }), hide());

  const { x, y, placement, middlewareData } = await computePosition(
    anchor,
    floating,
    {
      strategy: "fixed",
      placement: toPlacement(resolveSide(options.side, rtl), options.align),
      middleware,
    },
  );

  const left = snap(x);
  const top = snap(y);
  const { side, align } = fromPlacement(placement, outside);
  const anchorHidden = Boolean(middlewareData.hide?.referenceHidden);

  floating.style.translate = `${left}px ${top}px`;
  floating.dataset.side = side;
  floating.dataset.align = align;
  floating.toggleAttribute("data-anchor-hidden", anchorHidden);
  floating.style.setProperty("--_ov-gap", `${gap}px`);

  // The anchor's centre in the overlay's own box.
  const anchorRect = anchor.getBoundingClientRect();
  const width = floating.offsetWidth;
  const height = floating.offsetHeight;
  const centerX = anchorRect.left + anchorRect.width / 2 - left;
  const centerY = anchorRect.top + anchorRect.height / 2 - top;
  const originX = clamp(centerX, 0, width);
  const originY = clamp(centerY, 0, height);
  const origin: Record<PhysicalSide, string> = {
    top: `${originX}px 100%`,
    bottom: `${originX}px 0%`,
    left: `100% ${originY}px`,
    right: `0% ${originY}px`,
  };
  floating.style.setProperty("--_ov-origin", origin[side]);

  if (caret) {
    // The caret is drawn pointing down; it's rotated to face the anchor and
    // kept `caretInset` away from the overlay's corners.
    const reach = options.caretInset + caretWidth / 2;
    const caretX = clamp(centerX, Math.min(reach, width / 2), width - reach);
    const caretY = clamp(centerY, Math.min(reach, height / 2), height - reach);
    const along = caretHeight / 2 - CARET_OVERLAP;
    const center: Record<PhysicalSide, [number, number, string]> = {
      top: [caretX, height + along, "0deg"],
      bottom: [caretX, -along, "180deg"],
      left: [width + along, caretY, "-90deg"],
      right: [-along, caretY, "90deg"],
    };
    const [caretCenterX, caretCenterY, rotate] = center[side];
    caret.style.left = `${caretCenterX - caretWidth / 2}px`;
    caret.style.top = `${caretCenterY - caretHeight / 2}px`;
    caret.style.rotate = rotate;
  }

  return { side, align, anchorHidden };
};
