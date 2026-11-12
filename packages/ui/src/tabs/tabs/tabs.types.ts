import type * as React from "react";

import { type BadgeProps } from "../../badges/badge/badge.types";
import { type TabsVariant } from "../config";

export type { TabsVariant } from "../config";

/**
 * How keyboard focus selects tabs (WAI-ARIA APG):
 *
 * - `manual` (default, MD3 + Material Web): arrow keys move focus, Space /
 *   Enter selects the focused tab.
 * - `automatic`: a tab is selected as soon as it receives focus. Use it only
 *   when panels render without noticeable latency (APG).
 */
export type TabsActivationMode = "manual" | "automatic";

/** What caused a selection change. */
export type TabsChangeReason =
  | "pointer"
  | "keyboard"
  | "swipe"
  | "programmatic";

/** Extra information passed to `onValueChange`. */
export interface TabsChangeDetails {
  /** What caused the change. */
  reason: TabsChangeReason;
}

export interface TabsProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  /** Controlled selection: the selected tab's `value`. */
  value?: string;
  /**
   * Uncontrolled initial selection. When neither `value` nor `defaultValue` is
   * given, the first enabled tab is selected after mount (MD3: one tab is
   * always active) — pass `defaultValue` to have it in the first paint.
   */
  defaultValue?: string;
  /** Called with the newly selected tab's `value`. */
  onValueChange?: (value: string, details: TabsChangeDetails) => void;
  /** Keyboard activation model. Default `"manual"` (MD3 / Material Web). */
  activationMode?: TabsActivationMode;
}

/**
 * How the indicator moves between tabs:
 *
 * - `elastic` (default): MD3 Expressive. The leading edge travels on the
 *   default-spatial spring and the trailing edge on the slow-spatial spring,
 *   so the indicator stretches toward its destination and settles with a soft
 *   overshoot (MDC-Android's `elastic` mode, on Expressive springs).
 * - `slide`: both edges on the default-spatial spring (Compose `TabRow`).
 * - `fade`: the indicator cross-fades in place (MDC-Android `fade`).
 */
export type TabsIndicatorMotion = "elastic" | "slide" | "fade";

/** Fixed tabs: `fill` the width equally, or size to the widest tab and align. */
export type TabsAlignment = "fill" | "center" | "start";

/** Fixed tabs share the width; scrollable tabs size to their labels and scroll. */
export type TabsLayout = "fixed" | "scrollable";

/** Icon above the label (stacked, 64dp) or before it (inline, 48dp). */
export type TabsIconPosition = "top" | "start";

/** Per-part class names for `TabList`. */
export interface TabListClassNames {
  /** The tabs' row (the horizontal scroller in `scrollable` layout). */
  scroller?: string;
  /** Both scroll buttons. */
  scrollButton?: string;
}

export interface TabListProps extends React.ComponentProps<"div"> {
  /**
   * `primary` (default): the main destinations, under the top app bar — a 3dp
   * content-width indicator and `primary` selected color. `secondary`: a
   * second level within a content area — a 2dp full-width indicator and
   * `on-surface` selected color. Place secondary tabs below primary tabs.
   */
  variant?: TabsVariant;
  /**
   * `fixed` (default): every tab is visible and the row is divided into equal
   * sections (MD3: avoid more than four). `scrollable`: tabs size to their
   * labels (min 90dp), start 52dp from the leading edge and scroll; the
   * selected tab springs to the center.
   */
  layout?: TabsLayout;
  /**
   * Fixed tabs only. `fill` (default) stretches equal tabs across the width;
   * `center` / `start` size every tab to the widest one and align the group
   * (MD3 responsive layout for wide windows).
   */
  alignment?: TabsAlignment;
  /** Default icon placement for tabs with an icon and a label. Default `"top"`. */
  iconPosition?: TabsIconPosition;
  /** How the indicator moves. Default `"elastic"` (MD3 Expressive). */
  indicatorMotion?: TabsIndicatorMotion;
  /** Draw the 1dp `outline-variant` divider along the bottom. Default `true`. */
  divider?: boolean;
  /**
   * Scrollable tabs only: chevron buttons that page the row on pointer
   * devices. `true` shows them whenever the row overflows; `"auto"` only on
   * devices with a fine pointer (mouse / trackpad), since touch users swipe.
   * They are hidden from assistive tech and the Tab order — keyboard users
   * move with the arrow keys and the row follows focus. Default `false`.
   */
  scrollButtons?: boolean | "auto";
  /** Wrap focus from the last tab to the first (and back). Default `true` (APG). */
  loop?: boolean;
  /** Per-part class names. */
  classNames?: TabListClassNames;
}

/**
 * A tab badge. `true` = MD3 **small** badge (a dot); a number or string = the
 * **large** badge with that count (`999+` / 4-character maximum); or pass your
 * own `<Badge />` element for full control (color, `max`, `label`, …). `null` /
 * `false` / `0` hide it. MD3: clear the badge once the user has seen the tab.
 */
export type TabBadge =
  | boolean
  | number
  | string
  | React.ReactElement<BadgeProps>
  | null
  | undefined;

/** Per-part class names for `Tab`. */
export interface TabClassNames {
  /** The content box (icon + label) that the primary indicator spans. */
  content?: string;
  /** The icon slot. */
  icon?: string;
  /** The label text. */
  label?: string;
  /** The active indicator. */
  indicator?: string;
  /** The badge. */
  badge?: string;
}

export interface TabProps extends Omit<
  React.ComponentProps<"button">,
  "value"
> {
  /** Identifies the tab; matched against `Tabs.value` and `TabPanel.value`. */
  value: string;
  /**
   * Leading / top icon (24dp). MD3: give all tabs in a row icons, or none; an
   * icon-only tab needs an `aria-label`.
   */
  icon?: React.ReactNode;
  /** Icon shown while selected (e.g. the filled variant). Defaults to `icon`. */
  selectedIcon?: React.ReactNode;
  /** Override the tab list's `iconPosition` for this tab. */
  iconPosition?: TabsIconPosition;
  /**
   * Notification badge: anchored on the icon of a stacked or icon-only tab
   * (overlapping it by 6dp), otherwise 4dp after the label.
   */
  badge?: TabBadge;
  /**
   * Render the tab as its single child (e.g. a Next.js `<Link>` or `<a>`) for
   * tabs that navigate between routes. The child's children become the label.
   */
  asChild?: boolean;
  /** Per-part class names. */
  classNames?: TabClassNames;
}

/** Panel transitions when the selection changes (non-swipeable panels). */
export type TabPanelsTransition = "slide" | "fade" | "none";

export interface TabPanelsProps extends React.ComponentProps<"div"> {
  /**
   * MD3 "swipe within the content area": panels sit side by side in a
   * scroll-snapping pager. Swiping moves the indicator with the finger and
   * selects the tab it settles on; selecting a tab springs the pager to its
   * panel. Every panel stays mounted (inactive ones are `inert`). Keep panels
   * in the same order as their tabs, and avoid other horizontally swipeable
   * content inside them (MD3).
   */
  swipeable?: boolean;
  /**
   * Non-swipeable panels: how a newly selected panel enters. `slide` (default)
   * is MD3's shared-axis X (30dp + fade, from the side of travel); `fade`
   * fades in; `none` swaps instantly. Never plays on first paint.
   */
  transition?: TabPanelsTransition;
}

export interface TabPanelProps extends Omit<
  React.ComponentProps<"div">,
  "value"
> {
  /** The `value` of the tab that labels this panel. */
  value: string;
  /**
   * Keep the panel in the DOM (`hidden`) while inactive, preserving its state
   * (scroll position, form input). Default `false`: inactive panels unmount.
   * Swipeable panels are always mounted.
   */
  keepMounted?: boolean;
}
