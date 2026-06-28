import type { Meta, StoryObj } from "@storybook/react-vite";
import ButtonGroup from "@chatool/ui/button-group";
import Button from "@chatool/ui/button";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["standard", "connected"] },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    buttonVariant: {
      control: "select",
      options: ["filled", "tonal", "elevated", "outlined", "text"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "error"],
    },
    size: { control: "select", options: ["xs", "s", "m", "l", "xl"] },
  },
  args: { buttonVariant: "outlined" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Buttons inherit `buttonVariant` / `color` / `size` from the group. */
export const Standard: Story = { args: { variant: "standard" } };

/** Connected: one segmented surface (outer corners round, inner square). */
export const Connected: Story = { args: { variant: "connected" } };

export const Vertical: Story = {
  args: { variant: "connected", orientation: "vertical" },
};
