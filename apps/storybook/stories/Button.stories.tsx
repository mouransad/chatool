import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@chatool/ui/button";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";

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
    loading: { control: "boolean" },
    asChild: { table: { disable: true } },
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

/** `asChild` renders the styles onto the child element (here an anchor). */
export const AsChild: Story = {
  args: { asChild: true, children: <a href="#">Link button</a> },
};
