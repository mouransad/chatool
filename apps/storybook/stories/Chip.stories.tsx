import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Chip from "@chatool/ui/chip";
import CalendarTodayOutlined from "@chatool/icons/CalendarTodayOutlined";
import LocationOnOutlined from "@chatool/icons/LocationOnOutlined";
import ShareOutlined from "@chatool/icons/ShareOutlined";
import StarOutlined from "@chatool/icons/StarOutlined";
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";
import ScheduleOutlined from "@chatool/icons/ScheduleOutlined";
import PersonOutlined from "@chatool/icons/PersonOutlined";
import MailOutlined from "@chatool/icons/MailOutlined";
import OpenInNewOutlined from "@chatool/icons/OpenInNewOutlined";
import CheckCircleOutlined from "@chatool/icons/CheckCircleOutlined";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "Add to calendar", variant: "assist" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["assist", "filter", "input", "suggestion"],
    },
    children: { control: "text" },
    elevated: { control: "boolean" },
    expressive: { control: "boolean" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    softDisabled: { control: "boolean" },
    loading: { control: "boolean" },
    dragged: { control: "boolean" },
    removable: { control: "boolean" },
    removeOnly: { control: "boolean" },
    removeLabel: { control: "text" },
    href: { control: "text" },
    icon: { table: { disable: true } },
    avatar: { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
    selectedIcon: { table: { disable: true } },
    removeIcon: { table: { disable: true } },
    actionClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-2 flex flex-wrap items-center">{children}</div>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-label-medium text-on-surface-variant">{children}</p>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-6 flex flex-col">{children}</div>
);

/** A 24dp avatar: initials on a tonal circle (or pass an `<img>`). */
const Initials = ({ children }: { children: string }) => (
  <span className="font-medium flex size-full items-center justify-center bg-tertiary-container text-[0.625rem] text-on-tertiary-container">
    {children}
  </span>
);

/**
 * Every prop. Switch `variant`, toggle `selected` on a filter chip and watch
 * the M3 Expressive morph: the 12dp corners round into a pill and the
 * checkmark is revealed from the start edge on the fast-spatial spring. Press
 * and hold any chip: the corners tighten to 8dp.
 */
export const Playground: Story = {
  args: { icon: <CalendarTodayOutlined /> },
};

/**
 * **Assist chips** — smart, contextual actions (start with a verb). Flat by
 * default; `elevated` for chips over images or busy backgrounds. The leading
 * icon is `primary`.
 */
export const Assist: Story = {
  render: () => (
    <Stack>
      <div>
        <Caption>Flat</Caption>
        <Row>
          <Chip icon={<CalendarTodayOutlined />}>Add to calendar</Chip>
          <Chip icon={<LocationOnOutlined />}>Directions</Chip>
          <Chip icon={<ShareOutlined />}>Share</Chip>
          <Chip>No icon</Chip>
        </Row>
      </div>
      <div>
        <Caption>Elevated</Caption>
        <Row>
          <Chip elevated icon={<CalendarTodayOutlined />}>
            Add to calendar
          </Chip>
          <Chip elevated icon={<LocationOnOutlined />}>
            Directions
          </Chip>
          <Chip elevated>No icon</Chip>
        </Row>
      </div>
    </Stack>
  ),
};

const FilterDemo = () => {
  const [picked, setPicked] = useState<string[]>(["Ramen"]);
  const toggle = (name: string) =>
    setPicked((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  return (
    <Row>
      {["Ramen", "Pizza", "Tacos", "Curry", "Dumplings"].map((name) => (
        <Chip
          key={name}
          variant="filter"
          selected={picked.includes(name)}
          onClick={() => toggle(name)}
        >
          {name}
        </Chip>
      ))}
    </Row>
  );
};

/**
 * **Filter chips** — tags that filter a collection. Selecting one fills it
 * with `secondary-container`, rounds it into a pill (Expressive) and reveals a
 * leading checkmark; a chip with its own icon **swaps** the icon for the
 * check. `trailingIcon` adds a menu arrow; `selectedIcon={false}` changes
 * color only. `aria-pressed` carries the state to assistive tech.
 */
export const Filter: Story = {
  render: () => (
    <Stack>
      <div>
        <Caption>Controlled (`selected` + `onClick`)</Caption>
        <FilterDemo />
      </div>
      <div>
        <Caption>
          Uncontrolled (`defaultSelected`), icon ⇄ checkmark swap
        </Caption>
        <Row>
          <Chip variant="filter" icon={<StarOutlined />} defaultSelected>
            Top rated
          </Chip>
          <Chip variant="filter" icon={<ScheduleOutlined />}>
            Open now
          </Chip>
          <Chip variant="filter" elevated defaultSelected>
            Elevated
          </Chip>
          <Chip variant="filter" selectedIcon={false} defaultSelected>
            No checkmark
          </Chip>
        </Row>
      </div>
      <div>
        <Caption>Menu arrow and remove action</Caption>
        <Row>
          <Chip variant="filter" trailingIcon={<KeyboardArrowDownOutlined />}>
            Cuisine
          </Chip>
          <Chip
            variant="filter"
            defaultSelected
            trailingIcon={<KeyboardArrowDownOutlined />}
          >
            Price
          </Chip>
          <Chip variant="filter" defaultSelected removable>
            Removable
          </Chip>
        </Row>
      </div>
    </Stack>
  ),
};

const InputDemo = () => {
  const [people, setPeople] = useState([
    "Ada Lovelace",
    "Alan Turing",
    "Grace Hopper",
    "Linus Torvalds",
  ]);
  return (
    <Row>
      {people.map((name) => (
        <Chip
          key={name}
          variant="input"
          avatar={
            <Initials>
              {name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </Initials>
          }
          onRemove={() =>
            setPeople((current) => current.filter((item) => item !== name))
          }
        >
          {name}
        </Chip>
      ))}
      {people.length === 0 ? (
        <button
          type="button"
          className="text-label-large text-primary"
          onClick={() =>
            setPeople(["Ada Lovelace", "Alan Turing", "Grace Hopper"])
          }
        >
          Reset
        </button>
      ) : null}
    </Row>
  );
};

/**
 * **Input chips** — pieces of information a person entered (contacts, tags).
 * The remove action is a separate button ("Remove {label}", 48dp target): Tab
 * to a chip, then → reaches its remove button, and Backspace / Delete removes
 * the focused chip — focus moves on to the next chip. `removeOnly` makes the
 * whole chip one remove button.
 */
export const Input: Story = {
  render: () => (
    <Stack>
      <div>
        <Caption>Avatars + remove (try Backspace)</Caption>
        <InputDemo />
      </div>
      <div>
        <Caption>Icon, selected, remove-only, no trailing</Caption>
        <Row>
          <Chip variant="input" icon={<MailOutlined />} removable>
            hello@example.com
          </Chip>
          <Chip
            variant="input"
            icon={<PersonOutlined />}
            defaultSelected
            removable
          >
            Selected
          </Chip>
          <Chip variant="input" removeOnly>
            Remove only
          </Chip>
          <Chip variant="input">Plain</Chip>
        </Row>
      </div>
    </Stack>
  ),
};

/**
 * **Suggestion chips** — dynamically generated suggestions, like quick replies.
 */
export const Suggestion: Story = {
  render: () => (
    <Row>
      <Chip variant="suggestion">Sounds good!</Chip>
      <Chip variant="suggestion">On my way</Chip>
      <Chip variant="suggestion" icon={<CheckCircleOutlined />}>
        Confirm
      </Chip>
      <Chip variant="suggestion" elevated>
        Elevated
      </Chip>
    </Row>
  ),
};

/**
 * Every state MD3 defines: enabled, disabled (38% label, 12% outline / fill),
 * **soft-disabled** (same look but still focusable), dragged (level 4 + 16%
 * layer) and loading (assist chips "can show progress"). Hover, focus and
 * press the enabled ones.
 */
export const States: Story = {
  render: () => (
    <div className="gap-x-6 gap-y-3 grid grid-cols-[auto_repeat(4,auto)] items-center justify-start justify-items-start">
      <span />
      <Caption>Assist</Caption>
      <Caption>Filter</Caption>
      <Caption>Filter (selected)</Caption>
      <Caption>Input</Caption>
      {(
        [
          ["Enabled", {}],
          ["Disabled", { disabled: true }],
          ["Soft-disabled", { softDisabled: true }],
          ["Dragged", { dragged: true }],
        ] as const
      ).map(([name, state]) => (
        <div key={name} className="contents">
          <Caption>{name}</Caption>
          <Chip icon={<CalendarTodayOutlined />} {...state}>
            Assist
          </Chip>
          <Chip variant="filter" {...state}>
            Filter
          </Chip>
          <Chip variant="filter" defaultSelected {...state}>
            Filter
          </Chip>
          <Chip variant="input" removable {...state}>
            Input
          </Chip>
        </div>
      ))}
      <Caption>Loading</Caption>
      <Chip loading icon={<CalendarTodayOutlined />}>
        Saving…
      </Chip>
      <Chip loading>Saving…</Chip>
    </div>
  ),
};

/**
 * **Expressive** (default) vs the **baseline** spec (`expressive={false}`).
 * Expressive: 12dp rest → full pill when selected → 8dp pressed, a 4dp icon ⇄
 * label gap, a tonal (`on-surface-variant`) unselected filter icon. Baseline:
 * a static 8dp corner, 8dp gaps, a `primary` icon.
 */
export const ExpressiveVsBaseline: Story = {
  render: () => (
    <Stack>
      {[true, false].map((expressive) => (
        <div key={String(expressive)}>
          <Caption>{expressive ? "Expressive" : "Baseline"}</Caption>
          <Row>
            <Chip variant="filter" expressive={expressive}>
              Unselected
            </Chip>
            <Chip variant="filter" expressive={expressive} defaultSelected>
              Selected
            </Chip>
            <Chip
              variant="filter"
              expressive={expressive}
              icon={<StarOutlined />}
            >
              With icon
            </Chip>
            <Chip
              variant="input"
              expressive={expressive}
              avatar={<Initials>MS</Initials>}
              removable
            >
              Input
            </Chip>
            <Chip expressive={expressive} icon={<CalendarTodayOutlined />}>
              Assist
            </Chip>
          </Row>
        </div>
      ))}
    </Stack>
  ),
};

/**
 * Link chips: `href` renders an `<a>`, `asChild` puts the chip on your own
 * element (e.g. Next's `<Link>`), keeping its text as the label.
 */
export const Links: Story = {
  render: () => (
    <Row>
      <Chip
        href="https://m3.material.io/components/chips"
        target="_blank"
        rel="noreferrer"
        icon={<OpenInNewOutlined />}
      >
        MD3 chips
      </Chip>
      <Chip variant="suggestion" asChild>
        <a href="#chips">Jump to chips</a>
      </Chip>
    </Row>
  ),
};

/**
 * Re-theme with `--md-comp-chip-*` tokens (on the chip, or any ancestor). Here:
 * MD3's accessibility advice to use `outline` instead of `outline-variant` for
 * a 3:1 boundary, a tertiary selected fill, and a fully round shape.
 */
export const Customization: Story = {
  render: () => (
    <Row>
      <Chip
        variant="filter"
        style={
          {
            "--md-comp-chip-outline-color": "var(--md-sys-color-outline)",
          } as React.CSSProperties
        }
      >
        Strong outline
      </Chip>
      <Chip
        variant="filter"
        defaultSelected
        style={
          {
            "--md-comp-chip-selected-container-color":
              "var(--md-sys-color-tertiary-container)",
            "--md-comp-chip-selected-label-text-color":
              "var(--md-sys-color-on-tertiary-container)",
            "--md-comp-chip-selected-leading-icon-color":
              "var(--md-sys-color-on-tertiary-container)",
          } as React.CSSProperties
        }
      >
        Tertiary
      </Chip>
      <Chip
        style={
          {
            "--md-comp-chip-container-shape": "1rem",
          } as React.CSSProperties
        }
        icon={<CalendarTodayOutlined />}
      >
        Round
      </Chip>
    </Row>
  ),
};

/**
 * Accessibility: each chip is a native `<button>` named by its label; icons
 * and avatars are hidden from assistive tech. The remove action reads "Remove
 * {label}" by default — pass `removeLabel` with a full localized phrase.
 */
export const Accessibility: Story = {
  render: () => (
    <Row>
      <Chip variant="input" removable>
        Default remove name
      </Chip>
      <Chip variant="input" removable removeLabel="Quitar Madrid">
        Madrid
      </Chip>
    </Row>
  ),
};
