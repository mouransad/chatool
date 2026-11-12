import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Ripple from "../ripple";
import FabLabel from "./fab-label";
import { type FabProps } from "./fab.types";
import {
  baseValue,
  fabIconClass,
  fabResponsiveClasses,
  fabVariants,
} from "./fab.variants";

/**
 * MD3 Expressive **FAB** and **extended FAB** in one element — the primary,
 * constructive action of a screen.
 *
 * - `icon` only → a FAB (give it an `aria-label`).
 * - `label` (+ optional `icon`) → an extended FAB.
 * - `expanded={false}` (or a per-window-class object) → the extended FAB
 *   collapses into a FAB on an Expressive spring: the label folds away, the
 *   icon glides to the center, the container squares off. MD3 uses this on
 *   scroll and across breakpoints.
 *
 * This module carries **no client directive**: it's a props→JSX component
 * (Server-Component-safe in Next App Router, and fine in any framework). Size,
 * expansion, responsive breakpoints, show/hide and the entrance are all CSS.
 * The two interactive pieces are client islands rendered as children: the
 * shared press `Ripple` and `FabLabel`, which measures the label so its width
 * can spring.
 *
 * Accessibility (MD3 + WAI-ARIA APG button): a native `<button>` (Tab to
 * focus, Enter / Space to activate) that defaults to `type="button"`. The icon
 * is decorative (`aria-hidden`); the label — visible or folded away — is the
 * accessible name, so collapsing never changes what assistive tech announces.
 * `visible={false}` makes it `inert` (out of the tab order and the
 * accessibility tree) instead of disabling it, as MD3 asks.
 */
const Fab = ({
  className,
  icon,
  label,
  expanded,
  size,
  color,
  elevation,
  placement,
  visible = true,
  asChild = false,
  type,
  children,
  ...props
}: FabProps) => {
  const Comp = asChild ? Slot.Root : "button";

  const hasLabel = label !== undefined && label !== null && label !== false;
  const hasIcon = icon !== undefined && icon !== null && icon !== false;
  // Only an extended FAB that has an icon to fall back on can collapse; an
  // icon-only FAB is always in the collapsed (square) geometry.
  const collapsible = hasLabel && hasIcon;
  const collapsed = hasLabel ? collapsible && !baseValue(expanded, true) : true;

  const content = (
    <>
      {hasIcon ? (
        <span data-slot="fab-icon" aria-hidden className={fabIconClass}>
          {icon}
        </span>
      ) : null}
      {hasLabel ? <FabLabel withGap={hasIcon}>{label}</FabLabel> : null}
      <Ripple />
    </>
  );

  return (
    <Comp
      data-slot="fab"
      data-extended={hasLabel || undefined}
      // Reflects the base (compact) expansion; responsive objects resolve in CSS.
      data-collapsed={(hasLabel && collapsed) || undefined}
      // A hidden FAB leaves the tab order and the accessibility tree.
      inert={visible ? undefined : true}
      // Default to `type="button"` so a FAB inside a form never submits it by
      // accident. With `asChild` the child element owns its own semantics.
      type={asChild ? type : (type ?? "button")}
      className={cn(
        fabVariants({
          size: baseValue(size, "medium"),
          color,
          elevation,
          placement,
          collapsed,
          visible,
        }),
        fabResponsiveClasses({ size, expanded, collapsible }),
        className,
      )}
      {...props}
    >
      {/* With `asChild` the child (e.g. `<a href>`) becomes the FAB and our
          content fills it. `Slottable` must be a direct child of the Slot. */}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : null}
      {content}
    </Comp>
  );
};

export default Fab;
