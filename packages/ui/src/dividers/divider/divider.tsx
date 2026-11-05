import type * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import { type DividerProps } from "./divider.types";
import { dividerVariants } from "./divider.variants";

/**
 * MD3 divider: a thin `outline-variant` line that groups content in lists and
 * containers. This module carries **no client directive**: it's a pure
 * props→JSX component (Server-Component-safe, works in any framework) with no
 * state, no handlers and no client island.
 *
 * Semantics follow MD3 + WAI-ARIA:
 *
 * - **Decorative by default** (`role="none"`): MD3 treats dividers as decorative,
 *   and most dividers (between list rows, inside cards) only restate grouping the
 *   markup already conveys. A labelled decorative divider keeps its label as
 *   plain, readable text; the lines are pseudo-elements and never reach AT.
 * - **`decorative={false}`** exposes a separator: a native **`<hr>`** for the
 *   plain horizontal case (implicit `separator` role, implicit horizontal
 *   orientation), otherwise **`role="separator"`** with `aria-orientation` when
 *   vertical. A separator's children are presentational, so a string label is
 *   copied to `aria-label` to keep it announced.
 * - It is never focusable. A draggable splitter is a different pattern (APG
 *   "window splitter") and a different component.
 */
const Divider = ({
  className,
  orientation,
  inset,
  weight,
  labelPosition,
  decorative = true,
  asChild = false,
  children,
  ...props
}: DividerProps) => {
  const vertical = orientation === "vertical";
  // `asChild` hands content to the slotted child, so it can't carry a label.
  const labelled = !asChild && children != null && children !== false;

  // A native <hr> only for the plain horizontal separator — it already carries
  // the right role and orientation. Everything else is a <div> (or the child).
  const native = !decorative && !vertical && !labelled && !asChild;
  // Widened (not narrowed to the literal union) so the shared `HTMLElement` ref
  // type-checks against `<hr>`, `<div>` and the slotted child alike.
  const Comp = (
    asChild ? Slot.Root : native ? "hr" : "div"
  ) as React.ElementType;

  const label =
    !decorative && labelled && typeof children === "string"
      ? children
      : undefined;

  return (
    <Comp
      data-slot="divider"
      data-orientation={vertical ? "vertical" : "horizontal"}
      role={decorative ? "none" : native ? undefined : "separator"}
      aria-orientation={!decorative && vertical ? "vertical" : undefined}
      aria-label={label}
      className={cn(
        dividerVariants({
          orientation,
          inset,
          weight,
          labelPosition,
          labelled,
        }),
        className,
      )}
      {...props}
    >
      {labelled ? (
        <span data-slot="divider-label" className="min-w-0">
          {children}
        </span>
      ) : asChild ? (
        children
      ) : null}
    </Comp>
  );
};

export default Divider;
