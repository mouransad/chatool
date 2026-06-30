import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import IconButton from "@chatool/ui/icon-button";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import FavoriteFilled from "@chatool/icons/FavoriteFilled";
import CloseOutlined from "@chatool/icons/CloseOutlined";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { "aria-label": "Favorite", children: <FavoriteOutlined /> },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "filled", "tonal", "outlined"],
    },
    size: { control: "select", options: ["xs", "s", "m", "l", "xl"] },
    shape: { control: "inline-radio", options: ["round", "square"] },
    selected: { control: "boolean" },
    loading: { control: "boolean" },
    asChild: { table: { disable: true } },
    selectedIcon: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak every prop live from the controls panel. */
export const Playground: Story = {};

/** The four MD3 styles — color is fixed per style (no color prop). */
export const Variants: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {(["standard", "filled", "tonal", "outlined"] as const).map((variant) => (
        <IconButton
          key={variant}
          {...args}
          variant={variant}
          aria-label={variant}
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {(["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <IconButton key={size} {...args} size={size} aria-label={size} />
      ))}
    </div>
  ),
};

/** Round (circle) and square; both morph their corners while pressed. */
export const Shapes: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      <IconButton {...args} shape="round" aria-label="Round" />
      <IconButton {...args} shape="square" aria-label="Square" />
    </div>
  ),
};

/**
 * Toggle (`selected`) reflects `aria-pressed`; a **round** button morphs to
 * square while selected, and `selectedIcon` swaps the glyph. Keep the
 * `aria-label` constant across the toggle (per the APG).
 */
export const Toggle: Story = {
  render: (args) => {
    const Demo = ({ variant }: { variant: typeof args.variant }) => {
      const [on, setOn] = useState(false);
      return (
        <IconButton
          {...args}
          variant={variant}
          aria-label="Add to favorites"
          selected={on}
          selectedIcon={<FavoriteFilled />}
          onClick={() => setOn((v) => !v)}
        />
      );
    };
    return (
      <div className="gap-3 flex flex-wrap items-center">
        {(["standard", "filled", "tonal", "outlined"] as const).map((v) => (
          <Demo key={v} variant={v} />
        ))}
      </div>
    );
  },
};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

/**
 * Icon buttons have no text, so an **`aria-label` is required** — without it the
 * button has no accessible name.
 */
export const AccessibleName: Story = {
  args: { "aria-label": "Close", children: <CloseOutlined /> },
};

/** `asChild` renders the styles onto the child element (here an anchor). */
export const AsChild: Story = {
  args: {
    asChild: true,
    "aria-label": "Back home",
    children: (
      <a href="#">
        <CloseOutlined />
      </a>
    ),
  },
};
