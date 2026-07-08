import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "@chatool/ui/input";
import SearchOutlined from "@chatool/icons/SearchOutlined";
import ErrorOutlined from "@chatool/icons/ErrorOutlined";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Username",
    placeholder: "Enter your username",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined"],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "s"],
    },
    error: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    asChild: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak every prop live from the controls panel. */
export const Playground: Story = {};

/** The two MD3 styles: filled (default) and outlined. */
export const Variants: Story = {
  render: (args) => (
    <div className="gap-6 max-w-sm flex flex-col">
      <Input {...args} variant="filled" label="Filled Input" />
      <Input {...args} variant="outlined" label="Outlined Input" />
    </div>
  ),
};

/** S (56dp, default) and XS (40dp, compact) sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="gap-6 max-w-sm flex flex-col">
      <Input {...args} size="s" label="Standard (S)" />
      <Input {...args} size="xs" label="Compact (XS)" />
    </div>
  ),
};

/** TextField with leading and trailing icons. */
export const WithIcons: Story = {
  args: {
    label: "Search Messages",
    placeholder: "Type keyword...",
    startIcon: <SearchOutlined />,
    variant: "outlined",
  },
};

/** TextFields showing normal helper text and error state configurations. */
export const SupportingText: Story = {
  render: (args) => (
    <div className="gap-6 max-w-sm flex flex-col">
      <Input
        {...args}
        label="Password"
        type="password"
        helperText="Must be at least 8 characters"
      />
      <Input
        {...args}
        label="Email Address"
        defaultValue="invalid-email"
        error
        errorText="Please enter a valid email address"
        endIcon={<ErrorOutlined />}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Read-only value",
    label: "Disabled Field",
  },
};

/** Renders standard text area by forwarding input classes to a `<textarea>` element via Radix Slot. */
export const AsChild: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Input
        {...args}
        label="Message Biography"
        placeholder="Tell us about yourself..."
        asChild
        className="h-28"
      >
        <textarea className="resize-none" />
      </Input>
    </div>
  ),
};
