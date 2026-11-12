import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Checkbox from "@chatool/ui/checkbox";
import Button from "@chatool/ui/button";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Remember me" },
  argTypes: {
    label: { control: "text" },
    supportingText: { control: "text" },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary"],
    },
    labelPosition: { control: "inline-radio", options: ["end", "start"] },
    controlClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-x-6 gap-y-2 grid grid-cols-[auto_repeat(4,minmax(4rem,auto))] items-center">
    {children}
  </div>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="text-label-medium text-on-surface-variant">{children}</span>
);

/** Every control. Click it, Tab to it, hold Space — the motion is the point. */
export const Playground: Story = {};

/**
 * The full MD3 state matrix. Hover, focus (Tab) and press each cell to see the
 * state layer: unselected presses tint `primary`, selected ones `on-surface`,
 * error ones `error` — MD3 previews the state you're about to land in.
 */
export const States: Story = {
  render: () => (
    <Grid>
      <span />
      <Caption>Enabled</Caption>
      <Caption>Error</Caption>
      <Caption>Disabled</Caption>
      <Caption>Disabled error</Caption>
      {(
        [
          ["Unselected", {}],
          ["Checked", { defaultChecked: true }],
          ["Indeterminate", { indeterminate: true }],
        ] as const
      ).map(([name, state]) => (
        <div key={name} className="contents">
          <Caption>{name}</Caption>
          <Checkbox aria-label={`${name}, enabled`} {...state} />
          <Checkbox aria-label={`${name}, error`} error {...state} />
          <Checkbox aria-label={`${name}, disabled`} disabled {...state} />
          <Checkbox
            aria-label={`${name}, disabled error`}
            disabled
            error
            {...state}
          />
        </div>
      ))}
    </Grid>
  ),
};

/**
 * With `label` the box renders inside a `<label>` row: the text names it,
 * clicking the text toggles it, and hovering/pressing the text previews the
 * state layer. `supportingText` is wired to `aria-describedby` and turns
 * `error` color when the checkbox is invalid.
 */
export const Labels: Story = {
  render: () => (
    <div className="max-w-sm flex flex-col">
      <Checkbox label="Send me product updates" defaultChecked />
      <Checkbox
        label="Share usage analytics"
        supportingText="Anonymous crash reports and feature usage. You can turn this off at any time in Settings."
      />
      <Checkbox
        label="I accept the terms of service"
        supportingText="Required to create an account."
        error
      />
      <Checkbox
        label="Sync over mobile data"
        supportingText="Unavailable on this plan."
        disabled
      />
    </div>
  ),
};

/** `labelPosition="start"` puts the text first (logical, so RTL mirrors it). */
export const LabelPosition: Story = {
  render: () => (
    <div className="w-80 flex flex-col">
      <Checkbox
        label="Wi-Fi only downloads"
        labelPosition="start"
        className="justify-between"
        defaultChecked
      />
      <Checkbox
        label="Show previews"
        labelPosition="start"
        className="justify-between"
      />
      <div dir="rtl" className="flex flex-col">
        <Checkbox label="مرا به خاطر بسپار" defaultChecked />
        <Checkbox label="حالت نامشخص" indeterminate />
      </div>
    </div>
  ),
};

/** MD3 specifies `primary`; `secondary` / `tertiary` are contrast-safe pairs. */
export const Colors: Story = {
  render: () => (
    <div className="gap-2 flex flex-wrap">
      {(["primary", "secondary", "tertiary"] as const).map((color) => (
        <div key={color} className="flex flex-col">
          <Checkbox color={color} label={color} defaultChecked />
          <Checkbox color={color} label="mixed" indeterminate />
        </div>
      ))}
    </div>
  ),
};

const TOPPINGS = ["Basil", "Mozzarella", "Olives", "Mushrooms"];

/**
 * The APG tri-state pattern: the parent reflects its children (all → checked,
 * some → indeterminate, none → unchecked); activating it checks all children
 * unless all are already checked. Watch the check ⇄ dash **morph**.
 */
export const ParentAndChildren: Story = {
  render: function Render() {
    const [checked, setChecked] = useState([true, false, true, false]);
    const all = checked.every(Boolean);
    const some = checked.some(Boolean);

    return (
      <fieldset className="m-0 p-0 border-0">
        <legend className="sr-only">Toppings</legend>
        <Checkbox
          label="All toppings"
          checked={all}
          indeterminate={some && !all}
          onChange={() => setChecked(checked.map(() => !all))}
          aria-controls="toppings"
        />
        <div id="toppings" className="ps-8 flex flex-col">
          {TOPPINGS.map((name, index) => (
            <Checkbox
              key={name}
              label={name}
              checked={checked[index]}
              onChange={(event) =>
                setChecked(
                  checked.map((value, i) =>
                    i === index ? event.target.checked : value,
                  ),
                )
              }
            />
          ))}
        </div>
      </fieldset>
    );
  },
};

/**
 * It's a real `<input type="checkbox">`: `name`/`value` submit with the form,
 * `required` validates natively, and a required box the user leaves unchecked
 * turns `error` by itself (`:user-invalid`) — no state, no JS.
 */
export const NativeForm: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = useState<string>();

    return (
      <form
        className="gap-3 max-w-sm flex flex-col items-start"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(JSON.stringify(data.getAll("topics")));
        }}
      >
        <fieldset className="m-0 p-0 border-0">
          <legend className="text-title-small text-on-surface">Topics</legend>
          <Checkbox name="topics" value="design" label="Design" />
          <Checkbox name="topics" value="engineering" label="Engineering" />
        </fieldset>
        <Checkbox
          name="terms"
          required
          label="I agree to the terms"
          supportingText="Required."
        />
        <Button type="submit">Submit</Button>
        {submitted && (
          <output className="text-body-medium text-on-surface-variant">
            topics = {submitted}
          </output>
        )}
      </form>
    );
  },
};

/** A disabled `<fieldset>` disables every checkbox inside it — visually too. */
export const DisabledFieldset: Story = {
  render: function Render() {
    const [disabled, setDisabled] = useState(true);
    return (
      <div className="gap-2 flex flex-col items-start">
        <Checkbox
          label="Disable the group"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />
        <fieldset disabled={disabled} className="m-0 p-0 ps-8 border-0">
          <Checkbox label="Email" defaultChecked />
          <Checkbox label="Push" indeterminate />
          <Checkbox label="SMS" />
        </fieldset>
      </div>
    );
  },
};

/**
 * Bare checkboxes (no `label`) need a name: `aria-label`, `aria-labelledby`,
 * or your own `<label htmlFor>`. Typical in tables and list rows.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="gap-4 flex flex-col">
      <table className="border-collapse text-body-medium text-on-surface">
        <thead>
          <tr className="text-start text-label-large text-on-surface-variant">
            <th className="font-medium">
              <Checkbox aria-label="Select all messages" indeterminate />
            </th>
            <th className="font-medium text-start">Subject</th>
          </tr>
        </thead>
        <tbody>
          {["Lunch on Friday?", "Design review notes"].map((subject, i) => (
            <tr key={subject}>
              <td>
                <Checkbox
                  aria-labelledby={`subject-${i}`}
                  defaultChecked={i === 0}
                />
              </td>
              <td id={`subject-${i}`}>{subject}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center">
        <Checkbox id="external" />
        <label htmlFor="external" className="text-body-medium text-on-surface">
          Labelled with an external &lt;label htmlFor&gt;
        </label>
      </div>
    </div>
  ),
};

/**
 * Re-theme with `--md-comp-checkbox-*` tokens — globally in CSS or per
 * instance. Motion durations are tokens too (`0s` turns a part off).
 */
export const Customization: Story = {
  render: () => (
    <div className="flex flex-col">
      <Checkbox
        label="Larger, rounder (container-size / shape)"
        defaultChecked
        className="[--md-comp-checkbox-container-shape:0.375rem] [--md-comp-checkbox-container-size:1.5rem] [--md-comp-checkbox-state-layer-size:3rem] [--md-comp-checkbox-touch-target-size:3.5rem]"
      />
      <Checkbox
        label="Custom container + check colors"
        defaultChecked
        className="[--md-comp-checkbox-selected-container-color:var(--md-sys-color-inverse-surface)] [--md-comp-checkbox-selected-icon-color:var(--md-sys-color-inverse-primary)]"
      />
      <Checkbox
        label="Slow-motion draw (spatial-duration: 1.2s)"
        className="[--md-comp-checkbox-spatial-duration:1.2s]"
      />
      <Checkbox
        label="No draw animation (spatial-duration: 0s)"
        className="[--md-comp-checkbox-spatial-duration:0s]"
      />
    </div>
  ),
};
