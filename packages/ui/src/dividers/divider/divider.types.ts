import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type dividerVariants } from "./divider.variants";

export type { DividerOrientation } from "../config";

export interface DividerProps
  extends
    Omit<React.ComponentPropsWithoutRef<"div">, "role">,
    Omit<VariantProps<typeof dividerVariants>, "labelled"> {
  /**
   * `true` (default, per MD3: "dividers are decorative elements") renders
   * `role="none"`, so assistive tech skips the line. `false` exposes a real
   * separator: an `<hr>` for a plain horizontal divider, otherwise
   * `role="separator"` (+ `aria-orientation="vertical"` when vertical). Use
   * `false` for a thematic break between topics, or between groups in a menu.
   */
  decorative?: boolean;
  /**
   * Override the computed role (e.g. `"presentation"`). Usually leave it to
   * `decorative`.
   */
  role?: React.AriaRole;
  /**
   * Render the divider onto its single child via Radix `Slot`, e.g.
   * `<Divider asChild><li /></Divider>` inside a `<ul>` or `role="menu"`. The
   * label (`children`) is not supported in this mode.
   */
  asChild?: boolean;
  /**
   * Optional label drawn between two line segments ("— or —"). Placed with
   * `labelPosition`. A string label also becomes the separator's `aria-label`
   * when `decorative={false}`.
   */
  children?: React.ReactNode;
  /** Ref to the rendered element (`<div>`, `<hr>`, or the `asChild` child). */
  ref?: React.Ref<HTMLElement>;
}
