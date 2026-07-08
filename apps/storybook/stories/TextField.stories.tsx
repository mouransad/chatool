import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import TextField from "@chatool/ui/text-field";
import SearchOutlined from "@chatool/icons/SearchOutlined";
import ErrorOutlined from "@chatool/icons/ErrorOutlined";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined"],
    },
    size: {
      control: "select",
      options: ["s", "xs"],
    },
    error: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    variant: "filled",
    size: "s",
    label: "Username",
    placeholder: "Enter your username",
    disabled: false,
    error: false,
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-6 mx-auto bg-surface text-on-surface">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Email Address",
    placeholder: "you@example.com",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    label: "Email Address",
    placeholder: "you@example.com",
  },
};

export const Compact: Story = {
  args: {
    variant: "outlined",
    size: "xs",
    label: "Compact Field",
    placeholder: "Compact content",
  },
};

export const WithIcons: Story = {
  args: {
    variant: "outlined",
    label: "Search",
    placeholder: "Search messages...",
    startIcon: <SearchOutlined />,
  },
};

export const HelperAndErrorText: Story = {
  render: (args) => (
    <div className="space-y-6">
      <TextField
        {...args}
        label="Password"
        type="password"
        placeholder="Enter password"
        helperText="Must be at least 8 characters long"
      />
      <TextField
        {...args}
        label="Email Address"
        placeholder="you@example.com"
        error
        defaultValue="invalid-email"
        errorText="Please enter a valid email address"
        endIcon={<ErrorOutlined />}
      />
    </div>
  ),
};

export const CharacterCounter: Story = {
  args: {
    variant: "outlined",
    label: "Bio",
    placeholder: "Tell us about yourself...",
    helperText: "Brief summary",
    characterCount: "0 / 100",
  },
};

export const Textarea: Story = {
  render: (args) => (
    <TextField
      {...args}
      asChild
      label="Biography"
      placeholder="Write a few sentences about yourself..."
      className="h-28"
    >
      <textarea className="pt-4 pb-4 resize-none" />
    </TextField>
  ),
};
