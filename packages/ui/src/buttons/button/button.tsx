import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Ripple from "../ripple";
import Spinner from "../spinner";
import { type ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

/**
 * MD3 common button. This module carries **no client directive**: it's a pure
 * props→JSX component (Server-Component-safe, works in any framework). `Slot`
 * (`asChild`), `Spinner`, `cn` and `buttonVariants` are all directive-free; the
 * only interactive piece — the press ripple — is a separate client-only island
 * (`../ripple`) rendered as a child, so the button stays server-renderable while
 * remaining fully interactive in client contexts.
 */
const Button = ({
  className,
  variant,
  size,
  shape,
  asChild = false,
  startIcon,
  endIcon,
  loading = false,
  loadingPosition = "center",
  loadingIndicator,
  disabled,
  type,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";
  const inactive = disabled || loading;

  const indicator = loadingIndicator ?? <Spinner />;
  const centerLoading = loading && loadingPosition === "center";

  const label = centerLoading ? (
    <>
      <span className="invisible inline-flex items-center [gap:inherit]">
        {startIcon}
        {children}
        {endIcon}
      </span>
      <span className="inset-0 absolute flex items-center justify-center">
        {indicator}
      </span>
    </>
  ) : (
    <>
      {loading && loadingPosition === "start" ? indicator : startIcon}
      {children}
      {loading && loadingPosition === "end" ? indicator : endIcon}
    </>
  );

  // `asChild` defers content to the single child (Slot wants one child), so the
  // icon / loading slots and the ripple island only apply to the plain button.
  const content = asChild ? (
    children
  ) : (
    <>
      {label}
      <Ripple />
    </>
  );

  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      // Native `<button>` blocks activation (mouse + keyboard) when disabled or
      // loading; for `asChild` (non-button) we can only mark it via aria.
      disabled={asChild ? undefined : inactive}
      aria-disabled={asChild && inactive ? true : undefined}
      // Default to `type="button"` so a button in a form doesn't submit it by
      // accident (HTML defaults to `submit`). The child controls it for asChild.
      type={asChild ? type : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    >
      {content}
    </Comp>
  );
};

export default Button;
