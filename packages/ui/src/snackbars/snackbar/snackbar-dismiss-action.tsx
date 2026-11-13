"use client";

import { cn } from "@chatool/utils";

import IconButton from "../../buttons/icon-button/icon-button";
import Tooltip from "../../overlays/tooltip/tooltip";
import SnackbarCloseIcon from "./snackbar-close-icon";
import { type SnackbarDismissActionProps } from "./snackbar.types";
import { DISMISS } from "./snackbar.variants";

/**
 * The snackbar's optional close affordance (MD3 anatomy: "Icon (optional
 * close affordance)"): a standard icon button with a 24dp ✕ in
 * `inverse-on-surface`, named `label` and, like Compose's, wrapped in a plain
 * tooltip that says the same.
 */
const SnackbarDismissAction = ({
  label = "Dismiss",
  tooltip = true,
  children,
  className,
  ...props
}: SnackbarDismissActionProps) => {
  const button = (
    <IconButton
      data-slot="snackbar-dismiss-action"
      aria-label={label}
      className={cn(DISMISS, className)}
      {...props}
    >
      {children ?? <SnackbarCloseIcon />}
    </IconButton>
  );

  return tooltip ? (
    <Tooltip content={label} side="top">
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default SnackbarDismissAction;
