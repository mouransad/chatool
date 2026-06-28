import type { Meta, StoryObj } from "@storybook/react-vite";
import Fab from "@chatool/ui/fab";
import AddOutlined from "@chatool/icons/AddOutlined";
import EditOutlined from "@chatool/icons/EditOutlined";

const meta = {
  title: "UI/Fab",
  component: Fab,
  tags: ["autodocs"],
  args: { "aria-label": "Add", children: <AddOutlined /> },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "surface"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    extended: { control: "boolean" },
    lowered: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colors: Story = {
  render: (args) => (
    <div className="gap-4 flex flex-wrap items-center">
      {(["primary", "secondary", "tertiary", "surface"] as const).map(
        (color) => (
          <Fab
            key={color}
            {...args}
            color={color}
            aria-label={`Add ${color}`}
          />
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="gap-4 flex flex-wrap items-center">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Fab key={size} {...args} size={size} aria-label={`Add ${size}`} />
      ))}
    </div>
  ),
};

export const Extended: Story = {
  args: {
    extended: true,
    children: (
      <>
        <EditOutlined />
        Compose
      </>
    ),
  },
};

export const Lowered: Story = { args: { lowered: true } };
