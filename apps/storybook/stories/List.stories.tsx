import { useState } from "react";
import type * as React from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import List, {
  ListDivider,
  ListItem,
  ListItemAvatar,
  ListItemDragHandle,
  ListItemExpandable,
  ListItemIcon,
  ListItemImage,
  ListItemVideo,
} from "@chatool/ui/list";
import Checkbox from "@chatool/ui/checkbox";
import Radio from "@chatool/ui/radio";
import Switch from "@chatool/ui/switch";
import Badge from "@chatool/ui/badge";
import Button from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import StarRounded from "@chatool/icons/StarRounded";
import PersonRounded from "@chatool/icons/PersonRounded";
import MailRounded from "@chatool/icons/MailRounded";
import SendRounded from "@chatool/icons/SendRounded";
import DeleteRounded from "@chatool/icons/DeleteRounded";
import FolderRounded from "@chatool/icons/FolderRounded";
import SettingsRounded from "@chatool/icons/SettingsRounded";
import NotificationsRounded from "@chatool/icons/NotificationsRounded";
import LockRounded from "@chatool/icons/LockRounded";
import LanguageRounded from "@chatool/icons/LanguageRounded";
import DarkModeRounded from "@chatool/icons/DarkModeRounded";
import BookmarkRounded from "@chatool/icons/BookmarkRounded";
import MoreVertRounded from "@chatool/icons/MoreVertRounded";
import ChevronRightRounded from "@chatool/icons/ChevronRightRounded";
import CheckRounded from "@chatool/icons/CheckRounded";
import ImageRounded from "@chatool/icons/ImageRounded";
import PlayArrowRounded from "@chatool/icons/PlayArrowRounded";
import HomeRounded from "@chatool/icons/HomeRounded";
import ChatRounded from "@chatool/icons/ChatRounded";
import VolumeUpRounded from "@chatool/icons/VolumeUpRounded";
import LocationOnRounded from "@chatool/icons/LocationOnRounded";
import FavoriteRounded from "@chatool/icons/FavoriteRounded";

/** Lists fill their container; keep the stories at a phone-ish width. */
const Narrow: Decorator = (Story) => (
  <div className="w-[26rem] max-w-full">
    <Story />
  </div>
);

const meta = {
  title: "UI/List",
  component: List,
  tags: ["autodocs"],
  args: { variant: "standard", dividers: false, loop: true },
  argTypes: {
    variant: { control: "inline-radio", options: ["standard", "segmented"] },
    density: { control: "inline-radio", options: [0, -1, -2, -3] },
    dividers: { control: "boolean" },
    navigation: { control: "inline-radio", options: ["roving", "tab"] },
    loop: { control: "boolean" },
    disabled: { control: "boolean" },
    selectionMode: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onReorder: { table: { disable: true } },
    asChild: { table: { disable: true } },
  },
  decorators: [Narrow],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A token-colored thumbnail, so media reads in light and dark, offline. */
const Thumb = ({
  tone = "primary",
}: {
  tone?: "primary" | "secondary" | "tertiary";
}) => (
  <svg
    viewBox="0 0 112 64"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden
    className="block size-full"
  >
    <rect
      width="112"
      height="64"
      fill={`var(--md-sys-color-${tone}-container)`}
    />
    <circle
      cx="82"
      cy="20"
      r="9"
      fill="var(--md-sys-color-tertiary)"
      opacity="0.8"
    />
    <path
      d="M0 48 C24 34 44 38 62 46 S96 32 112 40 V64 H0Z"
      fill={`var(--md-sys-color-${tone})`}
    />
  </svg>
);

/** A labelled column for side-by-side comparisons. */
const Column = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={className}>
    <h3 className="mb-2 px-4 text-label-large text-on-surface-variant">
      {title}
    </h3>
    {children}
  </section>
);

const people = [
  ["Ali Connors", "Brunch this weekend?", "AC"],
  ["Trevor Hansen", "Summer BBQ", "TH"],
  ["Sandra Adams", "Oui oui", "SA"],
] as const;

/**
 * Every list prop. Try the **segmented** style, the **density** steps and
 * **dividers**, then Tab in and use the arrow keys (one Tab stop, wrapping).
 */
export const Playground: Story = {
  render: (args) => (
    <List aria-label="Inbox" {...args}>
      {people.map(([name, text, initials]) => (
        <ListItem
          key={name}
          onClick={() => {}}
          leading={<ListItemAvatar>{initials}</ListItemAvatar>}
          supportingText={text}
          trailingSupportingText="10 min"
        >
          {name}
        </ListItem>
      ))}
      <ListItem
        onClick={() => {}}
        leading={<StarRounded />}
        trailing={<ChevronRightRounded />}
      >
        Starred
      </ListItem>
    </List>
  ),
};

/**
 * MD3 Expressive's two **styles** — a visual choice that never changes
 * behavior. Standard rows are transparent (they drop onto any surface);
 * segmented rows are filled `surface-container` tiles with 2dp gaps, 16dp
 * outer and 4dp inner corners. The selected row morphs to 16dp all round.
 */
export const Styles: Story = {
  render: () => {
    const rows = (
      <>
        {["Inbox", "Outbox", "Favorites", "Trash"].map((label, index) => (
          <ListItem
            key={label}
            onClick={() => {}}
            selected={index === 2}
            leading={<StarRounded />}
            trailingSupportingText="⌘C"
          >
            {label}
          </ListItem>
        ))}
      </>
    );
    return (
      <div className="gap-8 grid">
        <Column title="Standard">
          <List aria-label="Standard">{rows}</List>
        </Column>
        <Column title="Segmented">
          <List variant="segmented" aria-label="Segmented">
            {rows}
          </List>
        </Column>
      </div>
    );
  },
};

/**
 * MD3 anatomy: overline, label (headline), supporting text, trailing text and
 * a trailing icon around a leading icon / avatar / image / video. Rows grow
 * from 56dp (one line) to 72dp (two) to 88dp (three), and three-line rows hang
 * their leading / trailing content from the top.
 */
export const Configurations: Story = {
  render: () => (
    <List variant="segmented" aria-label="Configurations">
      <ListItem>Label text only</ListItem>
      <ListItem
        leading={
          <ListItemIcon>
            <PersonRounded />
          </ListItemIcon>
        }
        trailingSupportingText="100+"
      >
        Leading icon + trailing text
      </ListItem>
      <ListItem
        leading={<ListItemAvatar>A</ListItemAvatar>}
        supportingText="Supporting text"
        trailing={
          <ListItemIcon>
            <PlayArrowRounded />
          </ListItemIcon>
        }
      >
        Leading avatar
      </ListItem>
      <ListItem
        leading={
          <ListItemImage>
            <Thumb tone="secondary" />
          </ListItemImage>
        }
        overline="Overline"
        supportingText="Supporting text that's long enough to wrap onto a second line in this row"
      >
        Leading image, three lines
      </ListItem>
      <ListItem
        leading={
          <ListItemVideo>
            <Thumb tone="tertiary" />
          </ListItemVideo>
        }
        supportingText="Small video thumbnail, 100×56dp"
      >
        Leading video
      </ListItem>
      <ListItem
        leading={
          <ListItemVideo size="large">
            <Thumb />
          </ListItemVideo>
        }
        supportingText="Large video thumbnail, 114×64dp"
      >
        Large video
      </ListItem>
    </List>
  ),
};

/**
 * **Single-action** lists: the whole row is one link (`href`), button
 * (`onClick`) or your router link (`asChild`). `selected` marks the current
 * page (`aria-current`) with the 16dp selected shape.
 */
export const SingleAction: Story = {
  render: () => (
    <List aria-label="Navigation" variant="segmented">
      <ListItem
        asChild
        selected
        leading={<HomeRounded />}
        trailing={<Badge value={3} />}
      >
        <a href="#home">Home</a>
      </ListItem>
      <ListItem
        href="#messages"
        leading={<ChatRounded />}
        trailing={<Badge value={128} max={99} />}
      >
        Messages
      </ListItem>
      <ListItem
        onClick={() => alert("Settings")}
        leading={<SettingsRounded />}
        trailing={<ChevronRightRounded />}
      >
        Settings
      </ListItem>
      <ListItem href="#locked" disabled leading={<LockRounded />}>
        Disabled link
      </ListItem>
    </List>
  ),
};

/**
 * **Multi-action** lists: a primary action plus raised secondary actions in
 * the trailing slot. Hovering the icon buttons un-hovers the row; the arrow
 * keys walk every action in reading order (MD3).
 */
export const MultiAction: Story = {
  render: () => {
    const [saved, setSaved] = useState<string[]>(["Trevor Hansen"]);
    return (
      <List aria-label="Contacts">
        {people.map(([name, text, initials]) => (
          <ListItem
            key={name}
            onClick={() => {}}
            leading={<ListItemAvatar>{initials}</ListItemAvatar>}
            supportingText={text}
            trailing={
              <>
                <IconButton
                  aria-label={`Bookmark ${name}`}
                  selected={saved.includes(name)}
                  onClick={() =>
                    setSaved((list) =>
                      list.includes(name)
                        ? list.filter((entry) => entry !== name)
                        : [...list, name],
                    )
                  }
                >
                  <BookmarkRounded />
                </IconButton>
                <IconButton aria-label={`More for ${name}`}>
                  <MoreVertRounded />
                </IconButton>
              </>
            }
          >
            {name}
          </ListItem>
        ))}
      </List>
    );
  },
};

/**
 * **Multi-select with checkboxes** — the row is the checkbox's `<label>`:
 * the whole row toggles the native input, a checked box selects the row
 * (MD3: "both the list item and the checkbox show a selected state"), and it
 * submits with a form. Works with zero JS.
 */
export const Checkboxes: Story = {
  render: () => (
    <List variant="segmented" aria-label="Toppings">
      {["Cheese", "Mushrooms", "Olives", "Pepperoni"].map((topping, index) => (
        <ListItem
          key={topping}
          control={
            <Checkbox
              name="topping"
              value={topping}
              defaultChecked={index === 1}
            />
          }
          supportingText={index === 3 ? "Sold out" : "Additional info"}
          disabled={index === 3}
          trailing={<FavoriteRounded />}
        >
          {topping}
        </ListItem>
      ))}
    </List>
  ),
};

/**
 * **Single-select with radio buttons** — native radios sharing a `name`.
 * The arrow keys move focus (MD3), Space / Enter select.
 */
export const Radios: Story = {
  render: () => (
    <List aria-label="Ringtone">
      {["Andromeda", "Bubbles", "Cosmos", "Default"].map((tone, index) => (
        <ListItem
          key={tone}
          control={
            <Radio name="ringtone" value={tone} defaultChecked={index === 0} />
          }
          leading={<VolumeUpRounded />}
        >
          {tone}
        </ListItem>
      ))}
    </List>
  ),
};

/**
 * Settings with **switches** at the trailing edge. Press anywhere on the row
 * and the handle presses with it. `selected={false}` keeps a settings row
 * neutral while on; leave it out to get MD3's selected row.
 */
export const Switches: Story = {
  render: () => (
    <div className="gap-6 grid">
      <List variant="segmented" aria-label="Settings">
        <ListItem
          control={<Switch defaultChecked />}
          controlPosition="end"
          selected={false}
          leading={<NotificationsRounded />}
          supportingText="Sounds, badges and banners"
        >
          Notifications
        </ListItem>
        <ListItem
          control={<Switch icons />}
          controlPosition="end"
          selected={false}
          leading={<DarkModeRounded />}
        >
          Dark theme
        </ListItem>
        <ListItem
          control={<Switch />}
          controlPosition="end"
          selected={false}
          disabled
          leading={<LocationOnRounded />}
          supportingText="Managed by your organization"
        >
          Location
        </ListItem>
      </List>
      <List aria-label="Selected switch rows">
        <ListItem control={<Switch defaultChecked />} controlPosition="end">
          Selected while on (MD3 default)
        </ListItem>
      </List>
    </div>
  ),
};

/**
 * A **listbox** (MD3 web: `role="listbox"` of `option`s) — single select.
 * Two cues mark the selection (MD3: not color alone): the selected
 * container + a leading check. Type a letter to jump (typeahead).
 */
export const SingleSelectListbox: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("Berlin");
    const cities = [
      "Amsterdam",
      "Berlin",
      "Copenhagen",
      "Dublin",
      "Edinburgh",
      "Florence",
    ];
    return (
      <List
        aria-label="Choose a city"
        selectionMode="single"
        value={value}
        onValueChange={setValue}
        variant="segmented"
      >
        {cities.map((city) => (
          <ListItem
            key={city}
            value={city}
            leading={value === city ? <CheckRounded /> : <LanguageRounded />}
          >
            {city}
          </ListItem>
        ))}
      </List>
    );
  },
};

/**
 * Multi-select listbox with decorative checkboxes kept in sync with the
 * selection. Shift + ↑ / ↓ extend, Ctrl / ⌘ + A selects all, and `name`
 * submits the values with a form.
 */
export const MultiSelectListbox: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["Photos"]);
    return (
      <div className="gap-3 grid">
        <List
          aria-label="Folders to back up"
          selectionMode="multiple"
          value={value}
          onValueChange={setValue}
          name="folders"
        >
          {["Documents", "Downloads", "Music", "Photos", "Videos"].map(
            (folder) => (
              <ListItem
                key={folder}
                value={folder}
                control={<Checkbox />}
                leading={<FolderRounded />}
                disabled={folder === "Music"}
              >
                {folder}
              </ListItem>
            ),
          )}
        </List>
        <p className="px-4 text-body-small text-on-surface-variant">
          Selected: {value.join(", ") || "none"}
        </p>
      </div>
    );
  },
};

/**
 * MD3 Expressive **expand & collapse**, over native `<details>` (zero JS).
 * The chevron sits in a `corner-full` container (`surface` → `surface-
 * container`) and turns over; the children spring open; in a segmented list
 * the outer corners continue through them.
 */
export const ExpandAndCollapse: Story = {
  render: () => (
    <div className="gap-8 grid">
      <List variant="segmented" aria-label="Storage">
        <ListItem leading={<ImageRounded />} trailingSupportingText="2.4 GB">
          Photos
        </ListItem>
        <ListItemExpandable
          headline="Apps"
          supportingText="12 apps"
          leading={<FolderRounded />}
          defaultOpen
        >
          {["Mail", "Maps", "Music"].map((app) => (
            <ListItem key={app} control={<Checkbox />} controlPosition="end">
              {app}
            </ListItem>
          ))}
        </ListItemExpandable>
        <ListItemExpandable headline="System" leading={<SettingsRounded />}>
          <ListItem>Cache</ListItem>
          <ListItem>Logs</ListItem>
        </ListItemExpandable>
      </List>
      <List aria-label="Standard expandable">
        <ListItemExpandable headline="Recent" leading={<MailRounded />}>
          <ListItem onClick={() => {}} leading={<SendRounded />}>
            Sent
          </ListItem>
          <ListItem onClick={() => {}} leading={<DeleteRounded />}>
            Trash
          </ListItem>
        </ListItemExpandable>
      </List>
    </div>
  ),
};

/**
 * **Drag to reorder** — drag a handle, or focus it and press Space to pick
 * the row up, ↑ / ↓ to move, Space to drop, Escape to cancel (Alt + ↑ / ↓
 * moves any focused row). The dragged row turns `tertiary-container` at
 * elevation 4 over a `surface-container-low` drop zone; each step is
 * announced.
 */
export const Reorder: Story = {
  render: () => {
    const [items, setItems] = useState([
      "Wake up",
      "Make coffee",
      "Write the list component",
      "Ship it",
      "Celebrate",
    ]);
    return (
      <List
        variant="segmented"
        reorderable
        aria-label="Today"
        onReorder={({ from, to }) =>
          setItems((list) => {
            const next = [...list];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved!);
            return next;
          })
        }
      >
        {items.map((item, index) => (
          <ListItem
            key={item}
            value={item}
            leading={<ListItemDragHandle label={`Reorder ${item}`} />}
            supportingText={`Step ${index + 1}`}
          >
            {item}
          </ListItem>
        ))}
      </List>
    );
  },
};

/** Badges in the trailing slot, on a leading icon, and inline in the text. */
export const Badges: Story = {
  render: () => (
    <List aria-label="Mailboxes" variant="segmented">
      <ListItem
        onClick={() => {}}
        leading={<MailRounded />}
        trailing={<Badge value={24} />}
      >
        Inbox
      </ListItem>
      <ListItem
        onClick={() => {}}
        leading={
          <Badge>
            <ListItemIcon>
              <NotificationsRounded />
            </ListItemIcon>
          </Badge>
        }
      >
        Updates
      </ListItem>
      <ListItem
        onClick={() => {}}
        leading={<StarRounded />}
        trailing={<Badge value={1200} max={999} color="primary" />}
      >
        Starred
      </ListItem>
    </List>
  ),
};

/**
 * Dividers: `dividers` draws one between every row (16dp insets); a
 * `ListDivider` (the `Divider` as an `<li>`) separates groups. MD3: use
 * dividers in uncontained (standard) lists.
 */
export const Dividers: Story = {
  render: () => (
    <div className="gap-8 grid">
      <List dividers aria-label="With dividers">
        {people.map(([name, text]) => (
          <ListItem key={name} supportingText={text}>
            {name}
          </ListItem>
        ))}
      </List>
      <List aria-label="Grouped">
        <ListItem leading={<SendRounded />}>Sent</ListItem>
        <ListItem leading={<MailRounded />}>Drafts</ListItem>
        <ListDivider inset="none" />
        <ListItem leading={<DeleteRounded />}>Trash</ListItem>
      </List>
    </div>
  ),
};

/**
 * Every MD3 state, standard and segmented: enabled, selected, disabled,
 * selected + disabled, dragged. Hover, focus (3dp inward ring) and press to
 * see the 4 → 12 → 16dp shape morph.
 */
export const States: Story = {
  render: () => {
    const rows = (
      <>
        <ListItem
          onClick={() => {}}
          leading={<PersonRounded />}
          supportingText="Supporting line"
        >
          Enabled
        </ListItem>
        <ListItem
          onClick={() => {}}
          selected
          leading={<PersonRounded />}
          supportingText="Supporting line"
        >
          Selected
        </ListItem>
        <ListItem
          onClick={() => {}}
          disabled
          leading={<PersonRounded />}
          supportingText="Supporting line"
        >
          Disabled
        </ListItem>
        <ListItem
          onClick={() => {}}
          disabled
          selected
          leading={<PersonRounded />}
          supportingText="Supporting line"
        >
          Selected + disabled
        </ListItem>
        <ListItem
          dragged
          leading={<PersonRounded />}
          supportingText="Supporting line"
        >
          Dragged
        </ListItem>
      </>
    );
    return (
      <div className="gap-8 grid">
        <Column title="Standard">
          <List aria-label="Standard states">{rows}</List>
        </Column>
        <Column title="Segmented">
          <List variant="segmented" aria-label="Segmented states">
            {rows}
          </List>
        </Column>
      </div>
    );
  },
};

/** MD3 density: each step takes 4dp off every row. */
export const Density: Story = {
  render: () => (
    <div className="gap-6 grid">
      {([0, -1, -2, -3] as const).map((density) => (
        <Column key={density} title={`Density ${density}`}>
          <List
            density={density}
            variant="segmented"
            aria-label={`Density ${density}`}
          >
            <ListItem onClick={() => {}} leading={<StarRounded />}>
              One line
            </ListItem>
            <ListItem
              onClick={() => {}}
              leading={<StarRounded />}
              supportingText="Two lines"
            >
              Headline
            </ListItem>
          </List>
        </Column>
      ))}
    </div>
  ),
};

/**
 * Text that wraps or truncates (MD3: keep supporting text to one to three
 * lines). `headlineLines` / `supportingTextLines` clamp with an ellipsis.
 */
export const TextClamping: Story = {
  render: () => {
    const long =
      "Supporting text that keeps going well past the width of the row, so you can see how it wraps or truncates at the configured number of lines.";
    return (
      <List variant="segmented" aria-label="Clamping">
        <ListItem supportingText={long}>Wraps freely</ListItem>
        <ListItem supportingText={long} supportingTextLines={1}>
          One line
        </ListItem>
        <ListItem
          supportingText={long}
          supportingTextLines={2}
          leading={<ListItemAvatar>B</ListItemAvatar>}
        >
          Two lines (three-line row, top-aligned)
        </ListItem>
        <ListItem
          headlineLines={1}
          supportingText="Headline clamped to one line"
        >
          A remarkably long headline that would otherwise wrap onto a second
          line
        </ListItem>
      </List>
    );
  },
};

/**
 * Lists inside a form: native checkboxes and a listbox with `name` /
 * `required` submit together — no glue code.
 */
export const NativeForm: Story = {
  render: () => {
    const [result, setResult] = useState("");
    return (
      <form
        className="gap-4 grid"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setResult(
            JSON.stringify({
              notify: data.getAll("notify"),
              size: data.getAll("size"),
            }),
          );
        }}
      >
        <List variant="segmented" aria-label="Notify me about">
          <ListItem
            control={<Checkbox name="notify" value="replies" defaultChecked />}
          >
            Replies
          </ListItem>
          <ListItem control={<Checkbox name="notify" value="mentions" />}>
            Mentions
          </ListItem>
        </List>
        <List
          aria-label="Size (required)"
          selectionMode="single"
          name="size"
          required
          variant="segmented"
        >
          {["Small", "Medium", "Large"].map((size) => (
            <ListItem key={size} value={size}>
              {size}
            </ListItem>
          ))}
        </List>
        <Button type="submit" className="justify-self-start">
          Submit
        </Button>
        <output className="text-body-small text-on-surface-variant">
          {result}
        </output>
      </form>
    );
  },
};

/**
 * Theming: every role is a `--md-comp-list-*` token (or the global
 * `--md-sys-*` roles). Here: tertiary selection, extra-round corners and a
 * bright segmented fill.
 */
export const Theming: Story = {
  render: () => (
    <List
      variant="segmented"
      aria-label="Themed"
      className="[--md-comp-list-container-shape:1.75rem] [--md-comp-list-item-container-shape:0.5rem] [--md-comp-list-item-segmented-container-color:var(--md-sys-color-surface-bright)] [--md-comp-list-item-selected-container-color:var(--md-sys-color-tertiary-container)] [--md-comp-list-item-selected-content-color:var(--md-sys-color-on-tertiary-container)]"
    >
      <ListItem onClick={() => {}} leading={<StarRounded />}>
        First
      </ListItem>
      <ListItem onClick={() => {}} selected leading={<StarRounded />}>
        Selected (tertiary)
      </ListItem>
      <ListItem onClick={() => {}} leading={<StarRounded />}>
        Last
      </ListItem>
    </List>
  ),
};
