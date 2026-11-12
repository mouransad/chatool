import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Radio from "@chatool/ui/radio";

const meta = {
  title: "UI/Radio",
  component: Radio,
  tags: ["autodocs"],
  args: { label: "Wi-Fi", name: "playground" },
  argTypes: {
    label: { control: "text" },
    supportingText: { control: "text" },
    defaultChecked: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    color: {
      control: "inline-radio",
      options: [undefined, "primary", "secondary", "tertiary"],
    },
    labelPosition: {
      control: "inline-radio",
      options: [undefined, "end", "start"],
    },
    controlClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Radio>;

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

/** A single radio. Every control is live — click it, Tab to it, hold Space. */
export const Playground: Story = {};

/**
 * The full state matrix. Hover, focus (Tab) and press each cell: unselected
 * presses tint `primary`, selected ones `on-surface` — MD3 previews the state
 * you're about to land in. Each row is its own group (shared `name`).
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
          ["Unselected", false],
          ["Selected", true],
        ] as const
      ).map(([name, checked]) => (
        <div key={name} className="contents">
          <Caption>{name}</Caption>
          <Radio
            name={`${name}-enabled`}
            aria-label={`${name}, enabled`}
            defaultChecked={checked}
          />
          <Radio
            name={`${name}-error`}
            aria-label={`${name}, error`}
            error
            defaultChecked={checked}
          />
          <Radio
            name={`${name}-disabled`}
            aria-label={`${name}, disabled`}
            disabled
            defaultChecked={checked}
          />
          <Radio
            name={`${name}-disabled-error`}
            aria-label={`${name}, disabled error`}
            disabled
            error
            defaultChecked={checked}
          />
        </div>
      ))}
    </Grid>
  ),
};

/**
 * The Expressive motion, slowed 4× with the duration tokens. Selecting springs
 * the dot open on M3 Expressive's **fast spatial** spring (damping 0.6,
 * stiffness 800) — watch it overshoot ~9.5% and settle. The radio you leave
 * retracts on the same spring, cut where it would cross zero.
 */
export const Motion: Story = {
  render: () => (
    <div className="flex flex-col [--md-comp-radio-dot-enter-duration:1392ms] [--md-comp-radio-dot-exit-duration:392ms] [--md-comp-radio-effects-duration:848ms]">
      <Radio name="motion" label="Slow motion — first" defaultChecked />
      <Radio name="motion" label="Slow motion — second" />
      <Radio name="motion" label="Slow motion — third" />
    </div>
  ),
};

/**
 * Same-`name` radios are one native group — no `RadioGroup` needed. The browser
 * gives the group a single Tab stop and arrow-key selection with wrap-around.
 */
export const NativeGroup: Story = {
  render: () => (
    <fieldset className="m-0 p-0 border-0">
      <legend className="mb-1 text-title-small text-on-surface">
        Ringtone
      </legend>
      <Radio name="ringtone" value="chime" label="Chime" defaultChecked />
      <Radio name="ringtone" value="pulse" label="Pulse" />
      <Radio name="ringtone" value="none" label="None" />
    </fieldset>
  ),
};

/**
 * `label` wraps the radio in a `<label>` row — the text names it and selects it,
 * and hovering/pressing the text previews the state layer. `supportingText` is
 * wired to `aria-describedby`.
 */
export const Labels: Story = {
  render: () => (
    <div className="max-w-sm flex flex-col">
      <Radio
        name="plan"
        value="free"
        label="Free"
        supportingText="1 project, community support."
      />
      <Radio
        name="plan"
        value="pro"
        label="Pro — $12/month"
        supportingText="Unlimited projects, priority support and a much longer description that wraps onto a second line."
        defaultChecked
      />
      <Radio
        name="plan"
        value="team"
        label="Team"
        supportingText="Not available in your region."
        disabled
      />
    </div>
  ),
};

/** `labelPosition="start"` puts the text first (logical, so RTL mirrors it). */
export const LabelPosition: Story = {
  render: () => (
    <div className="w-80 flex flex-col">
      <Radio
        name="quality"
        label="High quality"
        labelPosition="start"
        className="justify-between"
        defaultChecked
      />
      <Radio
        name="quality"
        label="Data saver"
        labelPosition="start"
        className="justify-between"
      />
      <div dir="rtl" className="flex flex-col">
        <Radio name="fa" label="روشن" defaultChecked />
        <Radio name="fa" label="تاریک" />
      </div>
    </div>
  ),
};

/** MD3 specifies `primary`; `secondary` / `tertiary` are fixed MD3 roles. */
export const Colors: Story = {
  render: () => (
    <div className="gap-6 flex flex-wrap">
      {(["primary", "secondary", "tertiary"] as const).map((color) => (
        <div key={color} className="flex flex-col">
          <Radio name={color} color={color} label={color} defaultChecked />
          <Radio name={color} color={color} label="other" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Bare radios (no `label`) need a name: `aria-label`, `aria-labelledby`, or
 * your own `<label htmlFor>`.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="gap-4 flex flex-col">
      <div
        role="radiogroup"
        aria-labelledby="size-title"
        className="gap-2 flex items-center"
      >
        <span
          id="size-title"
          className="text-label-large text-on-surface-variant"
        >
          Size
        </span>
        {["S", "M", "L"].map((size) => (
          <Radio
            key={size}
            name="size"
            value={size}
            aria-label={`Size ${size}`}
            defaultChecked={size === "M"}
          />
        ))}
      </div>
      <div className="flex items-center">
        <Radio id="external" name="external" />
        <label htmlFor="external" className="text-body-medium text-on-surface">
          Labelled with an external &lt;label htmlFor&gt;
        </label>
      </div>
    </div>
  ),
};

/**
 * Re-theme with `--md-comp-radio-*` tokens — globally in CSS or per instance.
 * Durations are tokens too (`0s` switches a part off).
 */
export const Customization: Story = {
  render: () => (
    <div className="flex flex-col">
      <Radio
        name="custom-size"
        label="Larger (icon / state-layer / target size)"
        defaultChecked
        className="[--md-comp-radio-icon-size:1.75rem] [--md-comp-radio-state-layer-size:3.25rem] [--md-comp-radio-touch-target-size:3.5rem]"
      />
      <Radio
        name="custom-color"
        label="Custom selected + unselected colors"
        defaultChecked
        className="[--md-comp-radio-icon-color:var(--md-sys-color-outline)] [--md-comp-radio-selected-icon-color:var(--md-sys-color-tertiary)]"
      />
      <Radio
        name="custom-color"
        label="(the other option in that group)"
        className="[--md-comp-radio-icon-color:var(--md-sys-color-outline)] [--md-comp-radio-selected-icon-color:var(--md-sys-color-tertiary)]"
      />
      <Radio
        name="custom-still"
        label="No dot animation (dot-enter-duration: 0s)"
        className="[--md-comp-radio-dot-enter-duration:0s]"
      />
    </div>
  ),
};
