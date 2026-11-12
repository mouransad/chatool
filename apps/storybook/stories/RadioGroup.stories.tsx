import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import RadioGroup from "@chatool/ui/radio-group";
import Radio from "@chatool/ui/radio";
import Button from "@chatool/ui/button";
import Divider from "@chatool/ui/divider";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    label: "Theme",
    defaultValue: "system",
    supportingText: "Applies to every device you're signed in on.",
  },
  argTypes: {
    label: { control: "text" },
    supportingText: { control: "text" },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
    },
    color: {
      control: "inline-radio",
      options: [undefined, "primary", "secondary", "tertiary"],
    },
    labelPosition: {
      control: "inline-radio",
      options: [undefined, "end", "start"],
    },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    itemsClassName: { table: { disable: true } },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="light" label="Light" />
      <Radio value="dark" label="Dark" />
      <Radio value="system" label="System default" />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A `<fieldset role="radiogroup">` named by its legend. Tab into it (lands on
 * the selected radio), then use the arrow keys: focus **and** selection move
 * together and wrap — the old dot retracts as the new one springs open.
 */
export const Playground: Story = {};

/** Controlled: `value` + `onValueChange`. `null` selects nothing. */
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState<string | null>("standard");
    return (
      <div className="gap-3 flex flex-col items-start">
        <RadioGroup
          label="Shipping"
          value={value}
          onValueChange={setValue}
          supportingText={`value = ${JSON.stringify(value)}`}
        >
          <Radio
            value="standard"
            label="Standard"
            supportingText="4–6 business days · Free"
          />
          <Radio
            value="express"
            label="Express"
            supportingText="1–2 business days · $9.99"
          />
          <Radio
            value="pickup"
            label="Store pickup"
            supportingText="Ready in 2 hours"
          />
        </RadioGroup>
        <Button variant="text" size="xs" onClick={() => setValue(null)}>
          Clear selection
        </Button>
      </div>
    );
  },
};

/**
 * A settings list: text first (`labelPosition="start"` on the group), rows
 * stretched full-width, dividers between them.
 */
export const SettingsList: Story = {
  render: () => (
    <RadioGroup
      label="Download quality"
      defaultValue="high"
      labelPosition="start"
      className="w-96"
      itemsClassName="flex-nowrap gap-0"
    >
      <Radio
        value="high"
        label="High"
        supportingText="Best quality, uses more storage"
        className="w-full justify-between"
      />
      <Divider />
      <Radio
        value="standard"
        label="Standard"
        supportingText="Downloads faster, uses less storage"
        className="w-full justify-between"
      />
      <Divider />
      <Radio
        value="saver"
        label="Data saver"
        className="w-full justify-between"
      />
    </RadioGroup>
  ),
};

/** MD3 cautions against horizontal lists; for two or three short options. */
export const Horizontal: Story = {
  args: {
    label: "Answer",
    orientation: "horizontal",
    defaultValue: undefined,
    supportingText: undefined,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="yes" label="Yes" />
      <Radio value="no" label="No" />
      <Radio value="na" label="Not applicable" />
    </RadioGroup>
  ),
};

/** `color` on the group colors every radio; a radio's own `color` wins. */
export const Colors: Story = {
  render: () => (
    <div className="gap-8 flex flex-wrap">
      {(["primary", "secondary", "tertiary"] as const).map((color) => (
        <RadioGroup key={color} label={color} color={color} defaultValue="a">
          <Radio value="a" label="Selected" />
          <Radio value="b" label="Unselected" />
        </RadioGroup>
      ))}
    </div>
  ),
};

/**
 * Native validation: `required` blocks submit until one is picked, and the
 * group turns `error` by itself after a failed submit (`:user-invalid`) — no
 * state, no JS. `FormData` gets `name=value`.
 */
export const NativeForm: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = useState<string>();
    return (
      <form
        className="gap-3 flex flex-col items-start"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(String(data.get("contact")));
        }}
      >
        <RadioGroup
          name="contact"
          label="Preferred contact method"
          required
          supportingText="Required — pick one."
        >
          <Radio value="email" label="Email" />
          <Radio value="phone" label="Phone" />
          <Radio value="sms" label="Text message" />
        </RadioGroup>
        <div className="gap-2 flex">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="text">
            Reset
          </Button>
        </div>
        {submitted && (
          <output className="text-body-medium text-on-surface-variant">
            contact = {submitted}
          </output>
        )}
      </form>
    );
  },
};

/** `error` on the group: `aria-invalid` + error colors on every radio. */
export const ErrorState: Story = {
  args: {
    label: "Account type",
    error: true,
    defaultValue: undefined,
    supportingText: "Choose an account type to continue.",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="personal" label="Personal" />
      <Radio value="business" label="Business" />
    </RadioGroup>
  ),
};

/** `disabled` is a native disabled fieldset: no focus, no submit, 38% tint. */
export const Disabled: Story = {
  render: function Render() {
    const [disabled, setDisabled] = useState(true);
    return (
      <div className="gap-3 flex flex-col items-start">
        <Button
          variant="tonal"
          size="xs"
          onClick={() => setDisabled(!disabled)}
        >
          {disabled ? "Enable" : "Disable"} the group
        </Button>
        <RadioGroup
          label="Sync frequency"
          disabled={disabled}
          defaultValue="hourly"
          supportingText="Managed by your organization."
        >
          <Radio value="live" label="Live" />
          <Radio value="hourly" label="Hourly" />
          <Radio value="daily" label="Daily" />
        </RadioGroup>
      </div>
    );
  },
};

/** RTL: the label side and the arrow keys mirror automatically. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <RadioGroup label="زبان" defaultValue="fa">
        <Radio value="fa" label="فارسی" />
        <Radio value="en" label="English" />
        <Radio value="ar" label="العربية" />
      </RadioGroup>
    </div>
  ),
};
