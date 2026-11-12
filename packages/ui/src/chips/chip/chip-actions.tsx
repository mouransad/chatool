"use client";

import { useContext, useId, useState } from "react";
import type * as React from "react";
import { Slot } from "radix-ui";

import Ripple from "../../buttons/ripple";
import ChipSetContext, {
  CHIP_SELECTOR,
  getChipPrimary,
  getChipRemove,
  isForwardKey,
  removeChip,
} from "../chip-set/chip-set-context";
import type { ChipVariant } from "../config";
import { type ChipProps } from "./chip.types";

/** Class strings computed by the server view (keeps this island config-free). */
export interface ChipActionsClasses {
  action: string;
  label: string;
  remove: string;
  removeOnly: string;
  removeIcon: string;
  removeOnlyIcon: string;
  removeRipple: string;
}

type ChipActionsProps = Omit<
  ChipProps,
  | "className"
  | "style"
  | "variant"
  | "elevated"
  | "expressive"
  | "icon"
  | "avatar"
  | "trailingIcon"
  | "selectedIcon"
  | "removeIcon"
  | "dragged"
  | "actionClassName"
> & {
  variant: ChipVariant;
  /** The server-rendered leading slot (icon / avatar / checkmark / spinner). */
  leading: React.ReactNode;
  /** The server-rendered decorative trailing icon. */
  trailing: React.ReactNode;
  /** The server-rendered remove glyph. */
  removeGlyph: React.ReactNode;
  classes: ChipActionsClasses;
};

const isRemoveKey = (key: string) => key === "Backspace" || key === "Delete";

/**
 * The chip's **actions**, as one small client island: the primary action
 * (`<button>`, `<a>`, your `asChild` element, or a remove-only chip's inert
 * `<span>`) and the optional remove `<button>`. Everything else — the
 * container, its colors, shape morph, outline, elevation, the leading and
 * trailing glyphs — is the server-rendered `Chip` shell, driven by CSS from
 * the attributes set here (`data-selected`, `data-disabled`, `aria-pressed`).
 *
 * It's client code because it has to: it reads the optional `ChipSet`
 * context (set selection, disabled, removal), owns an uncontrolled
 * `defaultSelected`, and wires the keyboard. Client components still render
 * on the server, so the chip's selection is in the first HTML paint.
 *
 * Keyboard (MD3 chips accessibility + Material Web's multi-action chip):
 * Enter / Space activate natively; ←/→ (mirrored in RTL) move between the
 * primary and remove actions and, at the edges, bubble to the `ChipSet`;
 * Backspace / Delete remove a removable chip, after which focus moves to the
 * neighbouring chip.
 */
const ChipActions = ({
  variant,
  value,
  selected,
  defaultSelected,
  onSelectedChange,
  onClick,
  onKeyDown,
  removable,
  onRemove,
  removeLabel,
  removeOnly = false,
  loading = false,
  softDisabled = false,
  disabled,
  href,
  target,
  rel,
  download,
  hrefLang,
  referrerPolicy,
  asChild = false,
  id,
  type,
  leading,
  trailing,
  removeGlyph,
  classes,
  children,
  ...props
}: ChipActionsProps) => {
  const set = useContext(ChipSetContext);
  const generatedId = useId();
  const [ownSelected, setOwnSelected] = useState(defaultSelected ?? false);

  const actionId = id ?? `${generatedId}action`;
  const removeTextId = `${generatedId}remove`;
  const isLink = href !== undefined && !asChild;

  // Selection: filter chips always toggle; input chips toggle once something
  // asks for selection (a prop, a callback, or a selectable set).
  const canSelect =
    (variant === "filter" || variant === "input") && !removeOnly;
  const inSet =
    canSelect && set !== null && set.selectable && value !== undefined;
  const toggleable =
    canSelect &&
    !isLink &&
    (variant === "filter" ||
      inSet ||
      selected !== undefined ||
      defaultSelected !== undefined ||
      onSelectedChange !== undefined);
  const isSelected =
    toggleable && (inSet ? set.isSelected(value) : (selected ?? ownSelected));

  // Links can't be disabled (Material Web); everything else follows the prop
  // or a disabled set.
  const isDisabled = !isLink && (disabled === true || set?.disabled === true);
  const isOff = isDisabled || softDisabled;
  const inert = isOff || loading;

  const hasRemove =
    removeOnly ||
    removable === true ||
    onRemove !== undefined ||
    (variant === "input" && value !== undefined && set?.onRemove !== undefined);

  const remove = (event: React.SyntheticEvent<HTMLElement>) => {
    if (isOff) return;
    const run = () => {
      onRemove?.(event);
      if (!event.defaultPrevented && value !== undefined) {
        set?.onRemove?.(value);
      }
    };
    const chip = event.currentTarget.closest<HTMLElement>(CHIP_SELECTOR);
    if (chip) removeChip(chip, run);
    else run();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (inert) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented || !toggleable) return;
    const next = !isSelected;
    if (inSet) set.toggle(value, next);
    else if (selected === undefined) setOwnSelected(next);
    onSelectedChange?.(next, event);
  };

  const handlePrimaryKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
    if (event.defaultPrevented || !hasRemove) return;
    if (isRemoveKey(event.key)) {
      // Remove first: `onRemove` may `preventDefault()` to cancel the set's.
      if (!loading) remove(event);
      event.preventDefault();
      return;
    }
    if (
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      isForwardKey(event.key, event.currentTarget)
    ) {
      const chip = event.currentTarget.closest(CHIP_SELECTOR);
      const target = chip ? getChipRemove(chip) : null;
      if (target) {
        // Handled inside the chip; the set must not move to the next chip.
        event.preventDefault();
        event.stopPropagation();
        target.focus();
      }
    }
  };

  const handleRemoveKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isRemoveKey(event.key)) {
      remove(event);
      event.preventDefault();
      return;
    }
    if (
      !removeOnly &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      !isForwardKey(event.key, event.currentTarget)
    ) {
      const chip = event.currentTarget.closest(CHIP_SELECTOR);
      const target = chip ? getChipPrimary(chip) : null;
      if (target) {
        event.preventDefault();
        event.stopPropagation();
        target.focus();
      }
    }
  };

  const Comp: React.ElementType = asChild
    ? Slot.Root
    : isLink
      ? "a"
      : removeOnly
        ? "span"
        : "button";
  const isButton = Comp === "button";

  const linkProps = isLink
    ? { href, target, rel, download, hrefLang, referrerPolicy }
    : {};

  return (
    <>
      <Comp
        id={actionId}
        data-slot="chip-primary"
        data-selected={isSelected || undefined}
        data-disabled={(!removeOnly && isOff) || undefined}
        aria-pressed={toggleable ? isSelected : undefined}
        aria-busy={loading || undefined}
        // Native `disabled` for a real button; anything else (soft-disabled,
        // loading, a disabled `asChild` element) is marked, not removed.
        disabled={isButton ? isDisabled : undefined}
        aria-disabled={
          (!removeOnly && (softDisabled || loading)) ||
          (!isButton && !removeOnly && isDisabled) ||
          undefined
        }
        type={isButton ? (type ?? "button") : undefined}
        className={classes.action}
        onClick={removeOnly ? undefined : handleClick}
        onKeyDown={removeOnly ? undefined : handlePrimaryKeyDown}
        {...linkProps}
        {...props}
      >
        {removeOnly ? null : <Ripple />}
        {leading}
        {asChild ? (
          <Slot.Slottable>{children}</Slot.Slottable>
        ) : (
          <span data-slot="chip-label" className={classes.label}>
            {children}
          </span>
        )}
        {hasRemove ? null : trailing}
      </Comp>
      {hasRemove ? (
        <button
          type="button"
          data-slot="chip-remove"
          data-only={removeOnly || undefined}
          data-disabled={isOff || undefined}
          disabled={isDisabled}
          aria-disabled={softDisabled || undefined}
          // A two-action chip's remove button is reached with the arrow keys
          // (one tab stop per chip); a remove-only chip's is the chip's stop.
          tabIndex={removeOnly ? undefined : -1}
          aria-label={removeLabel}
          aria-labelledby={
            removeLabel === undefined
              ? `${removeTextId} ${actionId}`
              : undefined
          }
          className={removeOnly ? classes.removeOnly : classes.remove}
          onClick={(event) => {
            if (softDisabled) {
              event.preventDefault();
              return;
            }
            remove(event);
          }}
          onKeyDown={handleRemoveKeyDown}
        >
          <Ripple
            centered={!removeOnly}
            className={removeOnly ? undefined : classes.removeRipple}
          />
          <span
            aria-hidden
            className={removeOnly ? classes.removeOnlyIcon : classes.removeIcon}
          >
            {removeGlyph}
          </span>
          {removeLabel === undefined ? (
            <span id={removeTextId} hidden>
              Remove
            </span>
          ) : null}
        </button>
      ) : null}
    </>
  );
};

export default ChipActions;
