import type { Meta, StoryObj } from "@storybook/react-vite";
import ToggleButtonGroup, {
  ToggleButtonGroupItem,
} from "@chatool/ui/toggle-button-group";

const meta = {
  title: "UI/ToggleButtonGroup",
  component: ToggleButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "error"],
    },
    size: { control: "select", options: ["xs", "s", "m", "l", "xl"] },
  },
} satisfies Meta<typeof ToggleButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single select — exactly one segment active (segmented-button behavior). */
export const Single: Story = {
  args: { type: "single", defaultValue: "week", color: "primary" },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButtonGroupItem value="day">Day</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="week">Week</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="month">Month</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ),
};

/** Multi select — any number of segments active; selected items show a check. */
export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["bold"], color: "secondary" },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButtonGroupItem value="bold">Bold</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="italic">Italic</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="underline">Underline</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ),
};
