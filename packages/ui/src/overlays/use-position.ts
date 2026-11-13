"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { autoUpdate, type ReferenceElement } from "@floating-ui/dom";

import { positionOverlay, type OverlayPositionOptions } from "./position";
import { showInTopLayer } from "./top-layer";

interface UseOverlayPositionOptions extends Omit<
  OverlayPositionOptions,
  "caret"
> {
  /** The overlay is rendered and should be placed and tracked. */
  active: boolean;
  /** The anchor: an element, or a virtual one (`getBoundingClientRect`). */
  anchorRef: RefObject<ReferenceElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  caretRef?: RefObject<HTMLElement | null>;
  /**
   * Called with `true` after the first placement (the overlay may now show)
   * and with `false` when tracking stops.
   */
  onPlacedChange?: (placed: boolean) => void;
  /** Called whenever the anchor is scrolled / clipped out of view. */
  onAnchorHidden?: () => void;
}

/**
 * Promotes an overlay into the top layer, places it next to its anchor and
 * **keeps it there**: Floating UI's `autoUpdate` re-runs the placement when
 * anything scrolls or resizes, or when the anchor moves in the layout. Every
 * update is written straight to the DOM (`position.ts`), never to React state;
 * `onPlacedChange` reports the first placement, so the entrance can start from
 * the right spot.
 */
export const useOverlayPosition = ({
  active,
  anchorRef,
  floatingRef,
  caretRef,
  onPlacedChange,
  onAnchorHidden,
  side,
  align,
  offset,
  alignOffset,
  padding,
  flip,
  caretInset,
  step,
}: UseOverlayPositionOptions) => {
  const callbacks = useRef({ onPlacedChange, onAnchorHidden });

  useLayoutEffect(() => {
    callbacks.current = { onPlacedChange, onAnchorHidden };
  });

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!active || !anchor || !floating) return;

    showInTopLayer(floating);

    let cancelled = false;
    const update = () => {
      void positionOverlay(anchor, floating, {
        side,
        align,
        offset,
        alignOffset,
        padding,
        flip,
        caretInset,
        step,
        caret: caretRef?.current,
      }).then((result) => {
        if (cancelled) return;
        callbacks.current.onPlacedChange?.(true);
        if (result.anchorHidden) callbacks.current.onAnchorHidden?.();
      });
    };
    const stop = autoUpdate(anchor, floating, update);

    return () => {
      cancelled = true;
      stop();
      callbacks.current.onPlacedChange?.(false);
    };
  }, [
    active,
    anchorRef,
    floatingRef,
    caretRef,
    side,
    align,
    offset,
    alignOffset,
    padding,
    flip,
    caretInset,
    step,
  ]);
};
