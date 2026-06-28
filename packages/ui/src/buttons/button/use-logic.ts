"use client";

import { type PointerEvent, useCallback, useRef } from "react";

/** MD3 standard easing — WAAPI needs a literal curve, not a CSS variable. */
const RIPPLE_EASING = "cubic-bezier(0.2, 0, 0, 1)";
const RIPPLE_DURATION = 450;
const RIPPLE_OPACITY = 0.18;

/**
 * MD3 press ripple. On pointer-down it spawns an expanding, fading circle that
 * radiates from the pointer into a dedicated overlay (`rippleLayerRef`) using the
 * Web Animations API — no CSS keyframes, no extra deps, and no React
 * reconciliation conflicts (React never owns the ripple nodes; we append/remove
 * them imperatively into an element it renders empty). The ripple paints in the
 * state color (`--_state`) the variant sets on the button, so it matches the
 * `::before` state layer.
 */
export const useButtonLogic = () => {
  const rippleLayerRef = useRef<HTMLSpanElement>(null);

  const spawnRipple = useCallback((event: PointerEvent<HTMLElement>) => {
    const layer = rippleLayerRef.current;
    if (!layer) return;

    const rect = layer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Radius reaches the farthest corner so the ripple always covers the button.
    const radius = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y),
    );

    const ripple = document.createElement("span");
    ripple.style.cssText = `position:absolute;left:${x - radius}px;top:${y - radius}px;width:${radius * 2}px;height:${radius * 2}px;border-radius:9999px;background:var(--_state,currentColor);pointer-events:none;will-change:transform,opacity;`;
    layer.append(ripple);

    const animation = ripple.animate(
      [
        { transform: "scale(0)", opacity: RIPPLE_OPACITY },
        { transform: "scale(1)", opacity: 0 },
      ],
      { duration: RIPPLE_DURATION, easing: RIPPLE_EASING },
    );
    animation.addEventListener("finish", () => ripple.remove());
  }, []);

  return { rippleLayerRef, spawnRipple };
};
