"use client";

import { useEffect, useRef } from "react";

/** MD3 standard easing — WAAPI needs a literal curve, not a CSS variable. */
const RIPPLE_EASING = "cubic-bezier(0.2, 0, 0, 1)";
const RIPPLE_DURATION = 450;
const RIPPLE_OPACITY = 0.18;

/**
 * MD3 press ripple — the button family's only client island, so `Button` itself
 * can stay a Server Component. It renders an empty, `aria-hidden` overlay and,
 * on mount, attaches a `pointerdown` listener to its **parent** (the button).
 * Each press spawns an expanding, fading circle (Web Animations API) into the
 * overlay, radiating from the pointer and painted in the variant's `--_state`
 * color. No CSS keyframes, no extra deps, and React never owns the ripple
 * nodes (appended/removed imperatively into an element it renders empty), so
 * there's no reconciliation conflict.
 *
 * It self-attaches instead of taking an `onPointerDown` prop so the parent needs
 * no event wiring — keeping the button directive-free. Presses are ignored when
 * the host is disabled / loading (`[data-loading]`) or the pointer isn't primary.
 */
const Ripple = () => {
  const layerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.button !== 0 ||
        host.matches(":disabled") ||
        host.hasAttribute("data-loading")
      ) {
        return;
      }

      const rect = layer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // Radius reaches the farthest corner so the ripple always covers the host.
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
    };

    host.addEventListener("pointerdown", onPointerDown);
    return () => host.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <span
      ref={layerRef}
      aria-hidden
      className="inset-0 pointer-events-none absolute -z-10 overflow-hidden rounded-[inherit]"
    />
  );
};

export default Ripple;
