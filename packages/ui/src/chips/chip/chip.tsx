import { cn } from "@chatool/utils";

import Spinner from "../../buttons/spinner";
import ChipActions from "./chip-actions";
import ChipCheckIcon from "./chip-check-icon";
import ChipRemoveIcon from "./chip-remove-icon";
import { type ChipProps } from "./chip.types";
import {
  ACTION,
  AVATAR,
  CHECK_REVEAL,
  CHECK_SWAP,
  ICON,
  ICON_SWAP,
  LABEL,
  LEADING,
  REMOVE,
  REMOVE_ICON,
  REMOVE_ONLY,
  REMOVE_ONLY_ICON,
  REMOVE_RIPPLE,
  SPINNER,
  TRAILING,
  chipVariants,
} from "./chip.variants";

/**
 * MD3 chip — assist, filter, input or suggestion — with M3 Expressive shape
 * morph and motion. This module carries **no client directive**: it's a pure
 * props → JSX shell (Server-Component-safe, works in any framework). It renders
 * the container and the leading / trailing glyphs, and every visual state is
 * CSS driven from attributes. The interactive part — the primary and remove
 * actions, set selection and keyboard — is the `chip-actions` client island.
 *
 * Anatomy (MD3): container · leading icon or avatar (optional; a filter chip
 * gains a checkmark while selected) · label · trailing icon (a remove action on
 * input chips, optional on filter chips).
 */
const Chip = ({
  className,
  style,
  variant,
  elevated = false,
  expressive = true,
  icon,
  avatar,
  trailingIcon,
  selectedIcon,
  removeIcon,
  dragged = false,
  loading = false,
  actionClassName,
  ...props
}: ChipProps) => {
  const kind = variant ?? "assist";
  const hasAvatar = avatar !== undefined && avatar !== null;
  const hasIcon = icon !== undefined && icon !== null;
  // Filter chips gain a leading checkmark while selected unless opted out
  // (an avatar takes the leading slot, like Compose's `leadingContent`).
  const hasCheck = kind === "filter" && selectedIcon !== false && !hasAvatar;

  const leadingKind = hasAvatar
    ? "avatar"
    : loading || hasIcon
      ? "icon"
      : hasCheck
        ? "check"
        : undefined;

  const leading = leadingKind ? (
    <span data-slot="chip-leading" aria-hidden className={LEADING}>
      {hasAvatar ? (
        <span data-slot="chip-avatar" className={AVATAR}>
          {avatar}
        </span>
      ) : loading ? (
        <Spinner className={SPINNER} />
      ) : hasIcon ? (
        <span data-slot="chip-icon" className={cn(ICON, hasCheck && ICON_SWAP)}>
          {icon}
        </span>
      ) : null}
      {hasCheck && !loading ? (
        <span
          data-slot="chip-check"
          className={cn(ICON, hasIcon ? CHECK_SWAP : CHECK_REVEAL)}
        >
          {selectedIcon ?? <ChipCheckIcon />}
        </span>
      ) : null}
    </span>
  ) : null;

  const hasTrailing = trailingIcon !== undefined && trailingIcon !== null;
  const trailing = hasTrailing ? (
    <span data-slot="chip-trailing-icon" aria-hidden className={TRAILING}>
      {trailingIcon}
    </span>
  ) : null;

  return (
    <span
      data-slot="chip"
      data-variant={kind}
      data-elevated={elevated || undefined}
      data-expressive={expressive || undefined}
      data-leading={leadingKind}
      data-trailing={hasTrailing ? "icon" : undefined}
      data-dragged={dragged ? "true" : undefined}
      data-loading={loading || undefined}
      className={cn(
        chipVariants({ variant: kind, elevated, expressive }),
        className,
      )}
      style={style}
    >
      <ChipActions
        variant={kind}
        loading={loading}
        leading={leading}
        trailing={trailing}
        removeGlyph={removeIcon ?? <ChipRemoveIcon />}
        classes={{
          action: cn(ACTION, actionClassName),
          label: LABEL,
          remove: REMOVE,
          removeOnly: REMOVE_ONLY,
          removeIcon: REMOVE_ICON,
          removeOnlyIcon: REMOVE_ONLY_ICON,
          removeRipple: REMOVE_RIPPLE,
        }}
        {...props}
      />
    </span>
  );
};

export default Chip;
