import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Badge from "@chatool/ui/badge";
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import Divider from "@chatool/ui/divider";
import NotificationsOutlined from "@chatool/icons/NotificationsOutlined";
import MailOutlined from "@chatool/icons/MailOutlined";
import MailFilled from "@chatool/icons/MailFilled";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import ChatFilled from "@chatool/icons/ChatFilled";
import GroupOutlined from "@chatool/icons/GroupOutlined";
import GroupFilled from "@chatool/icons/GroupFilled";
import HomeOutlined from "@chatool/icons/HomeOutlined";
import HomeFilled from "@chatool/icons/HomeFilled";
import SearchOutlined from "@chatool/icons/SearchOutlined";
import MoreVertOutlined from "@chatool/icons/MoreVertOutlined";
import MenuOutlined from "@chatool/icons/MenuOutlined";
import StarOutlined from "@chatool/icons/StarOutlined";
import SettingsOutlined from "@chatool/icons/SettingsOutlined";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { value: 3 },
  argTypes: {
    value: { control: "text" },
    max: { control: "number" },
    maxLength: { control: "number" },
    showZero: { control: "boolean" },
    invisible: { control: "boolean" },
    size: { control: "inline-radio", options: [undefined, "small", "large"] },
    color: {
      control: "inline-radio",
      options: ["error", "primary", "secondary", "tertiary"],
    },
    placement: { control: "inline-radio", options: ["top-end", "top-start"] },
    locale: { control: "text" },
    label: { control: "text" },
    asChild: { table: { disable: true } },
    anchorClassName: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A 24dp icon, the anchor MD3 badges are specced against. */
const Icon = ({
  as: C,
}: {
  as: React.ComponentType<{ className?: string }>;
}) => <C className="size-6 text-on-surface-variant" />;

/** A captioned cell for side-by-side comparisons. */
const Cell = ({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) => (
  <figure className="min-w-20 gap-3 m-0 flex flex-col items-center">
    <div className="h-10 flex items-center">{children}</div>
    <figcaption className="text-label-medium text-on-surface-variant">
      {caption}
    </figcaption>
  </figure>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-8 flex flex-wrap items-end">{children}</div>
);

/** Strings from the controls panel arrive as text; numbers should stay numbers. */
const coerce = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" && !Number.isNaN(+value)
    ? Number(value)
    : (value as string | number | undefined);

/** Every prop live, on the MD3 reference anchor: a 24dp icon. */
export const Playground: Story = {
  render: ({ value, ...args }) => (
    <Badge {...args} value={coerce(value)}>
      <Icon as={NotificationsOutlined} />
    </Badge>
  ),
};

/**
 * The two MD3 variants. **Small** (no `value`): a 6dp dot meaning "something
 * new". **Large** (with `value`): a 16dp pill carrying a count or short status.
 */
export const Variants: Story = {
  render: () => (
    <Row>
      <Cell caption="Small">
        <Badge>
          <Icon as={MailOutlined} />
        </Badge>
      </Cell>
      <Cell caption="Large · 1 digit">
        <Badge value={3}>
          <Icon as={MailOutlined} />
        </Badge>
      </Cell>
      <Cell caption="Large · 2 digits">
        <Badge value={42}>
          <Icon as={MailOutlined} />
        </Badge>
      </Cell>
      <Cell caption="Large · max">
        <Badge value={1200}>
          <Icon as={MailOutlined} />
        </Badge>
      </Cell>
    </Row>
  ),
};

/**
 * MD3 caps the label at **four characters including a `+`**. Numbers above
 * `max` (default `999`) collapse to `max+`; strings longer than `maxLength`
 * (default `4`) are truncated with `…`. Assistive tech still hears the full value.
 */
export const OverflowAndTruncation: Story = {
  render: () => (
    <Row>
      <Cell caption="999 → 999">
        <Badge value={999}>
          <Icon as={ChatOutlined} />
        </Badge>
      </Cell>
      <Cell caption="1000 → 999+">
        <Badge value={1000}>
          <Icon as={ChatOutlined} />
        </Badge>
      </Cell>
      <Cell caption="max={99}">
        <Badge value={150} max={99}>
          <Icon as={ChatOutlined} />
        </Badge>
      </Cell>
      <Cell caption="max={9}">
        <Badge value={12} max={9}>
          <Icon as={ChatOutlined} />
        </Badge>
      </Cell>
      <Cell caption={'"New"'}>
        <Badge value="New">
          <Icon as={ChatOutlined} />
        </Badge>
      </Cell>
      <Cell caption={'"Beta!" → Bet…'}>
        <Badge value="Beta!">
          <Icon as={ChatOutlined} />
        </Badge>
      </Cell>
    </Row>
  ),
};

/**
 * A `0` hides the badge by default (nothing to report); `showZero` keeps it.
 * Negative and non-finite values clamp to `0`, like MDC-Android.
 */
export const Zero: Story = {
  render: () => (
    <Row>
      <Cell caption="0 (hidden)">
        <Badge value={0}>
          <Icon as={MailOutlined} />
        </Badge>
      </Cell>
      <Cell caption="0 + showZero">
        <Badge value={0} showZero>
          <Icon as={MailOutlined} />
        </Badge>
      </Cell>
    </Row>
  ),
};

/**
 * MD3 keeps badges `error` / `on-error` so they stand out against icons and
 * labels. The alternatives are fixed, contrast-safe MD3 role pairs — use them
 * for brand or status badges, never to make a badge blend in.
 */
export const Colors: Story = {
  render: () => (
    <Row>
      {(["error", "primary", "secondary", "tertiary"] as const).map((color) => (
        <Cell key={color} caption={color}>
          <div className="gap-6 flex items-center">
            <Badge color={color}>
              <Icon as={NotificationsOutlined} />
            </Badge>
            <Badge color={color} value={8}>
              <Icon as={NotificationsOutlined} />
            </Badge>
          </div>
        </Cell>
      ))}
    </Row>
  ),
};

/**
 * Placement is **logical**: `top-end` (default) sits on the trailing corner —
 * right in LTR, left in RTL — and grows away from the icon. MD3: "Change the
 * position of the badge for right-to-left languages".
 */
export const PlacementAndRtl: Story = {
  render: () => (
    <div className="gap-8 flex flex-col">
      {(["ltr", "rtl"] as const).map((dir) => (
        <div key={dir} dir={dir}>
          <Row>
            <Cell caption={`${dir} · top-end`}>
              <Badge value={128}>
                <Icon as={MailOutlined} />
              </Badge>
            </Cell>
            <Cell caption={`${dir} · top-start`}>
              <Badge value={128} placement="top-start">
                <Icon as={MailOutlined} />
              </Badge>
            </Cell>
            <Cell caption={`${dir} · small`}>
              <Badge>
                <Icon as={MailOutlined} />
              </Badge>
            </Cell>
          </Row>
        </div>
      ))}
    </div>
  ),
};

/**
 * `locale` renders localized digits — deterministic on server and client, so
 * no hydration mismatch. Localize `label` alongside it for screen readers.
 */
export const LocalizedDigits: Story = {
  render: () => (
    <div dir="rtl">
      <Row>
        <Cell caption="fa · 7">
          <Badge value={7} locale="fa" label="۷ پیام جدید">
            <Icon as={ChatOutlined} />
          </Badge>
        </Cell>
        <Cell caption="fa · 1500">
          <Badge value={1500} locale="fa" label="۱۵۰۰ پیام جدید">
            <Icon as={ChatOutlined} />
          </Badge>
        </Cell>
        <Cell caption="ar-EG · 42">
          <Badge value={42} locale="ar-EG">
            <Icon as={ChatOutlined} />
          </Badge>
        </Cell>
      </Row>
    </div>
  ),
};

/**
 * The Expressive motion, live. Everything is CSS on a **Server Component**:
 *
 * - **Enter** — springs up from its anchor corner (`@starting-style`, M3
 *   Expressive _fast spatial_ spring: damping 0.6, stiffness 800).
 * - **Count change** — the label is keyed by its text, so a new count remounts
 *   and pops in with the same spring.
 * - **Dot ⇄ pill** — size, radius and offsets all morph together.
 * - **Exit** — a quick `emphasized-accelerate` shrink + fade (`invisible`, or a
 *   count that reaches `0`).
 *
 * `prefers-reduced-motion` keeps only the fade.
 */
export const Motion: Story = {
  render: function Render() {
    const [count, setCount] = useState(3);
    const [dot, setDot] = useState(false);
    const [hidden, setHidden] = useState(false);
    return (
      <div className="gap-8 flex flex-col items-start">
        <div className="gap-12 px-4 flex items-center">
          <Badge value={dot ? undefined : count} invisible={hidden}>
            <Icon as={NotificationsOutlined} />
          </Badge>
          <Badge
            value={dot ? undefined : count}
            invisible={hidden}
            color="primary"
          >
            <Icon as={MailOutlined} />
          </Badge>
          <Badge value={dot ? undefined : count} invisible={hidden} max={99}>
            <Icon as={ChatOutlined} />
          </Badge>
        </div>
        <div className="gap-2 flex flex-wrap">
          <Button
            size="xs"
            variant="tonal"
            onClick={() => setCount((c) => c + 1)}
          >
            +1
          </Button>
          <Button
            size="xs"
            variant="tonal"
            onClick={() => setCount((c) => c + 97)}
          >
            +97
          </Button>
          <Button
            size="xs"
            variant="tonal"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
          >
            −1
          </Button>
          <Button size="xs" variant="outlined" onClick={() => setCount(0)}>
            Clear
          </Button>
          <Button
            size="xs"
            variant="outlined"
            onClick={() => setDot((d) => !d)}
          >
            {dot ? "Show count" : "Dot"}
          </Button>
          <Button
            size="xs"
            variant="outlined"
            onClick={() => setHidden((h) => !h)}
          >
            {hidden ? "Show" : "Hide"}
          </Button>
        </div>
      </div>
    );
  },
};

const destinations = [
  { label: "Home", icon: HomeOutlined, active: HomeFilled, value: undefined },
  { label: "Mail", icon: MailOutlined, active: MailFilled, value: 12 },
  { label: "Chat", icon: ChatOutlined, active: ChatFilled, value: 1500 },
  { label: "Groups", icon: GroupOutlined, active: GroupFilled, dot: true },
] as const;

/**
 * The canonical MD3 home of badges: a navigation bar. The badge rides the
 * **icon** (inside the active indicator), and — per MD3 — is **hidden once its
 * destination is selected** (`invisible={selected}`), animating out. The
 * destination's accessible name states the count, so assistive tech reads
 * "Mail, 12 new" — the destination first, then the badge.
 */
export const NavigationBar: Story = {
  render: function Render() {
    const [selected, setSelected] = useState(0);
    return (
      <nav
        aria-label="Main"
        className="h-20 flex w-[min(28rem,90vw)] rounded-xl bg-surface-container"
      >
        {destinations.map((d, i) => {
          const isSelected = i === selected;
          const IconC = isSelected ? d.active : d.icon;
          const hasCount = "value" in d && d.value !== undefined;
          const name = hasCount
            ? `${d.label}, ${d.value} new`
            : "dot" in d
              ? `${d.label}, new notification`
              : d.label;
          return (
            <button
              key={d.label}
              type="button"
              aria-label={name}
              aria-current={isSelected ? "page" : undefined}
              onClick={() => setSelected(i)}
              className="group pt-3 pb-4 gap-1 flex flex-1 cursor-pointer flex-col items-center outline-none"
            >
              <span
                className={`h-8 w-16 flex items-center justify-center rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-secondary ${
                  isSelected
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant group-hover:bg-on-surface/8"
                }`}
              >
                <Badge
                  value={"value" in d ? d.value : undefined}
                  invisible={isSelected || (!hasCount && !("dot" in d))}
                  label=""
                >
                  <IconC className="size-6" />
                </Badge>
              </span>
              <span
                className={`text-label-medium ${
                  isSelected ? "text-on-surface" : "text-on-surface-variant"
                }`}
              >
                {d.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  },
};

/**
 * Small badges in a top app bar — MD3: "use a small badge when spaces are
 * tightly constrained, such as app bars." `size="small"` with a `value` shows a
 * dot yet still announces the count. The icon buttons are named by
 * `aria-label`, so the badge is wired with `aria-describedby` → its `id`:
 * screen readers say "Notifications, button, 5".
 */
export const InIconButtons: Story = {
  render: () => (
    <header className="h-16 px-1 gap-1 flex w-[min(32rem,90vw)] items-center rounded-xl bg-surface-container">
      <IconButton aria-label="Menu">
        <MenuOutlined />
      </IconButton>
      <span className="ms-1 flex-1 text-title-large text-on-surface">
        Inbox
      </span>
      <IconButton aria-label="Search">
        <SearchOutlined />
      </IconButton>
      <IconButton aria-label="Notifications" aria-describedby="appbar-notif">
        <Badge id="appbar-notif" value={5} size="small">
          <NotificationsOutlined />
        </Badge>
      </IconButton>
      <IconButton aria-label="Messages" aria-describedby="appbar-mail">
        <Badge id="appbar-mail" value={24}>
          <MailOutlined />
        </Badge>
      </IconButton>
      <IconButton aria-label="More options">
        <MoreVertOutlined />
      </IconButton>
    </header>
  ),
};

/**
 * Without `children` the badge renders inline — MD3: "When an icon with a
 * badge is followed by text or another element, place a large badge at the
 * trailing edge." Here, navigation-drawer style rows.
 */
export const Standalone: Story = {
  render: () => (
    <ul className="p-3 m-0 flex w-[min(22rem,90vw)] list-none flex-col rounded-xl bg-surface-container-low">
      {[
        { icon: MailOutlined, label: "Inbox", value: 24 },
        { icon: StarOutlined, label: "Starred", value: undefined },
        { icon: ChatOutlined, label: "Chats", value: 1200 },
        { icon: SettingsOutlined, label: "Settings", value: "New" },
      ].map(({ icon: IconC, label, value }) => (
        <li key={label}>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="h-14 px-4 gap-3 flex items-center rounded-full text-label-large text-on-surface-variant no-underline hover:bg-on-surface/8"
          >
            <IconC className="size-6" />
            <span className="flex-1">{label}</span>
            {value !== undefined && <Badge value={value} />}
          </a>
        </li>
      ))}
    </ul>
  ),
};

/**
 * `asChild` makes the child itself the anchor (no wrapper `<span>`), e.g. an
 * avatar. Offsets can be re-tuned per anchor with the `--md-comp-badge-*`
 * offset tokens.
 */
export const AsChild: Story = {
  render: () => (
    <Row>
      <Cell caption="avatar · dot">
        <Badge
          asChild
          color="tertiary"
          className="ring-2 ring-surface"
          style={
            {
              "--md-comp-badge-small-size": "0.75rem",
              "--md-comp-badge-small-shape": "0.375rem",
              "--md-comp-badge-small-offset-x": "0.75rem",
              "--md-comp-badge-small-offset-y": "0.75rem",
            } as React.CSSProperties
          }
        >
          <span className="size-10 flex items-center justify-center rounded-full bg-primary-container text-title-medium text-on-primary-container">
            M
          </span>
        </Badge>
      </Cell>
      <Cell caption="avatar · count">
        <Badge asChild value={7}>
          <span className="size-10 flex items-center justify-center rounded-full bg-secondary-container text-title-medium text-on-secondary-container">
            S
          </span>
        </Badge>
      </Cell>
    </Row>
  ),
};

/**
 * Re-theme through tokens — globally in `:root` or per instance via `style`.
 * Painted roles: `--md-comp-badge-color`, `--md-comp-badge-label-text-color`.
 * Geometry: `-small-size`, `-small-shape`, `-large-size`, `-large-shape`,
 * `-large-padding`, and the four offsets. Motion: `-spatial-easing`,
 * `-spatial-duration`, `-effects-easing`, `-effects-duration` (set the durations
 * to `0s` to turn motion off). Keep custom colors at ≥ 3:1 contrast (MD3).
 */
export const Customization: Story = {
  render: () => (
    <div className="gap-6 flex flex-col">
      <Row>
        <Cell caption="custom color">
          <Badge
            value={9}
            style={
              {
                "--md-comp-badge-color": "var(--md-sys-color-inverse-surface)",
                "--md-comp-badge-label-text-color":
                  "var(--md-sys-color-inverse-on-surface)",
              } as React.CSSProperties
            }
          >
            <Icon as={NotificationsOutlined} />
          </Badge>
        </Cell>
        <Cell caption="bigger large badge">
          <Badge
            value={9}
            className="text-label-medium"
            style={
              {
                "--md-comp-badge-large-size": "1.25rem",
                "--md-comp-badge-large-shape": "0.625rem",
                "--md-comp-badge-large-offset-y": "1.125rem",
              } as React.CSSProperties
            }
          >
            <Icon as={NotificationsOutlined} />
          </Badge>
        </Cell>
        <Cell caption="square-ish shape">
          <Badge
            value={9}
            style={
              {
                "--md-comp-badge-large-shape": "0.25rem",
              } as React.CSSProperties
            }
          >
            <Icon as={NotificationsOutlined} />
          </Badge>
        </Cell>
        <Cell caption="no motion">
          <Badge
            value={9}
            style={
              {
                "--md-comp-badge-spatial-duration": "0s",
                "--md-comp-badge-effects-duration": "0s",
              } as React.CSSProperties
            }
          >
            <Icon as={NotificationsOutlined} />
          </Badge>
        </Cell>
      </Row>
      <Divider />
      <p className="m-0 max-w-prose text-body-medium text-on-surface-variant">
        The anchor wrapper takes <code>anchorClassName</code>; the badge takes{" "}
        <code>className</code>. <code>badgeVariants</code> is exported for
        composing the badge look onto your own element.
      </p>
    </div>
  ),
};
