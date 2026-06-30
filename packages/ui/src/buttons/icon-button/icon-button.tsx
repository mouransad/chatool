import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Ripple from "../ripple";
import Spinner from "../spinner";
import { type IconButtonProps } from "./icon-button.types";
import { iconButtonVariants } from "./icon-button.variants";

/**
 * MD3 icon button — an icon-only, square-container member of the button family.
 * Like `Button`, this module carries **no client directive**: it's a pure
 * props→JSX component (Server-Component-safe, works in any framework). `Slot`
 * (`asChild`), `Spinner`, `cn` and `iconButtonVariants` are all directive-free;
 * the only interactive piece — the press ripple — is the family's `"use client"`
 * island (`../ripple`) rendered as a child.
 *
 * It has no visible text, so the accessible name **must** come from `aria-label`
 * (or `aria-labelledby`). When `selected` is set the button is an MD3 **toggle**:
 * it reflects `aria-pressed`, the round shape morphs to square while selected, and
 * `selectedIcon` (if given) replaces the icon. Per the APG, keep the label
 * constant across the toggle.
 */
const IconButton = ({
  className,
  variant,
  size,
  shape,
  selected,
  selectedIcon,
  asChild = false,
  loading = false,
  loadingIndicator,
  disabled,
  type,
  children,
  ...props
}: IconButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";
  const inactive = disabled || loading;
  const isToggle = selected !== undefined;

  const icon = selected ? (selectedIcon ?? children) : children;
  const content = loading ? (loadingIndicator ?? <Spinner />) : icon;

  return (
    <Comp
      data-slot="icon-button"
      data-loading={loading || undefined}
      data-selected={selected || undefined}
      aria-busy={loading || undefined}
      // Reflect the MD3 toggle state only when the button is actually a toggle.
      aria-pressed={isToggle ? selected : undefined}
      // Native `<button>` blocks activation (mouse + keyboard) when disabled or
      // loading; for `asChild` (non-button) we can only mark it via aria.
      disabled={asChild ? undefined : inactive}
      aria-disabled={asChild && inactive ? true : undefined}
      // Default to `type="button"` so a button in a form doesn't submit it by
      // accident (HTML defaults to `submit`). The child controls it for asChild.
      type={asChild ? type : (type ?? "button")}
      className={cn(
        iconButtonVariants({ variant, size, shape, selected: !!selected }),
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {content}
          <Ripple />
        </>
      )}
    </Comp>
  );
};

export default IconButton;
