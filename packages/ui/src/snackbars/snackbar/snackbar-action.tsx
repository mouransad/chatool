import { cn } from "@chatool/utils";

import Button from "../../buttons/button/button";
import { type SnackbarActionProps } from "./snackbar.types";
import { ACTION } from "./snackbar.variants";

/**
 * The snackbar's action: MD3's **text button** in `inverse-primary`
 * (`SnackbarTokens.ActionLabelTextColor`), 40dp tall with 12dp side padding
 * (Compose's `TextButton`). MD3: one action at most, never a filled or
 * elevated button ("it draws too much attention").
 *
 * It is `Button` with those presets, so every `Button` prop still applies
 * (`asChild` for a link, `startIcon`, `loading`, …). Inside a `SnackbarHost`,
 * pressing it closes the snackbar with `"action"`.
 */
const SnackbarAction = ({
  className,
  variant = "text",
  size = "s",
  ...props
}: SnackbarActionProps) => (
  <Button
    data-slot="snackbar-action"
    variant={variant}
    size={size}
    className={cn(ACTION, className)}
    {...props}
  />
);

export default SnackbarAction;
