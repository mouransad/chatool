import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ButtonGroup from "@chatool/ui/button-group";
import { Button } from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import ChevronLeftOutlined from "@chatool/icons/ChevronLeftOutlined";
import MenuOutlined from "@chatool/icons/MenuOutlined";
import ChevronRightOutlined from "@chatool/icons/ChevronRightOutlined";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: { "aria-label": "Text formatting" },
  argTypes: {
    variant: { control: "inline-radio", options: ["standard", "connected"] },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    asChild: { table: { disable: true } },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak `variant` / `orientation` live from the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="tonal">One</Button>
      <Button variant="tonal">Two</Button>
      <Button variant="tonal">Three</Button>
    </ButtonGroup>
  ),
};

/** Standard — the family gap; each child keeps its own pill shape. */
export const Standard: Story = {
  render: (args) => (
    <ButtonGroup {...args} variant="standard">
      <Button variant="filled">Save</Button>
      <Button variant="tonal">Duplicate</Button>
      <Button variant="outlined">Delete</Button>
    </ButtonGroup>
  ),
};

/** Connected — tight 2dp gap; children share one segmented track. */
export const Connected: Story = {
  render: (args) => (
    <ButtonGroup {...args} variant="connected">
      <Button variant="tonal">Day</Button>
      <Button variant="tonal">Week</Button>
      <Button variant="tonal">Month</Button>
    </ButtonGroup>
  ),
};

/** Vertical orientation (works for both variants). */
export const Vertical: Story = {
  render: (args) => (
    <ButtonGroup {...args} variant="connected" orientation="vertical">
      <Button variant="tonal">Top</Button>
      <Button variant="tonal">Middle</Button>
      <Button variant="tonal">Bottom</Button>
    </ButtonGroup>
  ),
};

/** Composes `IconButton` children too — pass the group an `aria-label`. */
export const WithIconButtons: Story = {
  render: (args) => (
    <ButtonGroup {...args} variant="connected" aria-label="Navigation">
      <IconButton variant="tonal" aria-label="Previous">
        <ChevronLeftOutlined />
      </IconButton>
      <IconButton variant="tonal" aria-label="Menu">
        <MenuOutlined />
      </IconButton>
      <IconButton variant="tonal" aria-label="Next">
        <ChevronRightOutlined />
      </IconButton>
    </ButtonGroup>
  ),
};

/**
 * Single-select segmented control: the children are toggle buttons (`selected` /
 * `aria-pressed`); the group only lays them out. Keep each label constant.
 */
export const SingleSelect: Story = {
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = useState("week");
      const options = ["day", "week", "month"];
      return (
        <ButtonGroup {...args} variant="connected" aria-label="Range">
          {options.map((opt) => (
            <Button
              key={opt}
              variant={value === opt ? "filled" : "tonal"}
              selected={value === opt}
              onClick={() => setValue(opt)}
            >
              {opt}
            </Button>
          ))}
        </ButtonGroup>
      );
    };
    return <Demo />;
  },
};

/** `asChild` renders the group styles + `role="group"` onto your element. */
export const AsChild: Story = {
  render: (args) => (
    <ButtonGroup {...args} asChild>
      <section aria-label="Actions">
        <Button variant="tonal">A</Button>
        <Button variant="tonal">B</Button>
      </section>
    </ButtonGroup>
  ),
};
