"use client";

import {
  cloneElement,
  isValidElement,
  useContext,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Slot } from "radix-ui";
import { cn } from "@chatool/utils";

import Badge from "../../badges/badge/badge";
import { type BadgeProps } from "../../badges/badge/badge.types";
import Ripple from "../../buttons/ripple";
import {
  TabListContext,
  TabsContext,
  getPanelId,
  getTabId,
  missing,
} from "./tabs-context";
import { type TabProps } from "./tabs.types";
import {
  tabContentVariants,
  tabIconVariants,
  tabIndicatorVariants,
  tabLabelVariants,
  tabVariants,
} from "./tabs.variants";

/** MD3: a badge overlaps a stacked icon by 6dp (the large badge default is 12dp). */
const ICON_BADGE = "[--md-comp-badge-large-offset-x:0.375rem]";

const present = (node: ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== "";

/**
 * MD3 tab — one destination in a `TabList`: an optional 24dp icon (stacked
 * above the label at 64dp, or inline before it at 48dp), a `title-small`
 * label, an optional badge, the state layer + ripple, and its own active
 * indicator (only the selected tab's is visible; the list animates it).
 *
 * Renders a `<button role="tab">` (APG) with `aria-selected`, `aria-controls`
 * its panel, and a roving `tabIndex`. `asChild` renders it as your link
 * instead (route tabs). Clicking — or Space / Enter — selects it; call
 * `event.preventDefault()` in your `onClick` to veto the change.
 */
const Tab = ({
  value,
  icon,
  selectedIcon,
  iconPosition,
  badge,
  asChild = false,
  classNames,
  className,
  disabled = false,
  onClick,
  onFocus,
  onKeyDown,
  children,
  ...props
}: TabProps) => {
  const tabs = useContext(TabsContext) ?? missing("Tab");
  const list = useContext(TabListContext);
  if (!list) throw new Error("<Tab> must be rendered inside <TabList>.");

  const selected = tabs.value === value;
  const child =
    asChild && isValidElement<{ children?: ReactNode }>(children)
      ? children
      : null;
  const label = child ? child.props.children : children;
  const hasLabel = present(label);
  const hasIcon = present(icon);
  const stacked =
    hasIcon && hasLabel && (iconPosition ?? list.iconPosition) === "top";

  /* ------------------------------- badge -------------------------------- */
  let badgeElement: ReactElement<BadgeProps> | null = null;
  if (isValidElement<BadgeProps>(badge)) badgeElement = badge;
  else if (badge === true) badgeElement = <Badge />;
  else if (typeof badge === "number" || (typeof badge === "string" && badge))
    badgeElement = <Badge value={badge} />;
  // On a stacked or icon-only tab the badge sits on the icon; otherwise it
  // follows the label.
  const anchorBadge =
    badgeElement !== null && hasIcon && (stacked || !hasLabel);

  /* -------------------------------- icon -------------------------------- */
  let iconNode: ReactNode = null;
  if (hasIcon) {
    const glyph = present(selectedIcon) ? (
      <>
        <span className="contents group-aria-selected/tab:hidden">{icon}</span>
        <span className="hidden group-aria-selected/tab:contents">
          {selectedIcon}
        </span>
      </>
    ) : (
      icon
    );
    iconNode = (
      <span
        data-slot="tab-icon"
        className={cn(tabIconVariants(), classNames?.icon)}
      >
        {glyph}
      </span>
    );
    if (anchorBadge && badgeElement) {
      iconNode = cloneElement(badgeElement, {
        className: cn(
          ICON_BADGE,
          classNames?.badge,
          badgeElement.props.className,
        ),
        children: iconNode,
      });
    }
  }

  const content = (
    <>
      <Ripple />
      <span
        data-slot="tab-content"
        className={cn(
          tabContentVariants({ variant: list.variant, stacked }),
          classNames?.content,
        )}
      >
        {iconNode}
        {hasLabel && (
          <span
            data-slot="tab-label"
            className={cn(
              tabLabelVariants({ layout: list.layout }),
              classNames?.label,
            )}
          >
            {label}
          </span>
        )}
        <span
          aria-hidden
          data-slot="tab-indicator"
          className={cn(
            tabIndicatorVariants({ fade: list.indicatorMotion === "fade" }),
            classNames?.indicator,
          )}
        />
      </span>
      {badgeElement && !anchorBadge && (
        <span
          data-slot="tab-badge"
          className={cn("inline-flex shrink-0 self-center", classNames?.badge)}
        >
          {badgeElement}
        </span>
      )}
    </>
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (event.defaultPrevented) return;
    tabs.select(value, event.detail === 0 ? "keyboard" : "pointer");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    // A link tab doesn't click on Space by itself (a button does).
    if (
      child &&
      !event.defaultPrevented &&
      event.key === " " &&
      !event.repeat
    ) {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const shared = {
    role: "tab",
    id: getTabId(tabs.baseId, value),
    "aria-selected": selected,
    "aria-controls": getPanelId(tabs.baseId, value),
    tabIndex: !disabled && list.tabStop === value ? 0 : -1,
    "data-slot": "tab",
    "data-value": value,
    "data-selected": selected || undefined,
    "data-stacked": stacked || undefined,
    className: cn(tabVariants({ layout: list.layout, stacked }), className),
    onFocus: (event: FocusEvent<HTMLButtonElement>) => {
      onFocus?.(event);
      list.onTabFocus(value);
    },
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  } as const;

  if (child) {
    return (
      <Slot.Root
        {...shared}
        aria-disabled={disabled || undefined}
        {...(props as Record<string, unknown>)}
      >
        {cloneElement(child, undefined, content)}
      </Slot.Root>
    );
  }

  return (
    <button type="button" disabled={disabled} {...shared} {...props}>
      {content}
    </button>
  );
};

export default Tab;
