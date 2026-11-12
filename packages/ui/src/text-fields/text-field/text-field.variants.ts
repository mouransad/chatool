import { cva } from "class-variance-authority";

import { MOTION } from "../config";

/*
 * Material Design 3 **text field** (m3.material.io/components/text-fields),
 * ported from the MD3 token set — Compose `FilledTextFieldTokens` /
 * `OutlinedTextFieldTokens` (v0_210), the layout constants in Compose's
 * `TextFieldImpl.kt`, and Material Web's `md-filled-field` /
 * `md-outlined-field` — with the **Expressive** motion of Compose's
 * `MaterialExpressiveTheme`:
 *
 * - **Geometry.** 56dp tall at default density: 16dp top/bottom padding, or
 *   8dp + a 16dp floated label line + 24dp of body-large input + 8dp for a
 *   filled field with its label inside. 16dp start/end padding; a leading /
 *   trailing icon is a 24dp glyph centred in a 48dp target flush with the edge
 *   (12dp from it) and sits 16dp from the text. Supporting text and the
 *   counter sit 4dp below, 16dp in, 16dp apart. Prefix / suffix are 2dp from
 *   the text. Filled corners are extra-small (4dp) on top only; outlined, all
 *   four. Density −1…−4 removes 4dp per step (MD3: offer it, never default).
 * - **Color.** Filled: `surface-container-highest` container, an
 *   `on-surface-variant` 1dp active indicator (`on-surface` on hover, 2dp
 *   `primary` on focus) and an 8% `on-surface` hover state layer. Outlined: a
 *   1dp `outline` border (`on-surface` on hover, 2dp `primary` on focus). Label
 *   `on-surface-variant` → `primary` focused (outlined hover → `on-surface`).
 *   Error: `error` label, indicator, trailing icon, supporting text and caret;
 *   hovering an unfocused error field shifts label, indicator and trailing icon
 *   to `on-error-container` (the newer tokens). Disabled: `on-surface` at 38%
 *   for content, 4% container (filled), 12% outline (outlined).
 * - **Motion.** See `../config.ts` — the label rides the fast-spatial spring
 *   (and really changes font size, as Compose lerps the text style), colors the
 *   fast-effects spring.
 *
 * **Everything is CSS driven from the native control.** The root (`group/
 * text-field`) derives every state from its input with `:has()`:
 *
 * - **floated** (`--_f` = 1) — focused (`:focus-within` on the field box), not
 *   `:placeholder-shown` (the view always renders a placeholder, `" "` if you
 *   gave none, so this means "has a value", even uncontrolled and before
 *   hydration), `:autofill`, or `[data-float]` (date-like types,
 *   `alwaysFloatLabel`);
 * - **error** — `[aria-invalid=true]` (the `error` prop) or `:user-invalid`
 *   (native constraint validation, after interaction), unless `error={false}`
 *   (`[data-error=false]`) opts out;
 * - **disabled** — `:disabled`, which includes an ancestor
 *   `<fieldset disabled>`; **hovered** — the root's `:hover`.
 *
 * **Priority chains, not cascade order.** Each painted role resolves through a
 * chain of locals — e.g. `--_lab` = disabled › error-hover › error › focus ›
 * hover › rest — and every condition only *sets its own* local, so overlapping
 * states (a focused invalid field you're hovering) resolve the same way no
 * matter how Tailwind orders the rules.
 *
 * **Geometry is interpolated by one number.** `--_f` is 0 (resting) or 1
 * (floated) and the label's top / inline-start / max-width / font-size /
 * line-height / letter-spacing are `rest + f × (floated − rest)`, so a single
 * selector moves everything and the real properties transition on the spring.
 */

/** The root: owns every local the parts read. */
export const textFieldVariants = cva(
  [
    "group/text-field w-70 min-w-0 relative inline-flex max-w-full flex-col text-start align-top [-webkit-tap-highlight-color:transparent]",
    MOTION,
    // Spaces (tokens) — vertical ones shrink by `--_dy` per density step.
    "[--_bts:max(0px,calc(var(--md-comp-text-field-bottom-space,1rem)_-_var(--_dy)))] [--_ig:calc(var(--md-comp-text-field-icon-text-space,1rem)_-_0.75rem)] [--_is:var(--md-comp-text-field-icon-size,1.5rem)] [--_lbts:max(0px,calc(var(--md-comp-text-field-with-label-bottom-space,0.5rem)_-_var(--_dy)))] [--_lp:var(--md-comp-text-field-outline-label-padding,0.25rem)] [--_ls:var(--md-comp-text-field-leading-space,1rem)] [--_ltps:max(0px,calc(var(--md-comp-text-field-with-label-top-space,0.5rem)_-_var(--_dy)))] [--_sh:var(--md-comp-text-field-container-shape,var(--md-sys-shape-corner-extra-small))] [--_tps:max(0px,calc(var(--md-comp-text-field-top-space,1rem)_-_var(--_dy)))] [--_trs:var(--md-comp-text-field-trailing-space,1rem)]",
    // Input padding: a filled field with its label inside reserves the floated
    // label's line above the text (`--_ipt-l` / `--_ipb-l`, see compounds).
    "[--_ipb:var(--_ipb-l,var(--_bts))] [--_ipt:var(--_ipt-l,var(--_tps))]",
    // Label geometry. Rest: aligned with the text (after a leading icon),
    // vertically centred on one line, or on the first line when multiline.
    // `--_tn` = trailing 48dp boxes currently shown (server count + the clear
    // button and error icon when CSS shows them) so the resting label never
    // runs under them.
    "[--_fms:var(--_ls)] [--_rx:var(--_ls)] data-leading:[--_fms:var(--_ig)] data-leading:[--_rx:calc(3rem_+_var(--_ig))]",
    "[--_tn:calc(var(--_tn0,0)_+_var(--_tnc,0)_+_var(--_tne,0))] data-[trailing=1]:[--_tn0:1] data-[trailing=2]:[--_tn0:2] data-[trailing=3]:[--_tn0:3]",
    "[--_re:max(var(--_trs),calc(var(--_tn)_*_3rem_+_var(--_ig)))] [--_rmw:calc(100%_-_var(--_rx)_-_var(--_re))]",
    "[--_ly0:calc(50%_-_var(--md-sys-typescale-body-large-line-height)_/_2)] data-multiline:[--_ly0:var(--_tps)]",
    // The outline notch (outlined): floated label x, and the end inset. A big
    // corner pushes them in (capped at 28dp so a pill shape still works).
    "[--_ne:max(var(--_trs),var(--_nsh))] [--_nsh:min(var(--_sh),1.75rem)] [--_nx:max(var(--_ls),calc(var(--_nsh)_+_var(--_lp)))]",
    // Floated (`--_f`): focused, populated, autofilled or `[data-float]`.
    // Placeholder + prefix/suffix (`--_vis`) only show while floated when the
    // label is inside; without one (or with it above) they always show.
    "[--_f:0] [&:is([data-float],:has([data-slot=text-field-field]:focus-within),:has([data-slot=text-field-input]:not(:placeholder-shown)),:has([data-slot=text-field-input]:autofill),:has([data-slot=text-field-input]:-webkit-autofill))]:[--_f:1]",
    "[--_vis:var(--_f)] data-[label=above]:[--_vis:1] data-[label=none]:[--_vis:1]",
    // Painted roles (priority chains — see the file comment).
    "[--_dis:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [--_err:var(--md-comp-text-field-error-color,var(--md-sys-color-error))] [--_errh:var(--md-comp-text-field-error-hover-color,var(--md-sys-color-on-error-container))] forced-colors:[--_dis:GrayText]",
    "[--_lab:var(--_lab-d,var(--_lab-eh,var(--_lab-e,var(--_lab-f,var(--_lab-h,var(--md-comp-text-field-label-text-color,var(--md-sys-color-on-surface-variant)))))))]",
    "[--_ind:var(--_ind-d,var(--_ind-eh,var(--_ind-e,var(--_ind-f,var(--_ind-h,var(--_ind0))))))] [--_iw:var(--_iw-f,var(--_iw0))]",
    "[--_lead:var(--_lead-d,var(--md-comp-text-field-leading-icon-color,var(--md-sys-color-on-surface-variant)))]",
    "[--_trail:var(--_trail-d,var(--_trail-eh,var(--_trail-e,var(--md-comp-text-field-trailing-icon-color,var(--md-sys-color-on-surface-variant)))))]",
    "[--_sup:var(--_sup-d,var(--_sup-e,var(--md-comp-text-field-supporting-text-color,var(--md-sys-color-on-surface-variant))))]",
    "[--_affix:var(--_in-d,var(--md-comp-text-field-input-text-affix-color,var(--md-sys-color-on-surface-variant)))] [--_in:var(--_in-d,var(--md-comp-text-field-input-text-color,var(--md-sys-color-on-surface)))] [--_ph:var(--_in-d,var(--md-comp-text-field-input-text-placeholder-color,var(--md-sys-color-on-surface-variant)))]",
    "[--_caret:var(--_caret-e,var(--md-comp-text-field-caret-color,var(--_accent)))]",
    "[--_cont:var(--_cont-d,var(--_cont0))] [--_sl:var(--_sl-d,var(--_sl-h,0%))] [--_st:var(--md-comp-text-field-hover-state-layer-color,var(--md-sys-color-on-surface))]",
    // Supporting text: `supportingTextOnFocus` hides it (keeping its space)
    // until focus; an error always shows.
    "[--_supv:var(--_supv-e,var(--_supv-f,var(--_supv0,visible)))] data-[supporting=focus]:[--_supv0:hidden]",
    // Focused.
    "[&:has([data-slot=text-field-field]:focus-within)]:[--_ind-f:var(--_indf)] [&:has([data-slot=text-field-field]:focus-within)]:[--_iw-f:var(--_iwf)] [&:has([data-slot=text-field-field]:focus-within)]:[--_lab-f:var(--md-comp-text-field-focus-label-text-color,var(--_accent))] [&:has([data-slot=text-field-field]:focus-within)]:[--_supv-f:visible]",
    // Hovered.
    "hover:[--_ind-h:var(--_indh)] hover:[--_lab-h:var(--_labh)] hover:[--_sl-h:var(--_slh)]",
    // Error — the `error` prop / `aria-invalid`, or native `:user-invalid`
    // (only after interaction or a submit attempt), unless `error={false}`.
    "data-error-icon:[--_ei:1] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_caret-e:var(--_err)] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_eid:flex] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_errt-d:inline] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_ind-e:var(--_err)] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_lab-e:var(--_err)] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_sup-e:var(--_err)] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_supv-e:visible] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_tne:var(--_ei,0)] [&:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_trail-e:var(--_err)]",
    // Error text replaces the supporting text (MD3: swap, don't stack).
    "[&[data-error-text]:not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_supt-d:none]",
    // Error + hovered (and not focused): `on-error-container`.
    "hover:[&:not(:has([data-slot=text-field-field]:focus-within)):not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_ind-eh:var(--_errh)] hover:[&:not(:has([data-slot=text-field-field]:focus-within)):not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_lab-eh:var(--_errh)] hover:[&:not(:has([data-slot=text-field-field]:focus-within)):not([data-error=false]):has([data-slot=text-field-input]:is([aria-invalid=true],:user-invalid))]:[--_trail-eh:var(--_errh)]",
    // Clear button: only while there's editable text.
    "[&[data-clearable]:has([data-slot=text-field-input]:read-write:not(:placeholder-shown))]:[--_clr-d:flex] [&[data-clearable]:has([data-slot=text-field-input]:read-write:not(:placeholder-shown))]:[--_tnc:1]",
    // Disabled (prop or an ancestor `<fieldset disabled>`) — wins everything.
    "[&:has([data-slot=text-field-input]:disabled)]:[--_cont-d:var(--_contd)] [&:has([data-slot=text-field-input]:disabled)]:[--_cur:default] [&:has([data-slot=text-field-input]:disabled)]:[--_in-d:var(--_dis)] [&:has([data-slot=text-field-input]:disabled)]:[--_ind-d:var(--_indd)] [&:has([data-slot=text-field-input]:disabled)]:[--_lab-d:var(--_dis)] [&:has([data-slot=text-field-input]:disabled)]:[--_lead-d:var(--_dis)] [&:has([data-slot=text-field-input]:disabled)]:[--_sl-d:0%] [&:has([data-slot=text-field-input]:disabled)]:[--_still:0s] [&:has([data-slot=text-field-input]:disabled)]:[--_sup-d:var(--_dis)] [&:has([data-slot=text-field-input]:disabled)]:[--_trail-d:var(--_dis)]",
  ],
  {
    variants: {
      /** MD3's two text field styles — same function, different emphasis. */
      variant: {
        filled:
          "[--_cont0:var(--md-comp-text-field-container-color,var(--md-sys-color-surface-container-highest))] [--_contd:color-mix(in_srgb,var(--md-sys-color-on-surface)_4%,transparent)] [--_ind0:var(--md-comp-text-field-active-indicator-color,var(--md-sys-color-on-surface-variant))] [--_indd:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)] [--_indf:var(--md-comp-text-field-focus-active-indicator-color,var(--_accent))] [--_indh:var(--md-comp-text-field-hover-active-indicator-color,var(--md-sys-color-on-surface))] [--_iw0:var(--md-comp-text-field-active-indicator-height,1px)] [--_iwf:var(--md-comp-text-field-focus-active-indicator-height,2px)] [--_labh:var(--md-comp-text-field-hover-label-text-color,var(--md-sys-color-on-surface-variant))] [--_lw1:var(--_rmw)] [--_lx1:var(--_rx)] [--_ly1:var(--_ltps)] [--_rad:var(--_sh)_var(--_sh)_0_0] [--_slh:calc(var(--md-comp-text-field-hover-state-layer-opacity,var(--md-sys-state-hover-opacity,0.08))_*_100%)] forced-colors:[--_indd:GrayText]",
        outlined:
          "[--_cont0:var(--md-comp-text-field-container-color,transparent)] [--_contd:transparent] [--_ind0:var(--md-comp-text-field-outline-color,var(--md-sys-color-outline))] [--_indd:color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,transparent)] [--_indf:var(--md-comp-text-field-focus-outline-color,var(--_accent))] [--_indh:var(--md-comp-text-field-hover-outline-color,var(--md-sys-color-on-surface))] [--_iw0:var(--md-comp-text-field-outline-width,1px)] [--_iwf:var(--md-comp-text-field-focus-outline-width,2px)] [--_labh:var(--md-comp-text-field-hover-label-text-color,var(--md-sys-color-on-surface))] [--_lw1:calc(100%_-_var(--_nx)_-_var(--_ne))] [--_lx1:var(--_nx)] [--_ly1:calc(var(--md-sys-typescale-body-small-line-height)_/_-2)] [--_rad:var(--_sh)] [--_slh:0%] forced-colors:[--_indd:GrayText]",
      },
      /**
       * MD3 density: each step removes 4dp of height (56 → 52 → 48 → 44 → 40dp).
       * MD3 advises against dense fields by default — offer it as a user choice.
       */
      density: {
        "0": "[--_dy:0px]",
        "-1": "[--_dy:0.125rem]",
        "-2": "[--_dy:0.25rem]",
        "-3": "[--_dy:0.375rem]",
        "-4": "[--_dy:0.5rem]",
      },
      /**
       * The focus accent (label, indicator / outline, caret). MD3 specifies
       * `primary`; the alternatives are fixed MD3 roles.
       */
      color: {
        primary: "[--_accent:var(--md-sys-color-primary)]",
        secondary: "[--_accent:var(--md-sys-color-secondary)]",
        tertiary: "[--_accent:var(--md-sys-color-tertiary)]",
      },
      /** Internal (set by the view from `label` / `labelPosition`). */
      labelMode: {
        none: "",
        attached: "",
        above: "",
      },
    },
    compoundVariants: [
      // Filled + label inside: the input sits under the floated label's line.
      {
        variant: "filled",
        labelMode: "attached",
        class:
          "[--_ipb-l:var(--_lbts)] [--_ipt-l:calc(var(--_ltps)_+_var(--md-sys-typescale-body-small-line-height))]",
      },
      // Outlined + label inside: reserve half the floated label's line above
      // the border so it never overlaps what's above (Compose's
      // `topPaddingForLabelCutout`).
      {
        variant: "outlined",
        labelMode: "attached",
        class: "pt-[calc(var(--md-sys-typescale-body-small-line-height)_/_2)]",
      },
    ],
    defaultVariants: {
      variant: "filled",
      density: "0",
      color: "primary",
      labelMode: "none",
    },
  },
);

/**
 * The container: the 56dp row holding icons, the field box and the
 * decorations. Its background is the container color with the hover state
 * layer mixed in (the same result as an 8% overlay on an opaque container).
 */
export const CONTAINER =
  "relative isolate flex min-w-0 cursor-[var(--_cur,text)] items-center rounded-[var(--_rad)] bg-[color-mix(in_srgb,var(--_st)_var(--_sl),var(--_cont))] [transition:background-color_var(--_fd)_var(--_fade)]";

/** Shared transition for every stroke (indicator, outline segments). */
const STROKE =
  "border-[color:var(--_ind)] [transition:border-color_var(--_fd)_var(--_fade),border-width_var(--_sd)_var(--_spring)]";

/**
 * Filled: the active indicator — a bottom **border** (not a background) so it
 * survives `forced-colors`; 1dp → 2dp on focus on the spatial spring.
 */
export const INDICATOR = `pointer-events-none absolute inset-x-0 bottom-0 z-[1] border-b-[length:var(--_iw)] ${STROKE}`;

/** Outlined without an inside label: one plain border. */
export const OUTLINE = `pointer-events-none absolute inset-0 z-[1] rounded-[inherit] border-[length:var(--_iw)] ${STROKE}`;

/**
 * Outlined with a label: Material Web's CSS-only **notch**. The outline is
 * three segments — start (up to the floated label), notch (sized by an
 * invisible copy of the floated label + 4dp each side) and end — so the gap
 * always matches the label exactly with no measuring. The notch's top edge is
 * two halves that scale to 0 from the centre outward as the label floats
 * (Compose grows its cutout with `labelProgress` the same way).
 */
export const OUTLINE_ROW =
  "pointer-events-none absolute inset-0 z-[1] flex rounded-[inherit]";

export const OUTLINE_START = `w-[calc(var(--_nx)_-_var(--_lp))] shrink-0 rounded-s-[inherit] border-y-[length:var(--_iw)] border-s-[length:var(--_iw)] ${STROKE}`;

// The notch's width is the label's (fractional) text width, so where it meets
// the end segment both would anti-alias the same pixel and leave a faint seam;
// `-me-px` slides the end segment 1px under the notch to close it.
export const OUTLINE_NOTCH = `relative -me-px flex min-w-0 max-w-[calc(var(--_lw1)_+_var(--_lp)_*_2)] shrink px-[var(--_lp)] border-b-[length:var(--_iw)] ${STROKE} before:absolute before:top-0 before:right-1/2 before:left-0 before:origin-top-left before:border-t-[length:var(--_iw)] before:border-[color:inherit] before:content-[''] before:[scale:calc(1_-_var(--_f))_1] before:[transition:scale_var(--_sd)_var(--_spring),border-color_var(--_fd)_var(--_fade),border-width_var(--_sd)_var(--_spring)] after:absolute after:top-0 after:right-0 after:left-1/2 after:origin-top-right after:border-t-[length:var(--_iw)] after:border-[color:inherit] after:content-[''] after:[scale:calc(1_-_var(--_f))_1] after:[transition:scale_var(--_sd)_var(--_spring),border-color_var(--_fd)_var(--_fade),border-width_var(--_sd)_var(--_spring)]`;

/** The invisible floated-label copy that sizes the notch (body-small). */
export const OUTLINE_LABEL_COPY =
  "invisible block max-w-full truncate whitespace-nowrap [font-family:var(--md-sys-typescale-body-small-font)] text-[length:var(--md-sys-typescale-body-small-size)] leading-[var(--md-sys-typescale-body-small-line-height)] tracking-[var(--md-sys-typescale-body-small-tracking)] [font-weight:var(--md-sys-typescale-body-small-weight)]";

export const OUTLINE_END = `min-w-[calc(var(--_ne)_-_var(--_lp))] grow rounded-e-[inherit] border-y-[length:var(--_iw)] border-e-[length:var(--_iw)] ${STROKE}`;

/**
 * The label inside the field. One element moves and resizes between rest
 * (body-large, aligned with the text) and floated (body-small, top of a filled
 * container or centred on an outlined border) — see the file comment. It's a
 * real `<label for>` (it names the input) but pointer-transparent, so clicks
 * land on the input under it.
 */
export const LABEL =
  "pointer-events-none absolute start-[calc(var(--_rx)_+_var(--_f)_*_(var(--_lx1)_-_var(--_rx)))] top-[calc(var(--_ly0)_+_var(--_f)_*_(var(--_ly1)_-_var(--_ly0)))] z-[2] block max-w-[calc(var(--_rmw)_+_var(--_f)_*_(var(--_lw1)_-_var(--_rmw)))] truncate whitespace-nowrap text-[color:var(--_lab)] select-none [font-family:var(--md-sys-typescale-body-large-font)] [font-size:calc(var(--md-sys-typescale-body-large-size)_+_var(--_f)_*_(var(--md-sys-typescale-body-small-size)_-_var(--md-sys-typescale-body-large-size)))] [font-weight:var(--md-sys-typescale-body-large-weight)] [letter-spacing:calc(var(--md-sys-typescale-body-large-tracking)_+_var(--_f)_*_(var(--md-sys-typescale-body-small-tracking)_-_var(--md-sys-typescale-body-large-tracking)))] [line-height:calc(var(--md-sys-typescale-body-large-line-height)_+_var(--_f)_*_(var(--md-sys-typescale-body-small-line-height)_-_var(--md-sys-typescale-body-large-line-height)))] [transition:top_var(--_sd)_var(--_spring),inset-inline-start_var(--_sd)_var(--_spring),max-width_var(--_sd)_var(--_spring),font-size_var(--_sd)_var(--_spring),line-height_var(--_sd)_var(--_spring),letter-spacing_var(--_sd)_var(--_spring),color_var(--_fd)_var(--_fade)]";

/** `labelPosition="above"`: body-small above the container, 4dp inset. */
export const LABEL_ABOVE =
  "block truncate px-1 pb-1 text-body-small text-[color:var(--_lab)] select-none [transition:color_var(--_fd)_var(--_fade)]";

/** Leading icon: a 48dp target flush with the start edge, glyph centred. */
export const LEADING =
  "flex w-12 shrink-0 items-center justify-center self-stretch text-[length:var(--_is)] text-[color:var(--_lead)] [transition:color_var(--_fd)_var(--_fade)] [&>svg]:size-[1em]";

/**
 * Trailing area: holds the clear button, password toggle, trailing icon and
 * error icon (48dp boxes each). When empty, its min-width plus the field's
 * end margin add up to the 16dp trailing space.
 */
export const TRAILING =
  "flex min-w-[calc(var(--_trs)_-_var(--_ig))] shrink-0 items-center self-stretch text-[length:var(--_is)] text-[color:var(--_trail)] [transition:color_var(--_fd)_var(--_fade)]";

/** One 48dp trailing box (consumer icon). */
export const TRAILING_BOX =
  "flex w-12 shrink-0 items-center justify-center [&>svg]:size-[1em]";

/** The built-in clear button's box: shown only while there's editable text. */
export const CLEAR_BOX =
  "w-12 shrink-0 items-center justify-center [display:var(--_clr-d,none)]";

/** The built-in error icon's box: shown only in the error state. */
export const ERROR_ICON_BOX =
  "w-12 shrink-0 items-center justify-center [display:var(--_eid,none)] [&>svg]:size-[1em]";

/**
 * Classes for the built-in icon buttons (clear, password toggle): MD3
 * standard icon buttons whose glyph follows the trailing-icon color (so they
 * turn `error` with the field) at the 24dp text-field icon size.
 */
export const ACTION_BUTTON =
  "[--md-comp-icon-button-icon-color:var(--_trail)] [&_svg]:size-6";

/** The field box: prefix + input + suffix, body-large, baseline-aligned. */
export const FIELD =
  "ms-[var(--_fms)] me-[var(--_ig)] flex min-w-0 flex-1 items-baseline [font-family:var(--md-sys-typescale-body-large-font)] text-[length:var(--md-sys-typescale-body-large-size)] leading-[var(--md-sys-typescale-body-large-line-height)] tracking-[var(--md-sys-typescale-body-large-tracking)] [font-weight:var(--md-sys-typescale-body-large-weight)]";

/**
 * Shared native control styles: transparent, borderless, inheriting the field
 * typography; caret in the accent (error when invalid). The placeholder only
 * shows while the label is floated (or always, without an inside label). Chrome's
 * autofill background is suppressed so the container stays MD3.
 */
const CONTROL =
  "m-0 block w-full min-w-0 flex-1 appearance-none rounded-none border-0 bg-transparent p-0 text-[color:var(--_in)] caret-[color:var(--_caret)] outline-none [font:inherit] [letter-spacing:inherit] placeholder:text-[color:color-mix(in_srgb,var(--_ph)_calc(var(--_vis)_*_100%),transparent)] placeholder:opacity-100 placeholder:[transition:color_var(--_fsd)_var(--_fade-slow)] autofill:[-webkit-text-fill-color:var(--_in)] autofill:[transition:background-color_600000s_0s,color_600000s_0s] disabled:cursor-default [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none";

/** Single-line `<input>`: its padding covers the full container height. */
export const INPUT = `${CONTROL} pt-[var(--_ipt)] pb-[var(--_ipb)]`;

/**
 * `<textarea>`: vertical space is **margin**, not padding, so scrolled text
 * never slides under the floated label (Material Web does the same). It grows
 * with its content (`field-sizing: content`, between `minRows` / `maxRows`
 * set inline in `lh`) or, with `rows`, is a fixed-height MD3 text area.
 */
export const TEXTAREA = `${CONTROL} mt-[var(--_ipt)] mb-[var(--_ipb)] resize-none overflow-y-auto [scrollbar-color:color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,transparent)_transparent] [scrollbar-width:thin]`;

/** Prefix / suffix: `on-surface-variant`, 2dp from the text, fade with `--_vis`. */
const AFFIX =
  "shrink-0 whitespace-pre text-[color:var(--_affix)] opacity-[var(--_vis)] [transition:opacity_var(--_fd)_var(--_fade),color_var(--_fd)_var(--_fade)]";
export const PREFIX = `${AFFIX} pe-0.5`;
export const SUFFIX = `${AFFIX} ps-0.5`;

/** Supporting row: supporting / error text at the start, counter at the end. */
export const SUPPORTING_ROW =
  "flex gap-4 ps-[var(--md-comp-text-field-supporting-text-leading-space,1rem)] pe-[var(--md-comp-text-field-supporting-text-trailing-space,1rem)] pt-[var(--md-comp-text-field-supporting-text-top-space,0.25rem)] text-body-small text-[color:var(--_sup)] [transition:color_var(--_fd)_var(--_fade)]";

export const SUPPORTING_TEXT_WRAP = "min-w-0 flex-1";
export const SUPPORTING_TEXT =
  "[display:var(--_supt-d,inline)] [visibility:var(--_supv)]";
export const ERROR_TEXT = "[display:var(--_errt-d,none)]";
export const COUNTER =
  "ms-auto shrink-0 tabular-nums data-over:text-[color:var(--_err)]";
