import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@chatool/ui/button";
import CheckOutlined from "@chatool/icons/CheckOutlined";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak `variant` / `size` live from the controls panel. */
export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {(
        [
          "default",
          "secondary",
          "destructive",
          "outline",
          "ghost",
          "link",
        ] as const
      ).map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="gap-3 flex items-center">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="icon" aria-label="Confirm">
        <CheckOutlined />
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CheckOutlined />
        Confirm
      </>
    ),
  },
};

export const Disabled: Story = { args: { disabled: true } };

/** `asChild` renders the styles onto the child element (here an anchor). */
export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#">Link button</a>,
  },
};
