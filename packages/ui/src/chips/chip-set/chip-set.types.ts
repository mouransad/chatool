import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type chipSetVariants } from "./chip-set.variants";

interface ChipSetBaseProps
  extends
    Omit<React.ComponentProps<"div">, "defaultValue" | "onChange">,
    VariantProps<typeof chipSetVariants> {
  /**
   * Disables every chip in the set (each action gets native `disabled`, so
   * arrow keys skip them and forms don't submit the set's values).
   */
  disabled?: boolean;
  /**
   * Called with a chip's `value` when it is removed (its remove button,
   * Backspace or Delete). Makes the set's **input** chips removable without a
   * per-chip `onRemove`.
   */
  onRemove?: (value: string) => void;
  /**
   * Wrap focus from the last chip to the first (and back) with the arrow keys.
   * Default `true`, like Material Web's chip set.
   */
  loop?: boolean;
  /**
   * Submit the selected values with a `<form>`: one hidden
   * `<input name={name} value>` per selected chip.
   */
  name?: string;
  /** Associates the hidden inputs with a `<form>` elsewhere, by id. */
  form?: string;
}

/** A set that doesn't manage selection (assist / suggestion / input chips). */
interface ChipSetNoSelectionProps extends ChipSetBaseProps {
  /** How the set manages its chips' selection. Default `"none"`. */
  selectionMode?: "none";
  value?: never;
  defaultValue?: never;
  onValueChange?: never;
  required?: never;
}

/** Single-select filter chips: an alternative to segmented buttons / radios. */
interface ChipSetSingleProps extends ChipSetBaseProps {
  /** Selecting a chip deselects the others (MD3: don't mix behaviors). */
  selectionMode: "single";
  /** Controlled selection: the selected chip's `value`, or `null` for none. */
  value?: string | null;
  /** Uncontrolled initial selection. */
  defaultValue?: string | null;
  /** Called with the new selection (`null` when the chip is deselected). */
  onValueChange?: (value: string | null) => void;
  /** Keep one chip selected: the selected chip can't be deselected. */
  required?: boolean;
}

/** Multi-select filter chips: any number of chips can be selected. */
interface ChipSetMultipleProps extends ChipSetBaseProps {
  /** Each chip toggles independently. */
  selectionMode: "multiple";
  /** Controlled selection: the selected chips' `value`s. */
  value?: string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string[];
  /** Called with the new selection. */
  onValueChange?: (value: string[]) => void;
  /** Keep at least one chip selected: the last one can't be deselected. */
  required?: boolean;
}

export type ChipSetProps =
  | ChipSetNoSelectionProps
  | ChipSetSingleProps
  | ChipSetMultipleProps;

export type ChipSetSelectionMode = NonNullable<ChipSetProps["selectionMode"]>;
