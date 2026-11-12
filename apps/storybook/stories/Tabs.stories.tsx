import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Tabs, { Tab, TabList, TabPanel, TabPanels } from "@chatool/ui/tabs";
import Badge from "@chatool/ui/badge";
import Button from "@chatool/ui/button";
import HomeOutlined from "@chatool/icons/HomeOutlined";
import HomeFilled from "@chatool/icons/HomeFilled";
import MailOutlined from "@chatool/icons/MailOutlined";
import MailFilled from "@chatool/icons/MailFilled";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import ChatFilled from "@chatool/icons/ChatFilled";
import PersonOutlined from "@chatool/icons/PersonOutlined";
import PersonFilled from "@chatool/icons/PersonFilled";
import StarOutlined from "@chatool/icons/StarOutlined";
import ImageOutlined from "@chatool/icons/ImageOutlined";
import FolderOutlined from "@chatool/icons/FolderOutlined";
import SettingsOutlined from "@chatool/icons/SettingsOutlined";

const meta = {
  title: "UI/Tabs",
  component: TabList,
  tags: ["autodocs"],
  args: {
    "aria-label": "Inbox sections",
    variant: "primary",
    layout: "fixed",
    alignment: "fill",
    iconPosition: "top",
    indicatorMotion: "elastic",
    divider: true,
    scrollButtons: false,
    loop: true,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    layout: { control: "inline-radio", options: ["fixed", "scrollable"] },
    alignment: {
      control: "inline-radio",
      options: ["fill", "center", "start"],
    },
    iconPosition: { control: "inline-radio", options: ["top", "start"] },
    indicatorMotion: {
      control: "inline-radio",
      options: ["elastic", "slide", "fade"],
    },
    divider: { control: "boolean" },
    scrollButtons: { control: "select", options: [false, true, "auto"] },
    loop: { control: "boolean" },
  },
  // MD3: the tab container spans the full width of its region.
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-3xl w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabList>;

export default meta;
type Story = StoryObj<typeof meta>;

const Caption = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-label-medium text-on-surface-variant">{children}</p>
);

const Panel = ({ title }: { title: string }) => (
  <div className="p-6">
    <h3 className="text-title-large text-on-surface">{title}</h3>
    <p className="mt-2 text-body-medium text-on-surface-variant">
      Content for “{title}”. Tabs group related content at the same level of
      hierarchy — switch between them with a tap, the arrow keys, or (when the
      panels are swipeable) a swipe.
    </p>
  </div>
);

const SECTIONS = [
  {
    value: "home",
    label: "Home",
    icon: <HomeOutlined />,
    selectedIcon: <HomeFilled />,
  },
  {
    value: "mail",
    label: "Mail",
    icon: <MailOutlined />,
    selectedIcon: <MailFilled />,
  },
  {
    value: "chat",
    label: "Chat",
    icon: <ChatOutlined />,
    selectedIcon: <ChatFilled />,
  },
  {
    value: "profile",
    label: "Profile",
    icon: <PersonOutlined />,
    selectedIcon: <PersonFilled />,
  },
];

/**
 * Every `TabList` option as a control. Tab into the row, then ←/→ move focus
 * (mirrored in RTL) and Space / Enter select (MD3's manual activation). Watch
 * the **elastic** indicator: the leading edge leads on the default-spatial
 * spring and the trailing edge follows on the slow-spatial spring.
 */
export const Playground: Story = {
  render: (args) => (
    <Tabs defaultValue="home">
      <TabList {...args}>
        {SECTIONS.map((s) => (
          <Tab
            key={s.value}
            value={s.value}
            icon={s.icon}
            selectedIcon={s.selectedIcon}
          >
            {s.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {SECTIONS.map((s) => (
          <TabPanel key={s.value} value={s.value}>
            <Panel title={s.label} />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  ),
};

/**
 * **Primary** tabs: the main destinations, under the top app bar. Selected =
 * `primary`; the 3dp indicator spans the label (inset 2dp, min 24dp).
 */
export const Primary: Story = {
  render: () => (
    <Tabs defaultValue="flights">
      <TabList aria-label="Travel">
        <Tab value="flights">Flights</Tab>
        <Tab value="trips">Trips</Tab>
        <Tab value="explore">Explore</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="flights">
          <Panel title="Flights" />
        </TabPanel>
        <TabPanel value="trips">
          <Panel title="Trips" />
        </TabPanel>
        <TabPanel value="explore">
          <Panel title="Explore" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

/**
 * **Secondary** tabs: a second level inside a content area. Selected =
 * `on-surface`; a 2dp full-width indicator.
 */
export const Secondary: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabList aria-label="Project" variant="secondary">
        <Tab value="overview">Overview</Tab>
        <Tab value="specs">Specifications</Tab>
        <Tab value="reviews">Reviews</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="overview">
          <Panel title="Overview" />
        </TabPanel>
        <TabPanel value="specs">
          <Panel title="Specifications" />
        </TabPanel>
        <TabPanel value="reviews">
          <Panel title="Reviews" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

/**
 * Icon above the label (64dp container). `selectedIcon` swaps in the filled
 * glyph while selected.
 */
export const StackedIcons: Story = {
  render: () => (
    <Tabs defaultValue="mail">
      <TabList aria-label="Inbox">
        {SECTIONS.map((s) => (
          <Tab
            key={s.value}
            value={s.value}
            icon={s.icon}
            selectedIcon={s.selectedIcon}
          >
            {s.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
};

/** `iconPosition="start"`: the icon sits 8dp before the label (48dp). */
export const InlineIcons: Story = {
  render: () => (
    <div className="gap-6 flex flex-col">
      <Tabs defaultValue="mail">
        <TabList aria-label="Inbox (primary)" iconPosition="start">
          {SECTIONS.map((s) => (
            <Tab key={s.value} value={s.value} icon={s.icon}>
              {s.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <Tabs defaultValue="mail">
        <TabList
          aria-label="Inbox (secondary)"
          variant="secondary"
          iconPosition="start"
        >
          {SECTIONS.map((s) => (
            <Tab key={s.value} value={s.value} icon={s.icon}>
              {s.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </div>
  ),
};

/**
 * Icon-only tabs need an `aria-label` (and globally recognized icons, MD3).
 * The indicator keeps its 24dp minimum length.
 */
export const IconOnly: Story = {
  render: () => (
    <Tabs defaultValue="home">
      <TabList aria-label="Sections">
        {SECTIONS.map((s) => (
          <Tab
            key={s.value}
            value={s.value}
            aria-label={s.label}
            icon={s.icon}
            selectedIcon={s.selectedIcon}
          />
        ))}
      </TabList>
    </Tabs>
  ),
};

/**
 * Badges: `true` = small dot, a number = large count (`999+` max). On stacked
 * and icon-only tabs the badge overlaps the icon by 6dp; otherwise it follows
 * the label by 4dp. Pass your own `<Badge />` for a custom color. MD3: clear a
 * badge once its tab has been seen — here it clears on selection.
 */
export const Badges: Story = {
  render: () => {
    const [value, setValue] = useState("home");
    const [seen, setSeen] = useState<string[]>(["home"]);
    const select = (next: string) => {
      setValue(next);
      setSeen((list) => (list.includes(next) ? list : [...list, next]));
    };
    const badges: Record<string, React.ComponentProps<typeof Tab>["badge"]> = {
      home: true,
      mail: 12,
      chat: 1500,
      profile: <Badge color="primary" value="New" />,
    };
    const badgeFor = (key: string) => (seen.includes(key) ? null : badges[key]);
    return (
      <div className="gap-6 flex flex-col">
        <Tabs value={value} onValueChange={select}>
          <TabList aria-label="Stacked with badges">
            {SECTIONS.map((s) => (
              <Tab
                key={s.value}
                value={s.value}
                icon={s.icon}
                selectedIcon={s.selectedIcon}
                badge={badgeFor(s.value)}
              >
                {s.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Tabs value={value} onValueChange={select}>
          <TabList aria-label="Labels with badges">
            {SECTIONS.map((s) => (
              <Tab key={s.value} value={s.value} badge={badgeFor(s.value)}>
                {s.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Tabs value={value} onValueChange={select}>
          <TabList aria-label="Secondary with badges" variant="secondary">
            {SECTIONS.map((s) => (
              <Tab key={s.value} value={s.value} badge={badgeFor(s.value)}>
                {s.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Button
          variant="text"
          className="self-start"
          onClick={() => setSeen([value])}
        >
          Reset badges
        </Button>
      </div>
    );
  },
};

const GENRES = [
  "For you",
  "Top charts",
  "Children",
  "Premium",
  "Categories",
  "Editors' choice",
  "New releases",
  "Pre-registration",
  "Family",
  "Offline games",
];

/**
 * `layout="scrollable"`: tabs size to their labels (min 90dp), start 52dp from
 * the leading edge and scroll. The selected tab springs to the center; the row
 * follows keyboard focus.
 */
export const Scrollable: Story = {
  render: () => (
    <Tabs defaultValue="Premium">
      <TabList aria-label="Store" layout="scrollable">
        {GENRES.map((g) => (
          <Tab key={g} value={g}>
            {g}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
};

/**
 * `scrollButtons`: chevrons that page the row (`"auto"` = mouse / trackpad
 * only). They're `aria-hidden` and skip the Tab order; they dim at each end.
 */
export const ScrollButtons: Story = {
  render: () => (
    <div className="gap-6 flex flex-col">
      <Tabs defaultValue="For you">
        <TabList aria-label="Store" layout="scrollable" scrollButtons>
          {GENRES.map((g) => (
            <Tab key={g} value={g}>
              {g}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <Tabs defaultValue="For you">
        <TabList
          aria-label="Store (secondary)"
          variant="secondary"
          layout="scrollable"
          scrollButtons="auto"
        >
          {GENRES.map((g) => (
            <Tab key={g} value={g}>
              {g}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </div>
  ),
};

/**
 * Fixed tabs on wide windows (MD3 responsive layout): `center` / `start` size
 * every tab to the widest one and align the group; `fill` shares the width.
 */
export const Alignment: Story = {
  render: () => (
    <div className="gap-6 flex flex-col">
      {(["fill", "center", "start"] as const).map((alignment) => (
        <div key={alignment}>
          <Caption>alignment=&quot;{alignment}&quot;</Caption>
          <Tabs defaultValue="all">
            <TabList
              aria-label={`Alignment ${alignment}`}
              alignment={alignment}
            >
              <Tab value="all">All</Tab>
              <Tab value="photos">Photos</Tab>
              <Tab value="shared">Shared albums</Tab>
            </TabList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

/**
 * The three indicator motions side by side: `elastic` (MD3 Expressive),
 * `slide` (Compose) and `fade` (MDC). Click far-apart tabs to compare.
 */
export const IndicatorMotion: Story = {
  render: () => (
    <div className="gap-6 flex flex-col">
      {(["elastic", "slide", "fade"] as const).map((motion) => (
        <div key={motion}>
          <Caption>indicatorMotion=&quot;{motion}&quot;</Caption>
          <Tabs defaultValue="a">
            <TabList aria-label={`Motion ${motion}`} indicatorMotion={motion}>
              <Tab value="a">Music</Tab>
              <Tab value="b">Podcasts & shows</Tab>
              <Tab value="c">Audiobooks</Tab>
              <Tab value="d">Live</Tab>
            </TabList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

/**
 * MD3 "swipe within the content area": swipe the panels (touch or trackpad) —
 * the indicator follows the finger and the tab is selected when the swipe
 * settles. Tapping a tab springs the pager to its panel.
 */
export const SwipeablePanels: Story = {
  render: () => (
    <Tabs defaultValue="photos">
      <TabList aria-label="Library" iconPosition="start">
        <Tab value="photos" icon={<ImageOutlined />}>
          Photos
        </Tab>
        <Tab value="albums" icon={<FolderOutlined />}>
          Albums
        </Tab>
        <Tab value="favorites" icon={<StarOutlined />}>
          Favorites
        </Tab>
      </TabList>
      <TabPanels swipeable>
        {["Photos", "Albums", "Favorites"].map((title) => (
          <TabPanel key={title} value={title.toLowerCase()}>
            <div className="m-4 h-56 gap-2 grid grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="p-2 rounded-md bg-surface-container-high text-label-medium text-on-surface-variant"
                >
                  {title} {i + 1}
                </div>
              ))}
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  ),
};

/**
 * How a newly selected panel enters (non-swipeable): `slide` (MD3 shared axis
 * X, default), `fade`, or `none`. It never plays on first paint.
 */
export const PanelTransitions: Story = {
  render: () => (
    <div className="gap-8 flex flex-col">
      {(["slide", "fade", "none"] as const).map((transition) => (
        <div key={transition}>
          <Caption>transition=&quot;{transition}&quot;</Caption>
          <Tabs defaultValue="one">
            <TabList
              aria-label={`Transition ${transition}`}
              variant="secondary"
            >
              <Tab value="one">One</Tab>
              <Tab value="two">Two</Tab>
              <Tab value="three">Three</Tab>
            </TabList>
            <TabPanels transition={transition} className="overflow-hidden">
              {["one", "two", "three"].map((v) => (
                <TabPanel key={v} value={v}>
                  <Panel title={`Panel ${v}`} />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

/**
 * Controlled selection, driven from outside too. `onValueChange` also reports
 * the `reason`; calling `preventDefault()` in a tab's `onClick` vetoes it.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("mail");
    const [reason, setReason] = useState("—");
    const order = SECTIONS.map((s) => s.value);
    const step = (by: number) =>
      setValue(
        (v) => order[(order.indexOf(v) + by + order.length) % order.length]!,
      );
    return (
      <div className="gap-4 flex flex-col">
        <Caption>
          value = {value} · last reason = {reason}
        </Caption>
        <Tabs
          value={value}
          onValueChange={(next, details) => {
            setValue(next);
            setReason(details.reason);
          }}
        >
          <TabList aria-label="Controlled">
            {SECTIONS.map((s) => (
              <Tab
                key={s.value}
                value={s.value}
                onClick={(event) => {
                  if (s.value === "profile") event.preventDefault();
                }}
              >
                {s.value === "profile" ? "Profile (vetoed)" : s.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <div className="gap-2 flex">
          <Button variant="tonal" onClick={() => step(-1)}>
            Previous
          </Button>
          <Button variant="tonal" onClick={() => step(1)}>
            Next
          </Button>
        </div>
      </div>
    );
  },
};

/** Secondary tabs nested under primary tabs (MD3: secondary always below). */
export const PrimaryWithSecondary: Story = {
  render: () => (
    <Tabs defaultValue="movies">
      <TabList aria-label="Media">
        <Tab value="movies">Movies</Tab>
        <Tab value="photos">Photos</Tab>
        <Tab value="music">Music</Tab>
      </TabList>
      <TabPanels>
        {["movies", "photos", "music"].map((section) => (
          <TabPanel key={section} value={section}>
            <Tabs defaultValue="overview">
              <TabList aria-label={`${section} views`} variant="secondary">
                <Tab value="overview">Overview</Tab>
                <Tab value="specs">Specifications</Tab>
                <Tab value="reviews">Reviews</Tab>
              </TabList>
              <TabPanels>
                {["overview", "specs", "reviews"].map((view) => (
                  <TabPanel key={view} value={view}>
                    <Panel title={`${section} · ${view}`} />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  ),
};

/**
 * Route tabs: `asChild` renders each tab as your link (e.g. Next.js `<Link>`);
 * the child's children become the label. Drive `value` from the current route.
 */
export const LinkTabs: Story = {
  render: () => {
    const [route, setRoute] = useState("/overview");
    return (
      <Tabs value={route} onValueChange={setRoute}>
        <TabList aria-label="Account">
          {["/overview", "/billing", "/security"].map((href) => (
            <Tab key={href} value={href} asChild>
              <a href={`#${href}`}>{href.slice(1)}</a>
            </Tab>
          ))}
        </TabList>
      </Tabs>
    );
  },
};

/** Disabled tabs are skipped by the arrow keys and can't be selected. */
export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="general">
      <TabList aria-label="Settings" iconPosition="start">
        <Tab value="general" icon={<SettingsOutlined />}>
          General
        </Tab>
        <Tab value="beta" icon={<StarOutlined />} disabled>
          Beta
        </Tab>
        <Tab value="account" icon={<PersonOutlined />}>
          Account
        </Tab>
      </TabList>
    </Tabs>
  ),
};

/**
 * `activationMode="automatic"` (APG): focus selects. Use it only when panels
 * render instantly.
 */
export const AutomaticActivation: Story = {
  render: () => (
    <Tabs defaultValue="a" activationMode="automatic">
      <TabList aria-label="Automatic">
        <Tab value="a">Day</Tab>
        <Tab value="b">Week</Tab>
        <Tab value="c">Month</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="a">
          <Panel title="Day" />
        </TabPanel>
        <TabPanel value="b">
          <Panel title="Week" />
        </TabPanel>
        <TabPanel value="c">
          <Panel title="Month" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

/** RTL mirrors the layout, the arrow keys, the indicator motion and scrolling. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" className="gap-6 flex flex-col">
      <Tabs defaultValue="home">
        <TabList aria-label="RTL">
          {SECTIONS.map((s) => (
            <Tab
              key={s.value}
              value={s.value}
              icon={s.icon}
              badge={s.value === "mail" ? 3 : undefined}
            >
              {s.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <Tabs defaultValue="Premium">
        <TabList aria-label="RTL scrollable" layout="scrollable" scrollButtons>
          {GENRES.map((g) => (
            <Tab key={g} value={g}>
              {g}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </div>
  ),
};

/**
 * Re-theme with `--md-comp-tabs-*` tokens (globally or per instance) — here a
 * tertiary indicator, a rounded 4dp pill indicator, a tonal container and a
 * snappier spring.
 */
export const CustomTokens: Story = {
  render: () => (
    <Tabs defaultValue="b">
      <TabList
        aria-label="Custom"
        className="rounded-xl [--md-comp-tabs-active-label-text-color:var(--md-sys-color-tertiary)] [--md-comp-tabs-active-state-layer-color:var(--md-sys-color-tertiary)] [--md-comp-tabs-container-color:var(--md-sys-color-surface-container)] [--md-comp-tabs-indicator-color:var(--md-sys-color-tertiary)] [--md-comp-tabs-indicator-leading-duration:300ms] [--md-comp-tabs-indicator-trailing-duration:520ms] [--md-comp-tabs-pressed-state-layer-color:var(--md-sys-color-tertiary)] [--md-comp-tabs-primary-indicator-height:4px] [--md-comp-tabs-primary-indicator-shape:4px]"
      >
        <Tab value="a">Overview</Tab>
        <Tab value="b">Activity</Tab>
        <Tab value="c">Insights</Tab>
      </TabList>
    </Tabs>
  ),
};
