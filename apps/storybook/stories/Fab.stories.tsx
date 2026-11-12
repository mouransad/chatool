import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Fab, { type FabColor, type FabSize } from "@chatool/ui/fab";
import Tooltip from "@chatool/ui/tooltip";
import Button from "@chatool/ui/button";
import EditFilled from "@chatool/icons/EditFilled";
import AddFilled from "@chatool/icons/AddFilled";
import SendFilled from "@chatool/icons/SendFilled";
import ChatFilled from "@chatool/icons/ChatFilled";

const SIZES: FabSize[] = ["small", "medium", "large"];
const COLORS: FabColor[] = [
  "primary-container",
  "secondary-container",
  "tertiary-container",
  "primary",
  "secondary",
  "tertiary",
];

const meta = {
  title: "UI/Fab",
  component: Fab,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "MD3 Expressive **FAB** and **extended FAB** in one element. `icon` alone is a FAB (add an `aria-label`); add a `label` for an extended FAB; `expanded={false}` springs it back into a FAB. Use one per screen, for the primary constructive action.",
      },
    },
  },
  args: {
    icon: <EditFilled />,
    "aria-label": "Compose",
  },
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    color: { control: "select", options: COLORS },
    elevation: {
      control: "inline-radio",
      options: ["default", "lowered", "none"],
    },
    expanded: { control: "boolean" },
    visible: { control: "boolean" },
    label: { control: "text" },
    placement: { table: { disable: true } },
    icon: { table: { disable: true } },
    asChild: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak every prop live — type a `label` to turn it into an extended FAB. */
export const Playground: Story = {};

/**
 * The three MD3 Expressive FAB sizes: 56dp (corner 16, icon 24), **80dp —
 * MD3's most recommended** (corner 20, icon 28) and 96dp (corner 28, icon 36).
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="gap-6 flex flex-wrap items-end">
      {SIZES.map((size) => (
        <Fab
          key={size}
          {...args}
          size={size}
          aria-label={`Compose (${size})`}
        />
      ))}
    </div>
  ),
};

/**
 * Extended FABs hug their icon + label: padding 16 / 26 / 28dp, icon↔label
 * 8 / 12 / 16dp, label in Title Medium / Title Large / Headline Small.
 */
export const ExtendedSizes: Story = {
  args: { label: "Compose", "aria-label": undefined },
  render: (args) => (
    <div className="gap-6 flex flex-wrap items-end">
      {SIZES.map((size) => (
        <Fab key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

/** The icon is optional on an extended FAB (it can't collapse without one). */
export const TextOnly: Story = {
  args: { label: "Create", icon: undefined, "aria-label": undefined },
};

/**
 * The six MD3 color styles. The `*-container` styles are the tonal defaults;
 * `primary` / `secondary` / `tertiary` are M3 Expressive's high-emphasis set.
 * The state layer always matches the icon color.
 */
export const Colors: Story = {
  render: (args) => (
    <div className="gap-6 grid">
      <div className="gap-4 flex flex-wrap items-center">
        {COLORS.map((color) => (
          <Fab key={color} {...args} color={color} aria-label={color} />
        ))}
      </div>
      <div className="gap-4 flex flex-wrap items-center">
        {COLORS.map((color) => (
          <Fab
            key={color}
            {...args}
            size="small"
            color={color}
            label={color}
            aria-label={undefined}
          />
        ))}
      </div>
    </div>
  ),
};

/**
 * `default` rests at elevation 3 (4 on hover), `lowered` at 1 (2 on hover) for
 * less emphasis, and `none` is flat — for a FAB nested in a bar or rail.
 */
export const Elevation: Story = {
  render: (args) => (
    <div className="gap-6 flex flex-wrap items-center">
      {(["default", "lowered", "none"] as const).map((elevation) => (
        <Fab
          key={elevation}
          {...args}
          elevation={elevation}
          label={elevation}
          aria-label={undefined}
        />
      ))}
    </div>
  ),
};

/**
 * Extended FAB ⇄ FAB. The container squares off, the icon glides to the
 * center and the label folds away on M3 Expressive's fast spatial spring
 * (0.6 / 800). The label stays the accessible name the whole time.
 */
export const ExpandCollapse: Story = {
  render: (args) => {
    const Demo = () => {
      const [expanded, setExpanded] = useState(true);
      return (
        <div className="gap-6 grid justify-items-start">
          <Button variant="tonal" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Collapse" : "Expand"}
          </Button>
          <div className="gap-6 flex flex-wrap items-center">
            {SIZES.map((size) => (
              <Fab
                key={size}
                {...args}
                size={size}
                label="Compose"
                aria-label={undefined}
                expanded={expanded}
              />
            ))}
          </div>
        </div>
      );
    };
    return <Demo />;
  },
};

/**
 * MD3: "Extended FABs can collapse into a FAB on scroll and expand on reaching
 * the bottom of the view" — scroll the panel. `placement` floats the FAB at
 * the trailing corner with 16dp margins (the `transform` on the frame makes it
 * the containing block, standing in for the viewport).
 */
export const CollapseOnScroll: Story = {
  parameters: { layout: "padded" },
  render: (args) => {
    const Demo = () => {
      const scroller = useRef<HTMLDivElement>(null);
      const [expanded, setExpanded] = useState(true);
      useEffect(() => {
        const el = scroller.current;
        if (!el) return;
        let last = el.scrollTop;
        const onScroll = () => {
          const top = el.scrollTop;
          const atEnd = top + el.clientHeight >= el.scrollHeight - 8;
          if (atEnd || top < last) setExpanded(true);
          else if (top > last + 4) setExpanded(false);
          last = top;
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
      }, []);
      return (
        <div className="max-w-sm relative h-[28rem] w-full [transform:translateZ(0)] overflow-hidden rounded-xl bg-surface-container-low">
          <div ref={scroller} className="p-4 gap-3 grid h-full overflow-y-auto">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-surface-container-highest text-body-large text-on-surface"
              >
                Message {i + 1}
              </div>
            ))}
          </div>
          <Fab
            {...args}
            size="small"
            label="Compose"
            aria-label={undefined}
            expanded={expanded}
            placement="bottom-end"
          />
        </div>
      );
    };
    return <Demo />;
  },
};

/**
 * Per–window-class props, resolved in CSS media queries (works in Server
 * Components). Resize the canvas: a medium FAB on compact / medium windows
 * becomes a large **extended** FAB from the expanded class (≥ 840px) up —
 * MD3's "FAB can transform into an extended FAB on larger screens".
 */
export const Responsive: Story = {
  args: { label: "Compose", "aria-label": undefined },
  render: (args) => (
    <Fab
      {...args}
      size={{ compact: "medium", expanded: "large" }}
      expanded={{ compact: false, expanded: true }}
    />
  ),
};

/**
 * `visible={false}` shrinks the FAB toward its center and fades it out (and
 * makes it `inert`). MD3: hide the FAB while content changes (e.g. switching
 * tabs) or when its action isn't available — don't disable it. Remounting it
 * (a new `key`) replays the entrance.
 */
export const ShowHide: Story = {
  render: (args) => {
    const Demo = () => {
      const [visible, setVisible] = useState(true);
      const [tab, setTab] = useState(0);
      return (
        <div className="gap-6 grid justify-items-start">
          <div className="gap-2 flex">
            <Button variant="tonal" onClick={() => setVisible((v) => !v)}>
              {visible ? "Hide" : "Show"}
            </Button>
            <Button variant="outlined" onClick={() => setTab((t) => t + 1)}>
              Switch tab (replay entrance)
            </Button>
          </div>
          <Fab key={tab} {...args} visible={visible} />
        </div>
      );
    };
    return <Demo />;
  },
};

/**
 * MD3: an icon-only FAB on the web should show a tooltip with its label on
 * hover and focus. With `relationship="label"` the tooltip also *is* the
 * accessible name, so no separate `aria-label` is needed.
 */
export const WithTooltip: Story = {
  // Pass only what the FAB needs: an explicit `aria-label` (even `undefined`)
  // on the anchor would override the name the tooltip gives it.
  render: ({ icon, size, color, elevation }) => (
    <Tooltip content="Compose" relationship="label">
      <Fab icon={icon} size={size} color={color} elevation={elevation} />
    </Tooltip>
  ),
};

/** `asChild` renders the FAB onto a link (e.g. your router's `<Link>`). */
export const AsLink: Story = {
  args: { "aria-label": undefined },
  render: (args) => (
    <Fab {...args} asChild icon={<AddFilled />} label="New chat">
      <a href="#new-chat" />
    </Fab>
  ),
};

/**
 * Accessibility: the icon is decorative, so an icon-only FAB needs an
 * `aria-label` that describes the action ("Start a new chat"). An extended
 * FAB is named by its label; per MD3, any `aria-label` must start with the
 * visible label's first word.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="gap-6 flex flex-wrap items-center">
      <Fab icon={<ChatFilled />} aria-label="Start a new chat" />
      <Fab icon={<SendFilled />} label="Send" />
    </div>
  ),
};
