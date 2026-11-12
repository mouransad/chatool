import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type chipVariants } from "./chip.variants";

/**
 * Props for the chip's primary action element. `className` and `style` go to
 * the **container** instead (so `--md-comp-chip-*` overrides and layout classes
 * land on the visible chip); use `actionClassName` for the action itself.
 */
type ActionProps = Omit<
  React.ComponentProps<"button">,
  "value" | "children" | "onClick"
>;

export interface ChipProps
  extends ActionProps, VariantProps<typeof chipVariants> {
  /**
   * The chip text (MD3: 20 characters or fewer, written like a button for
   * assist chips, as nouns for filter / suggestion chips). It is the chip's
   * accessible name and truncates with an ellipsis when space runs out.
   */
  children?: React.ReactNode;
  /**
   * Leading icon (18dp, decorative). A filter chip's checkmark **replaces** it
   * while selected; an input chip's icon turns `primary` on hover / focus /
   * press, per the tokens.
   */
  icon?: React.ReactNode;
  /**
   * Input chips: a leading 24dp round image (an `<img>` or initials), sized
   * larger than icons per MD3. Takes precedence over `icon`.
   */
  avatar?: React.ReactNode;
  /**
   * A decorative trailing icon **inside** the primary action, e.g. a dropdown
   * arrow on a filter chip that opens a menu (MD3: in compact windows make the
   * whole chip open the menu). Ignored when the chip has a remove action.
   */
  trailingIcon?: React.ReactNode;
  /**
   * Filter / input chips: controlled selection. The primary action reflects it
   * as `aria-pressed`, and the chip fills with `secondary-container` (plus the
   * Expressive pill morph and a leading checkmark on filter chips). Inside a
   * selectable `ChipSet` the set's `value` wins.
   */
  selected?: boolean;
  /** Filter / input chips: uncontrolled initial selection. */
  defaultSelected?: boolean;
  /** Called with the next selection when the user toggles the chip. */
  onSelectedChange?: (selected: boolean, event: React.MouseEvent) => void;
  /**
   * Filter chips: the icon shown at the start while selected (default: an 18dp
   * checkmark). Pass `false` for a filter chip that only changes color.
   */
  selectedIcon?: React.ReactNode | false;
  /**
   * The chip's identity inside a `ChipSet`: what the set's `value` /
   * `defaultValue` hold and what its `onRemove` receives.
   */
  value?: string;
  /** Called when the primary action is activated (click, Enter, Space). */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * Render a remove action ("Remove {label}" button with a close icon). It is
   * implied by `onRemove`, `removeOnly`, or an input chip in a `ChipSet` with an
   * `onRemove`. Backspace / Delete on the focused chip removes it too, and focus
   * moves to the neighbouring chip once it's gone.
   */
  removable?: boolean;
  /**
   * Called when the user removes the chip (remove button, Backspace, Delete).
   * You remove it from your state; `event.preventDefault()` also skips the
   * enclosing `ChipSet`'s `onRemove`.
   */
  onRemove?: (event: React.SyntheticEvent<HTMLElement>) => void;
  /**
   * Accessible name of the remove action. Default: "Remove" + the chip's label
   * (via `aria-labelledby`). Pass a full localized phrase to translate it.
   */
  removeLabel?: string;
  /** Replace the default close icon of the remove action. */
  removeIcon?: React.ReactNode;
  /**
   * Input chips whose only action is removal: the whole chip becomes **one**
   * focusable remove button (MD3 accessibility), instead of a primary action
   * plus a separate remove button.
   */
  removeOnly?: boolean;
  /**
   * Show progress in place of the leading icon (MD3: assist chips "can show
   * progress and confirmation feedback"). The chip keeps its colors, is
   * `aria-busy` and ignores activation.
   */
  loading?: boolean;
  /**
   * Disabled but still focusable (`aria-disabled`): it stays in the keyboard
   * flow of a `ChipSet` so people can discover it, but can't be activated.
   */
  softDisabled?: boolean;
  /**
   * Visual state while the chip is being dragged (reordering input chips,
   * moving them between fields): elevation level 4 + the 16% dragged layer.
   */
  dragged?: boolean;
  /** Render the primary action as a link (`<a href>`). Links ignore `disabled`. */
  href?: string;
  /** Link target (with `href`). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Link `rel` (with `href`). */
  rel?: string;
  /** Link `download` (with `href`). */
  download?: boolean | string;
  /** Link `hrefLang` (with `href`). */
  hrefLang?: string;
  /** Link `referrerPolicy` (with `href`). */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  /**
   * Render the primary action as your own element (e.g. Next's `<Link>`) via
   * Radix `Slot`: the child receives the chip's action props and keeps its own
   * text as the label. Use a natively interactive child.
   */
  asChild?: boolean;
  /** Classes for the primary action element. */
  actionClassName?: string;
}
