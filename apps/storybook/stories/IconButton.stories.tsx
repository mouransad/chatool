import type { Meta, StoryObj } from "@storybook/react-vite";
import IconButton from "@chatool/ui/icon-button";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import EditOutlined from "@chatool/icons/EditOutlined";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { "aria-label": "Edit", children: <EditOutlined /> },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "filled", "tonal", "outlined"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "error"],
    },
    size: { control: "select", options: ["xs", "s", "m", "l", "xl"] },
    width: { control: "inline-radio", options: ["narrow", "default", "wide"] },
    shape: { control: "inline-radio", options: ["round", "square"] },
    loading: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {(["standard", "filled", "tonal", "outlined"] as const).map((variant) => (
        <IconButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {(["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <IconButton key={size} {...args} variant="tonal" size={size} />
      ))}
    </div>
  ),
};

/** A toggle icon button: selected takes the filled look and morphs to square. */
export const Toggle: Story = {
  args: {
    "aria-label": "Favorite",
    children: <FavoriteOutlined />,
    variant: "outlined",
    defaultSelected: true,
  },
};

export const Loading: Story = { args: { loading: true, variant: "filled" } };

export const Disabled: Story = { args: { disabled: true, variant: "filled" } };
