/*
 * Shared Material 3 Expressive size scale (XS–XL) for the button family.
 * `labelSize` is for buttons with a text label; `iconSize` is for square,
 * icon-only buttons. Default size across components is `s` (40dp).
 */
export type ButtonSize = "xs" | "s" | "m" | "l" | "xl";

/** Label buttons: height + gap + horizontal padding + label typescale + icon. */
export const labelSize: Record<ButtonSize, string> = {
  xs: "h-8 gap-1.5 px-3 text-label-large [&_svg]:size-5",
  s: "h-10 gap-2 px-4 text-label-large [&_svg]:size-5",
  m: "h-14 gap-2.5 px-6 text-title-medium [&_svg]:size-6",
  l: "h-24 gap-3 px-8 text-headline-small [&_svg]:size-8",
  xl: "h-34 gap-3.5 px-12 text-headline-large [&_svg]:size-10",
};

/** Icon-only (square) buttons: container size + icon size. */
export const iconSize: Record<ButtonSize, string> = {
  xs: "size-8 [&_svg]:size-5",
  s: "size-10 [&_svg]:size-6",
  m: "size-14 [&_svg]:size-7",
  l: "size-24 [&_svg]:size-9",
  xl: "size-34 [&_svg]:size-11",
};

/** Square-shape corner radius per size (used when `shape="square"`). */
export const squareCorner: Record<ButtonSize, string> = {
  xs: "rounded-md",
  s: "rounded-lg",
  m: "rounded-lg",
  l: "rounded-xl",
  xl: "rounded-xl",
};
