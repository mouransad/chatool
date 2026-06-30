import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@chatool/ui/button";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import FavoriteFilled from "@chatool/icons/FavoriteFilled";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "tonal", "elevated", "outlined", "text"],
    },
    size: { control: "select", options: ["xs", "s", "m", "l", "xl"] },
    shape: { control: "inline-radio", options: ["round", "square"] },
    selected: { control: "boolean" },
    loading: { control: "boolean" },
    asChild: { table: { disable: true } },
    selectedIcon: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak every prop live from the controls panel. */
export const Playground: Story = {};

/** The five MD3 styles — color is fixed per style (no color prop). */
export const Variants: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {(["filled", "tonal", "elevated", "outlined", "text"] as const).map(
        (variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {(["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

/** Round (pill) and square; both morph their corners while pressed. */
export const Shapes: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      <Button {...args} shape="round">
        Round
      </Button>
      <Button {...args} shape="square">
        Square
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    startIcon: <CheckOutlined />,
    endIcon: <ArrowForwardOutlined />,
    children: "Continue",
  },
};

/** Icon-only buttons have no text content, so they **must** pass `aria-label`. */
export const IconOnly: Story = {
  render: (args) => (
    <Button
      variant={args.variant}
      size={args.size}
      shape={args.shape}
      aria-label="Add to favorites"
      startIcon={<CheckOutlined />}
    />
  ),
};

export const Loading: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      <Button {...args} loading loadingPosition="start">
        Start
      </Button>
      <Button {...args} loading loadingPosition="center">
        Center
      </Button>
      <Button {...args} loading loadingPosition="end">
        End
      </Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * Toggle (`selected`) reflects `aria-pressed`; a **round** button morphs to
 * square while selected, `outlined` fills with inverse-surface, and `selectedIcon`
 * swaps the leading glyph. Keep the label constant across the toggle (per the APG).
 */
export const Toggle: Story = {
  render: (args) => {
    const Demo = ({ variant }: { variant: typeof args.variant }) => {
      const [on, setOn] = useState(false);
      return (
        <Button
          {...args}
          variant={variant}
          startIcon={<FavoriteOutlined />}
          selectedIcon={<FavoriteFilled />}
          selected={on}
          onClick={() => setOn((v) => !v)}
        >
          Favorite
        </Button>
      );
    };
    return (
      <div className="gap-3 flex flex-wrap items-center">
        {(["filled", "tonal", "elevated", "outlined", "text"] as const).map(
          (v) => (
            <Demo key={v} variant={v} />
          ),
        )}
      </div>
    );
  },
};

/** `asChild` renders the styles onto the child element (here an anchor). */
export const AsChild: Story = {
  args: { asChild: true, children: <a href="#">Link button</a> },
};
