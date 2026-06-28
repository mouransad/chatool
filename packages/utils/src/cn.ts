import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The Material Design 3 typescale (shipped by `@chatool/core`) is exposed as
 * Tailwind `text-*` font-size utilities — `text-label-large`, `text-title-medium`,
 * `text-headline-small`, … tailwind-merge doesn't know these custom names are
 * font sizes, so out of the box it mistakes them for **text colors** and will
 * drop a real color utility that sits alongside one of them, e.g.
 * `cn("text-label-large", "text-[color:var(--fg)]")` would silently lose the color.
 *
 * Registering the 15 typescale roles as font sizes lets the typescale and a token
 * color coexist (separate conflict groups) while still letting a later `text-*`
 * size or color override correctly. The list is the fixed MD3 set and mirrors
 * `@chatool/core`'s `--md-sys-typescale-*` roles.
 */
const TYPESCALE_FONT_SIZES = [
  "display-large",
  "display-medium",
  "display-small",
  "headline-large",
  "headline-medium",
  "headline-small",
  "title-large",
  "title-medium",
  "title-small",
  "body-large",
  "body-medium",
  "body-small",
  "label-large",
  "label-medium",
  "label-small",
];

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: TYPESCALE_FONT_SIZES }] } },
});

/**
 * Merge class names with `clsx` semantics and de-duplicate conflicting
 * Tailwind utilities with `tailwind-merge` (taught about the MD3 typescale).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
