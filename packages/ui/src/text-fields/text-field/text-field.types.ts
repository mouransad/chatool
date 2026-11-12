import type * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { type textFieldVariants } from "./text-field.variants";

/**
 * Localizable strings for the parts the text field renders itself. Every key
 * is optional; English defaults are used for the rest.
 */
export interface TextFieldLabels {
  /** Clear button's accessible name. Default `"Clear"`. */
  clear?: string;
  /** Password toggle's name while the password is hidden. Default `"Show password"`. */
  showPassword?: string;
  /** Password toggle's name while the password is shown. Default `"Hide password"`. */
  hidePassword?: string;
  /** The built-in error icon's accessible name (MD3: "Error"). Default `"Error"`. */
  error?: string;
  /**
   * Spoken character counter. `{count}` and `{max}` are replaced. Default
   * `"{count} of {max} characters"` (or `"{count} characters"` without a max).
   */
  characterCount?: string;
}

/** Extra classes for each rendered part (`className` styles the root). */
export interface TextFieldClassNames {
  /** The 56dp row with the container fill, icons and input. */
  container?: string;
  /** The native `<input>` / `<textarea>` (or your `asChild` control). */
  input?: string;
  /** The label (inside, or above with `labelPosition="above"`). */
  label?: string;
  /** The leading icon's 48dp box. */
  leadingIcon?: string;
  /** The trailing area (clear button, password toggle, icons). */
  trailingIcon?: string;
  /** The prefix text. */
  prefix?: string;
  /** The suffix text. */
  suffix?: string;
  /** The row under the container (supporting / error text + counter). */
  supportingText?: string;
  /** The character counter. */
  counter?: string;
}

/** Props shared by the single-line and multiline forms. */
export interface TextFieldOwnProps extends Omit<
  VariantProps<typeof textFieldVariants>,
  "labelMode"
> {
  /**
   * The label — every text field should have one (MD3). Inside the container
   * it rests in the middle and floats to the top on focus or once there's a
   * value. It names the input (a real `<label for>`). Omit it only when an
   * adjacent label names the field, and pass `aria-label`/`aria-labelledby`.
   */
  label?: React.ReactNode;
  /**
   * Where the label lives: `"attached"` (default) — inside a filled field /
   * in the outline notch of an outlined one; `"above"` — always above the
   * container, body-small (Compose's `TextFieldLabelPosition.Above`).
   */
  labelPosition?: "attached" | "above";
  /**
   * Keep the attached label floated even while empty and unfocused, so the
   * placeholder (and prefix / suffix) stay visible. Date / time types always
   * float.
   */
  alwaysFloatLabel?: boolean;
  /**
   * Appended to the label when `required` (MD3: an asterisk, part of the
   * accessible name). Default `"*"`; pass `null` to hide it — then say which
   * fields are required some other way.
   */
  requiredIndicator?: React.ReactNode;
  /**
   * Helper text under the container, wired to `aria-describedby`. Turns
   * `error`-colored while the field is invalid (and is replaced by
   * `errorText` if you give one).
   */
  supportingText?: React.ReactNode;
  /** Show `supportingText` only while the field is focused (space stays reserved). */
  supportingTextOnFocus?: boolean;
  /**
   * The MD3 error state. `true` forces it (and sets `aria-invalid`); `false`
   * suppresses it even when native validation fails (`:user-invalid`) — use it
   * when a form library owns validation; `undefined` (default) shows it for
   * `aria-invalid` **or** a native constraint failure after the user
   * interacted (`required`, `type="email"`, `pattern`, `minLength`, …).
   */
  error?: boolean;
  /**
   * Shown **instead of** `supportingText` while the field is invalid (MD3:
   * swap, don't stack). With `error`, it's announced (`role="alert"`) when it
   * appears; a native `:user-invalid` swaps it in visually.
   */
  errorText?: React.ReactNode;
  /**
   * The trailing error icon MD3 strongly recommends (a second, non-color cue).
   * `true` (default) uses the built-in `error` glyph, a node replaces it,
   * `false` turns it off. It's only shown in the error state and only when
   * there's no `trailingIcon` (yours is never hidden).
   */
  errorIcon?: React.ReactNode;
  /** An icon (or icon button) at the start, in a 48dp box. Mirrors in RTL. */
  leadingIcon?: React.ReactNode;
  /**
   * An icon (or icon button) at the end, in a 48dp box. A decorative SVG
   * follows the trailing-icon color (`error` when invalid); an interactive one
   * must have its own accessible name.
   */
  trailingIcon?: React.ReactNode;
  /**
   * Text before the input (e.g. `"$"`), shown with the floated label. It's added
   * to the input's description; give symbols a spoken form, e.g.
   * `<><span aria-hidden>$</span><span className="sr-only">US dollars</span></>`.
   */
  prefix?: React.ReactNode;
  /** Text after the input (e.g. `"kg"`, `"@gmail.com"`). Same rules as `prefix`. */
  suffix?: React.ReactNode;
  /**
   * Adds MD3's clear icon button, shown only while there's editable text.
   * Clicking it (or pressing Escape in the field) empties the value, fires
   * `onChange` / `input` like typing would, and keeps focus in the field. It's
   * out of the Tab order (Escape is the keyboard path).
   */
  clearable?: boolean;
  /** Replaces the clear button's icon. */
  clearIcon?: React.ReactNode;
  /**
   * For `type="password"`: a trailing show / hide toggle (default `true`). It
   * switches the input between `password` and `text`, relabels itself ("Show
   * password" / "Hide password"), and switches back to `password` when the
   * form submits or resets.
   */
  passwordToggle?: boolean;
  /**
   * The MD3 character counter. Shown automatically with `maxLength`; `true`
   * shows a plain count without one, `false` hides it.
   */
  counter?: boolean;
  /** Localized strings for the built-in parts. */
  labels?: TextFieldLabels;
  /**
   * Render your own control (a masked / formatted input, an autocomplete's
   * input) as the field: its single child receives the input props, classes,
   * `id`, `placeholder` and `aria-*`. It must render (or be) an `<input>` /
   * `<textarea>` that forwards `placeholder` for the floating label to track
   * its value.
   */
  asChild?: boolean;
  /** Your own control when `asChild` is set. */
  children?: React.ReactNode;
  /** Extra classes per part. `className` itself styles the root. */
  classNames?: TextFieldClassNames;
  /** Classes for the root (width, margins, token overrides). */
  className?: string;
  /** Inline styles for the root (e.g. `--md-comp-text-field-*` overrides). */
  style?: React.CSSProperties;
}

/** Native props the text field owns or that collide with its own. */
type Owned =
  | keyof TextFieldOwnProps
  | "color"
  | "prefix"
  | "children"
  | "className"
  | "style";

/** Single-line text field over a native `<input>` (the default). */
export interface TextFieldInputProps
  extends TextFieldOwnProps, Omit<React.ComponentProps<"input">, Owned> {
  /** Single line (default). Set `multiline` for a `<textarea>`. */
  multiline?: false;
}

/** Multi-line text field / text area over a native `<textarea>`. */
export interface TextFieldTextareaProps
  extends TextFieldOwnProps, Omit<React.ComponentProps<"textarea">, Owned> {
  /**
   * Render a `<textarea>`. Without `rows` it's MD3's **multi-line text field**:
   * it starts at `minRows` and grows with its content up to `maxRows` (then
   * scrolls). With `rows` it's MD3's fixed-height **text area** (recommended on
   * the web for long answers).
   */
  multiline: true;
  /** Rows a growing multi-line field starts at. Default `1`. */
  minRows?: number;
  /** Rows a growing multi-line field stops growing at. Default: unlimited. */
  maxRows?: number;
}

/**
 * Props for `TextField`: the native `<input>` props (or `<textarea>` props with
 * `multiline`) plus the MD3 parts. `className` / `style` go on the root; every
 * other native prop — `name`, `value`, `defaultValue`, `onChange`, `required`,
 * `pattern`, `autoComplete`, `aria-*`, `ref`, … — goes on the control.
 */
export type TextFieldProps = TextFieldInputProps | TextFieldTextareaProps;
