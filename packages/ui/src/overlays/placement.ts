import { type Placement } from "@floating-ui/dom";

/**
 * Which side of the anchor an overlay sits on. `start` / `end` are **logical**
 * (they follow the writing direction, like Compose's
 * `TooltipAnchorPosition.Start` / `End`); `left` / `right` are physical.
 */
export type OverlaySide = "top" | "bottom" | "start" | "end" | "left" | "right";

/**
 * How the overlay lines up with the anchor along that side:
 *
 * - `center`: centred on the anchor.
 * - `start` / `end`: its start / end edge flush with the anchor's (logical).
 * - `before` / `after`: entirely **beside** the anchor, so the two only meet
 *   at a corner. `bottom` + `after` is MD3's default rich-tooltip spot, "the
 *   bottom right of the parent element".
 */
export type OverlayAlign = "start" | "center" | "end" | "before" | "after";

/** A resolved, physical side. */
export type PhysicalSide = "top" | "bottom" | "left" | "right";

/** Resolves a logical side against the writing direction. */
export const resolveSide = (side: OverlaySide, rtl: boolean): PhysicalSide => {
  if (side === "start") return rtl ? "right" : "left";
  if (side === "end") return rtl ? "left" : "right";
  return side;
};

/** `before` / `after` sit beside the anchor instead of overlapping its span. */
export const isOutside = (align: OverlayAlign) =>
  align === "before" || align === "after";

/**
 * The Floating UI placement for a side + alignment. `after` starts from
 * `-start` and `before` from `-end`; `position.ts` then pushes them past the
 * anchor by its own size, and a flipped alignment lands on the mirror corner.
 */
export const toPlacement = (
  side: PhysicalSide,
  align: OverlayAlign,
): Placement => {
  if (align === "center") return side;
  return `${side}-${align === "end" || align === "before" ? "end" : "start"}`;
};

/** Reads a final placement back as the side + alignment that was applied. */
export const fromPlacement = (
  placement: Placement,
  outside: boolean,
): { side: PhysicalSide; align: OverlayAlign } => {
  const [side, alignment] = placement.split("-") as [
    PhysicalSide,
    "start" | "end" | undefined,
  ];
  if (!alignment) return { side, align: "center" };
  if (!outside) return { side, align: alignment };
  return { side, align: alignment === "start" ? "after" : "before" };
};
