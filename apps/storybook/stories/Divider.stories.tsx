import { Fragment } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Divider from "@chatool/ui/divider";
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import EditOutlined from "@chatool/icons/EditOutlined";
import ShareOutlined from "@chatool/icons/ShareOutlined";
import DeleteOutlined from "@chatool/icons/DeleteOutlined";
import ContentCopyOutlined from "@chatool/icons/ContentCopyOutlined";
import ContentPasteOutlined from "@chatool/icons/ContentPasteOutlined";
import SettingsOutlined from "@chatool/icons/SettingsOutlined";
import LogoutOutlined from "@chatool/icons/LogoutOutlined";
import ImageOutlined from "@chatool/icons/ImageOutlined";

const meta = {
  title: "UI/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    inset: {
      control: "inline-radio",
      options: ["none", "start", "end", "middle"],
    },
    weight: { control: "inline-radio", options: ["regular", "heavy"] },
    labelPosition: {
      control: "inline-radio",
      options: ["start", "center", "end"],
    },
    decorative: { control: "boolean" },
    children: { control: "text" },
    asChild: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl w-[min(36rem,90vw)] text-on-surface">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A surface to set dividers on (MD3 places them on surfaces and containers). */
const Surface = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={`py-4 rounded-xl bg-surface-container-low text-on-surface ${className}`}
  >
    {children}
  </div>
);

const Avatar = ({ letter }: { letter: string }) => (
  <span className="size-10 flex shrink-0 items-center justify-center rounded-full bg-primary-container text-title-medium text-on-primary-container">
    {letter}
  </span>
);

/** Tweak every prop live. Set `orientation="vertical"` to see it fill the row. */
export const Playground: Story = {
  render: (args) => (
    <Surface className="h-40 px-0 gap-4 flex flex-col justify-center">
      <p className="px-4 text-body-medium">Content above</p>
      <div
        className={
          args.orientation === "vertical"
            ? "h-20 px-4 gap-4 flex items-center"
            : "flex flex-col"
        }
      >
        {args.orientation === "vertical" ? (
          <span className="text-body-medium">Left</span>
        ) : null}
        <Divider {...args} />
        {args.orientation === "vertical" ? (
          <span className="text-body-medium">Right</span>
        ) : null}
      </div>
      <p className="px-4 text-body-medium">Content below</p>
    </Surface>
  ),
};

/**
 * The four MD3 types, all horizontal. `start` is the spec's **inset** divider
 * (16dp leading); `middle` is **middle-inset** (16dp on both sides).
 */
export const InsetTypes: Story = {
  render: () => (
    <Surface className="gap-6 flex flex-col">
      {(
        [
          ["none", "Full-width: 100%"],
          ["start", "Inset: 16dp leading, 0dp trailing"],
          ["end", "Inset end: 0dp leading, 16dp trailing"],
          ["middle", "Middle-inset: 16dp on both sides"],
        ] as const
      ).map(([inset, label]) => (
        <div key={inset} className="gap-2 flex flex-col">
          <span className="px-4 text-label-medium text-on-surface-variant">
            {label}
          </span>
          <Divider inset={inset} />
        </div>
      ))}
    </Surface>
  ),
};

/**
 * MD3: inset dividers separate **related** items, such as emails in a list, and
 * line up with the text after an avatar. Here the start inset is 72px (16dp
 * padding + 40dp avatar + 16dp gap), set with the `--md-comp-divider-inset-start`
 * token. `asChild` puts each divider on an `<li>`, so the list markup stays valid.
 */
export const ListWithAvatars: Story = {
  render: () => {
    const rows = [
      ["A", "Ali Connors", "Brunch this weekend?"],
      ["S", "Sandra Adams", "Summer BBQ plans"],
      ["T", "Trevor Hansen", "Oui oui, see you soon"],
      ["B", "Britta Holt", "Recipe to try"],
    ];
    return (
      <Surface className="py-2">
        <ul aria-label="Inbox" className="flex flex-col">
          {rows.map(([letter, name, line], i) => (
            <Fragment key={name}>
              <li className="px-4 py-3 gap-4 flex items-center">
                <Avatar letter={letter} />
                <span className="flex flex-col">
                  <span className="text-body-large">{name}</span>
                  <span className="text-body-medium text-on-surface-variant">
                    {line}
                  </span>
                </span>
              </li>
              {i < rows.length - 1 ? (
                <Divider
                  asChild
                  inset="start"
                  className="[--md-comp-divider-inset-start:72px]"
                >
                  <li />
                </Divider>
              ) : null}
            </Fragment>
          ))}
        </ul>
      </Surface>
    );
  },
};

/**
 * MD3 "Do": combine both kinds to show the hierarchy. Full-width dividers mark
 * different kinds of content; inset dividers separate items inside one section.
 */
export const Hierarchy: Story = {
  render: () => (
    <Surface className="py-0">
      {[
        ["Today", ["Design review", "Standup"]],
        ["Tomorrow", ["Roadmap sync", "1:1 with Sam", "Demo day"]],
      ].map(([day, items], s, sections) => (
        <section key={day as string}>
          <h3 className="px-4 pt-4 pb-2 text-title-small text-primary">
            {day}
          </h3>
          {(items as string[]).map((item, i, all) => (
            <div key={item}>
              <p className="px-4 py-3 text-body-large">{item}</p>
              {i < all.length - 1 ? <Divider inset="start" /> : null}
            </div>
          ))}
          {s < sections.length - 1 ? <Divider /> : null}
        </section>
      ))}
    </Surface>
  ),
};

/**
 * MD3 "Do": a full-width divider separates the interactive area of a card (its
 * actions) from the non-interactive content.
 */
export const InCard: Story = {
  render: () => (
    <article className="overflow-hidden rounded-xl bg-surface-container-highest text-on-surface">
      <div className="h-36 flex items-center justify-center bg-secondary-container text-on-secondary-container">
        <ImageOutlined className="size-12" />
      </div>
      <div className="p-4 gap-1 flex flex-col">
        <h3 className="text-title-large">Glacier hike</h3>
        <p className="text-body-medium text-on-surface-variant">
          A six-hour guided trail across the ice field, with lunch at the ridge.
        </p>
      </div>
      <Divider />
      <div className="px-2 py-2 gap-2 flex justify-end">
        <Button variant="text">Share</Button>
        <Button variant="tonal">Book</Button>
      </div>
    </article>
  ),
};

/**
 * MD3 vertical divider: separates content in a row, like a toolbar's action
 * groups or text next to media on a large screen. In a flex row it fills the
 * height on its own; inline in text it's 1em tall.
 */
export const Vertical: Story = {
  render: () => (
    <div className="gap-6 flex flex-col">
      <Surface className="px-2 py-2 gap-1 flex w-fit items-center">
        <IconButton aria-label="Edit">
          <EditOutlined />
        </IconButton>
        <IconButton aria-label="Share">
          <ShareOutlined />
        </IconButton>
        <Divider orientation="vertical" className="mx-1 h-6 self-center" />
        <IconButton aria-label="Delete">
          <DeleteOutlined />
        </IconButton>
      </Surface>

      <p className="text-body-medium text-on-surface-variant">
        <a className="text-primary underline" href="#terms">
          Terms
        </a>
        <Divider orientation="vertical" className="mx-3" />
        <a className="text-primary underline" href="#privacy">
          Privacy
        </a>
        <Divider orientation="vertical" className="mx-3" />
        <a className="text-primary underline" href="#help">
          Help
        </a>
      </p>

      <Surface className="px-4 gap-4 flex">
        <p className="flex-1 text-body-medium">
          A vertical divider can arrange content on a larger screen, such as
          paragraph text next to imagery.
        </p>
        <Divider orientation="vertical" />
        <div className="flex flex-1 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary-container">
          <ImageOutlined className="size-10" />
        </div>
      </Surface>
    </div>
  ),
};

/**
 * The heavy weight (8dp) from MDC-Android's M3 theme, for separating whole
 * sections such as groups on a settings screen. Use it sparingly.
 */
export const Heavy: Story = {
  render: () => (
    <Surface className="py-0">
      <p className="px-4 py-4 text-body-large">Account</p>
      <Divider weight="heavy" />
      <p className="px-4 py-4 text-body-large">Notifications</p>
      <Divider weight="heavy" />
      <p className="px-4 py-4 text-body-large">Privacy</p>
    </Surface>
  ),
};

/**
 * A label between two line segments. The lines are pseudo-elements, so screen
 * readers only read the label, as plain text.
 */
export const Labelled: Story = {
  render: () => (
    <Surface className="px-4 gap-6 flex flex-col">
      <Divider>or</Divider>
      <Divider labelPosition="start">Earlier this week</Divider>
      <Divider labelPosition="end">End of results</Divider>
      <Divider inset="middle">Middle-inset</Divider>
      <div className="h-24 gap-4 flex items-center">
        <span className="text-body-medium">Sign in</span>
        <Divider orientation="vertical">or</Divider>
        <span className="text-body-medium">Create account</span>
      </div>
    </Surface>
  ),
};

/**
 * Accessibility: in a `role="menu"`, groups are split by a real separator. Pass
 * `decorative={false}` and `asChild` to put `role="separator"` on an `<li>`.
 */
export const MenuSeparator: Story = {
  render: () => (
    <ul
      role="menu"
      aria-label="Edit"
      className="w-56 py-2 rounded-lg bg-surface-container text-body-large text-on-surface shadow-elevation-2"
    >
      {[
        [ContentCopyOutlined, "Copy"],
        [ContentPasteOutlined, "Paste"],
      ].map(([Icon, label]) => (
        <li
          key={label as string}
          role="menuitem"
          tabIndex={-1}
          className="h-12 px-3 gap-3 flex items-center"
        >
          <Icon className="size-6 text-on-surface-variant" />
          {label as string}
        </li>
      ))}
      <Divider asChild decorative={false} className="my-2">
        <li />
      </Divider>
      {[
        [SettingsOutlined, "Settings"],
        [LogoutOutlined, "Sign out"],
      ].map(([Icon, label]) => (
        <li
          key={label as string}
          role="menuitem"
          tabIndex={-1}
          className="h-12 px-3 gap-3 flex items-center"
        >
          <Icon className="size-6 text-on-surface-variant" />
          {label as string}
        </li>
      ))}
    </ul>
  ),
};

/**
 * Accessibility: `decorative={false}` on a plain horizontal divider renders a
 * native `<hr>` (implicit `separator` role), for a thematic break between topics.
 */
export const ThematicBreak: Story = {
  render: () => (
    <article className="gap-4 flex flex-col text-body-large">
      <p>The storm broke at dawn, and the harbor went quiet.</p>
      <Divider decorative={false} inset="middle" className="my-2" />
      <p>Three weeks later, the first boat came back.</p>
    </article>
  ),
};

/**
 * Re-theme with the `--md-comp-divider-*` tokens, per instance or app-wide in
 * `:root`. Spacing around the line is plain Tailwind (`my-*`, `mx-*`).
 */
export const Customization: Story = {
  render: () => (
    <Surface className="px-4 gap-6 flex flex-col">
      <Divider className="[--md-comp-divider-color:var(--md-sys-color-primary)]" />
      <Divider className="[--md-comp-divider-color:var(--md-sys-color-outline)] [--md-comp-divider-thickness:2px]" />
      <Divider
        style={
          {
            "--md-comp-divider-color": "var(--md-sys-color-tertiary)",
            "--md-comp-divider-label-text-color":
              "var(--md-sys-color-tertiary)",
            "--md-comp-divider-label-space": "1rem",
          } as React.CSSProperties
        }
      >
        Custom label
      </Divider>
      <Divider className="[--md-comp-divider-thickness:0.5px]" />
    </Surface>
  ),
};

/** Insets are logical: in right-to-left layouts `start` flips to the right. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Surface className="gap-4 flex flex-col">
        <span className="px-4 text-label-medium text-on-surface-variant">
          inset=&quot;start&quot; in RTL
        </span>
        <Divider inset="start" />
        <Divider labelPosition="start" inset="start" className="me-4">
          عنوان
        </Divider>
      </Surface>
    </div>
  ),
};
