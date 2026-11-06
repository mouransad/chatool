import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type badgeVariants } from "./badge.variants";

export type { BadgeSize } from "../config";

export interface BadgeProps
  extends
    Omit<React.ComponentPropsWithoutRef<"span">, "children" | "color">,
    Omit<VariantProps<typeof badgeVariants>, "anchored" | "hidden"> {
  /**
   * The count or short status text. Omit it for the MD3 **small** badge (a dot
   * meaning "something new"); pass it for the **large** badge. Numbers above
   * `max` collapse to `max+`; strings longer than `maxLength` are truncated.
   */
  value?: number | string | null;
  /** Largest number shown before collapsing to `max+`. Default `999` (→ `999+`). */
  max?: number;
  /**
   * Longest string label (in user-perceived characters) before it's cut with
   * `…`. Default `4`, MD3's maximum including a `+`. Pass `Infinity` to opt out.
   */
  maxLength?: number;
  /** Keep a numeric `0` visible. By default a zero count hides the badge. */
  showZero?: boolean;
  /**
   * Hide the badge — it shrinks out with MD3 motion and leaves the
   * accessibility tree. MD3: hide a navigation badge once its destination is
   * selected (`invisible={selected}`).
   */
  invisible?: boolean;
  /**
   * BCP 47 locale for the digits, e.g. `"fa"` → `۹۹۹+`, `"ar-EG"` → `٩٩٩+`.
   * Omitted, digits are ASCII and identical on server and client.
   */
  locale?: string;
  /**
   * What assistive tech reads (the visible `999+` is hidden from it). Defaults
   * to the full value (`"1234"`, `"New"`) or MD3's `"New notification"` for a
   * dot. Localize it here, or pass `""` to make the badge purely decorative
   * when the anchor's own `aria-label` already states the count.
   */
  label?: string;
  /**
   * The anchor to badge — usually an icon. The badge positions itself on the
   * anchor's upper trailing corner with the MD3 offsets. Omit it for an inline,
   * standalone badge (e.g. a count at the trailing edge of a list or drawer item).
   */
  children?: React.ReactNode;
  /** Classes for the anchor wrapper (the badge itself takes `className`). */
  anchorClassName?: string;
  /**
   * Make the single child the anchor instead of wrapping it in a `<span>`, via
   * Radix `Slot` — the badge is appended inside that child. The child must be
   * able to contain elements (`<a>`, `<button>`, `<span>`, an avatar — not an
   * `<img>` or `<svg>`).
   */
  asChild?: boolean;
  /** Ref to the badge element (not the anchor). */
  ref?: React.Ref<HTMLSpanElement>;
}
