"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { cn } from "@chatool/utils";

/*
 * The label's classes live here, not in `fab.variants.ts`: if this island
 * shared a module with `fab.tsx`, the bundler would hoist both into one chunk
 * and the `"use client"` boundary (entry-level in tsdown) would be lost.
 */

/**
 * Label clip. After hydration its width is `--_lwx` = `measured px ×
 * --chatool-fab-expansion`, where `--chatool-fab-expansion` is the FAB's **expansion progress** (a registered
 * `<number>`: `1` expanded, `0` collapsed) that the container springs between
 * 0 and 1. Multiplying (instead of transitioning `width` itself) means:
 *
 * - expand ⇄ collapse rides the spatial spring, overshoot included, exactly
 *   like Compose's `lerp(minWidth, expandedWidth, progress)`;
 * - a label that changes size mid-flight (a responsive size change morphing
 *   the font, a late web font, a new string) is followed **instantly**, never
 *   clipped by a lagging width transition.
 *
 * Before hydration (or without JS) it falls back to `--_lw` (`0px` while
 * collapsed) or `auto`: correct, just not animated. Opacity (`--_lo`) rides the
 * fast effects spring.
 */
const CLIP =
  "inline-flex h-full items-center overflow-hidden w-[var(--_lwx,var(--_lw,auto))] opacity-[var(--_lo,1)] [transition:opacity_var(--_ed)_var(--_effects)]";

/** Label text: never wraps or truncates (MD3), measured at its max-content width. */
const TEXT = "block w-max";

/** The icon↔label space lives on the text, so it folds away with the label. */
const GAP = "ps-[var(--_gap)]";

/** The expansion-progress custom property the FAB container springs. */
const PROGRESS = "--chatool-fab-expansion";

let progressRegistered = false;

/**
 * Register `--chatool-fab-expansion` as an inheritable `<number>` (initial `1`) so CSS can
 * *interpolate* it — an unregistered custom property only flips discretely.
 * Once per page; if `CSS.registerProperty` is missing the FAB still expands
 * and collapses correctly, just without the width spring.
 */
const registerProgress = () => {
  if (progressRegistered) return;
  progressRegistered = true;
  if (typeof CSS === "undefined" || !("registerProperty" in CSS)) return;
  try {
    CSS.registerProperty({
      name: PROGRESS,
      syntax: "<number>",
      inherits: true,
      initialValue: "1",
    });
  } catch {
    // Already registered (e.g. by another copy of the library) — fine.
  }
};

interface FabLabelProps {
  /** The visible label (text or nodes). */
  children: ReactNode;
  /** Reserve the icon↔label gap (only when the FAB also has an icon). */
  withGap: boolean;
}

/**
 * The extended FAB's label — the FAB's only client island besides the shared
 * press ripple, so `Fab` itself stays a Server Component.
 *
 * CSS can't animate `width` to or from `auto` in every browser yet, so this
 * island measures the label's intrinsic width with a `ResizeObserver` (which
 * also tracks font loading, locale and content changes, and ignores the FAB's
 * show/hide `scale`) and writes `--_lwx: calc(<width>px * var(--chatool-fab-expansion))` on
 * the clipping wrapper. See `CLIP` for why the width is a product.
 */
const FabLabel = ({ children, withGap }: FabLabelProps) => {
  const clipRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Layout effect: measure before the first post-hydration paint, so even an
  // immediate collapse starts from a real length.
  useLayoutEffect(() => {
    const clip = clipRef.current;
    const text = textRef.current;
    if (!clip || !text) return;

    registerProgress();

    const write = (width: number) => {
      clip.style.setProperty(
        "--_lwx",
        `calc(${Math.ceil(width)}px * var(${PROGRESS}, 1))`,
      );
    };
    write(text.offsetWidth);

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.borderBoxSize?.[0];
      write(box ? box.inlineSize : text.offsetWidth);
    });
    observer.observe(text);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={clipRef} data-slot="fab-label" className={CLIP}>
      <span ref={textRef} className={cn(TEXT, withGap && GAP)}>
        {children}
      </span>
    </span>
  );
};

export default FabLabel;
