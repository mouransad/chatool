import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Switch from "@chatool/ui/switch";
import Button from "@chatool/ui/button";
import DarkModeRounded from "@chatool/icons/DarkModeRounded";
import LightModeRounded from "@chatool/icons/LightModeRounded";
import NotificationsRounded from "@chatool/icons/NotificationsRounded";
import VolumeOffRounded from "@chatool/icons/VolumeOffRounded";
import VolumeUpRounded from "@chatool/icons/VolumeUpRounded";
import LockRounded from "@chatool/icons/LockRounded";
import LockOpenRounded from "@chatool/icons/LockOpenRounded";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { label: "Wi-Fi" },
  argTypes: {
    label: { control: "text" },
    supportingText: { control: "text" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    icons: { control: "inline-radio", options: [false, "selected", true] },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary"],
    },
    labelPosition: { control: "inline-radio", options: ["start", "end"] },
    selectedIcon: { table: { disable: true } },
    unselectedIcon: { table: { disable: true } },
    controlClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-x-8 gap-y-2 grid grid-cols-[auto_repeat(4,minmax(4rem,auto))] items-center">
    {children}
  </div>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="text-label-medium text-on-surface-variant">{children}</span>
);

/**
 * Every control. Click it, tap it, **drag the handle**, Tab to it and hold
 * Space (or press Enter) — the motion is the point: the handle snaps to 28dp
 * when pressed, then springs to the other side on M3 Expressive's
 * fast-spatial spring.
 */
export const Playground: Story = {};

/**
 * MD3's three configurations × on/off × enabled/disabled. Hover, focus (Tab)
 * and press each one: the handle turns `on-surface-variant` /
 * `primary-container`, the state layer follows the handle, and the focus ring
 * hugs the track.
 */
export const States: Story = {
  render: () => (
    <Grid>
      <span />
      <Caption>Off</Caption>
      <Caption>On</Caption>
      <Caption>Disabled off</Caption>
      <Caption>Disabled on</Caption>
      {(
        [
          ["Without icons", false],
          ["Icon on selected", "selected"],
          ["Icons on both", true],
        ] as const
      ).map(([name, icons]) => (
        <div key={name} className="contents">
          <Caption>{name}</Caption>
          <Switch aria-label={`${name}, off`} icons={icons} />
          <Switch aria-label={`${name}, on`} icons={icons} defaultChecked />
          <Switch aria-label={`${name}, disabled off`} icons={icons} disabled />
          <Switch
            aria-label={`${name}, disabled on`}
            icons={icons}
            disabled
            defaultChecked
          />
        </div>
      ))}
    </Grid>
  ),
};

/**
 * The MD3 settings list: the label describes what the switch turns **on**,
 * sits before it (`labelPosition="start"`, the default) and toggles it too.
 * `supportingText` is wired to `aria-describedby`. Stretch the row with
 * `className="w-full justify-between"`.
 */
export const SettingsList: Story = {
  render: () => (
    <div className="max-w-sm p-2 rounded-large flex flex-col bg-surface-container-low">
      <Switch
        label="Wi-Fi"
        defaultChecked
        className="px-2 w-full justify-between"
      />
      <Switch
        label="Bluetooth"
        supportingText="Visible as “Pixel” to nearby devices while settings are open."
        className="px-2 w-full justify-between"
      />
      <Switch
        label="Airplane mode"
        icons="selected"
        className="px-2 w-full justify-between"
      />
      <Switch
        label="Hotspot"
        supportingText="Not available on this plan."
        disabled
        className="px-2 w-full justify-between"
      />
    </div>
  ),
};

/** `labelPosition="end"` puts the text after the switch (logical — RTL mirrors). */
export const LabelPosition: Story = {
  render: () => (
    <div className="flex flex-col">
      <Switch label="Text after the switch" labelPosition="end" />
      <Switch label="Text before the switch" labelPosition="start" />
      <div dir="rtl" className="w-80 flex flex-col">
        <Switch
          label="حالت تاریک"
          defaultChecked
          icons
          className="w-full justify-between"
        />
        <Switch
          label="اعلان‌ها"
          icons="selected"
          className="w-full justify-between"
        />
      </div>
    </div>
  ),
};

/**
 * `icons="selected"` shows a check only when on (it rotates into view);
 * `icons` shows a check and a close mark. Pass any node — e.g. an
 * `@chatool/icons` glyph — as `selectedIcon` / `unselectedIcon`. MD3: icons
 * must say on/off unambiguously, so pick a clear pair.
 */
export const Icons: Story = {
  render: () => (
    <div className="flex flex-col">
      <Switch label="Check when on" icons="selected" defaultChecked />
      <Switch label="Check and close" icons defaultChecked />
      <Switch
        label="Sound"
        selectedIcon={<VolumeUpRounded />}
        unselectedIcon={<VolumeOffRounded />}
        defaultChecked
      />
      <Switch
        label="Lock screen"
        selectedIcon={<LockRounded />}
        unselectedIcon={<LockOpenRounded />}
      />
      <Switch
        label="Notifications"
        selectedIcon={<NotificationsRounded />}
        defaultChecked
      />
    </div>
  ),
};

/**
 * MD3 specifies `primary`; `secondary` / `tertiary` swap in the matching role
 * family (track, handle, hovered handle, icon).
 */
export const Colors: Story = {
  render: () => (
    <div className="gap-6 flex flex-wrap">
      {(["primary", "secondary", "tertiary"] as const).map((color) => (
        <div key={color} className="flex flex-col">
          <Switch color={color} label={color} labelPosition="end" />
          <Switch
            color={color}
            label={color}
            labelPosition="end"
            icons
            defaultChecked
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * Controlled, Compose-style: `checked` + `onCheckedChange(checked, event)`.
 * The theme toggle below drives the switch from state — drag it, flick it, or
 * press Enter.
 */
export const Controlled: Story = {
  render: function Render() {
    const [dark, setDark] = useState(false);
    return (
      <div className="gap-3 flex flex-col items-start">
        <Switch
          label="Dark theme"
          checked={dark}
          onCheckedChange={setDark}
          selectedIcon={<DarkModeRounded />}
          unselectedIcon={<LightModeRounded />}
        />
        <span className="text-body-medium text-on-surface-variant">
          dark = {String(dark)}
        </span>
        <Button variant="tonal" size="xs" onClick={() => setDark((d) => !d)}>
          Toggle from outside
        </Button>
      </div>
    );
  },
};

/**
 * Drag the handle: past a few pixels it follows the pointer (growing to its
 * 28dp pressed size), then lands on the side you flung it towards — or the
 * nearer one if you let go slowly. Releasing on the side it started on leaves
 * the switch unchanged. A vertical swipe on touch still scrolls the page.
 */
export const Drag: Story = {
  render: function Render() {
    const [log, setLog] = useState<string[]>([]);
    return (
      <div className="gap-2 flex flex-col items-start">
        <Switch
          label="Drag me"
          icons
          onCheckedChange={(checked) =>
            setLog((l) => [`onCheckedChange(${checked})`, ...l].slice(0, 5))
          }
          controlClassName="[--md-comp-switch-track-height:3rem] [--md-comp-switch-track-width:5rem]"
        />
        <Switch label="Or me, at the default size" />
        <ol className="m-0 ps-5 text-body-small text-on-surface-variant">
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ol>
      </div>
    );
  },
};

/**
 * It's a real `<input type="checkbox" role="switch">`: `name` / `value`
 * submit with the form (nothing when off, like a checkbox), `required`
 * validates natively, and Enter toggles instead of submitting.
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
          setSubmitted(JSON.stringify(Object.fromEntries(data)));
        }}
      >
        <Switch name="newsletter" label="Newsletter" defaultChecked />
        <Switch name="beta" value="enrolled" label="Beta features" />
        <Button type="submit">Submit</Button>
        {submitted && (
          <output className="text-body-medium text-on-surface-variant">
            {submitted}
          </output>
        )}
      </form>
    );
  },
};

/** A disabled `<fieldset>` disables every switch inside it — visually too. */
export const DisabledFieldset: Story = {
  render: function Render() {
    const [locked, setLocked] = useState(true);
    return (
      <div className="gap-2 flex flex-col items-start">
        <Switch
          label="Managed by your organization"
          checked={locked}
          onCheckedChange={setLocked}
        />
        <fieldset disabled={locked} className="m-0 p-0 ps-6 border-0">
          <Switch label="Location history" defaultChecked />
          <Switch label="Web & app activity" icons />
        </fieldset>
      </div>
    );
  },
};

/**
 * Bare switches need a name: `aria-label`, `aria-labelledby` or your own
 * `<label htmlFor>`. Keep the name constant — the screen reader announces
 * "on" / "off" itself (APG: never change the label with the state). Group
 * related switches in a `<fieldset>` + `<legend>`.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="gap-4 flex flex-col">
      <fieldset className="m-0 p-0 border-0">
        <legend className="text-title-small text-on-surface">
          Accessibility preferences
        </legend>
        <Switch label="Reduce motion" />
        <Switch
          label="Show captions"
          supportingText="Applies to every video in the app."
          defaultChecked
        />
      </fieldset>
      <div className="gap-3 flex items-center">
        <span id="photos" className="text-body-medium text-on-surface">
          Photo album access
        </span>
        <Switch aria-labelledby="photos" />
      </div>
      <div className="gap-3 flex items-center">
        <Switch id="external" />
        <label htmlFor="external" className="text-body-medium text-on-surface">
          Labelled with an external &lt;label htmlFor&gt;
        </label>
      </div>
    </div>
  ),
};

/**
 * Re-theme with `--md-comp-switch-*` tokens — globally in CSS or per
 * instance. The handle's travel is derived from the track tokens, so a
 * resized track just works. Motion durations are tokens too (`0s` turns a
 * part off).
 */
export const Customization: Story = {
  render: () => (
    <div className="flex flex-col">
      <Switch
        label="Larger (track 64×40, handles 20 / 30 / 34)"
        icons
        defaultChecked
        controlClassName="[--md-comp-switch-icon-size:1.25rem] [--md-comp-switch-pressed-handle-size:2.125rem] [--md-comp-switch-selected-handle-size:1.875rem] [--md-comp-switch-state-layer-size:3rem] [--md-comp-switch-track-height:2.5rem] [--md-comp-switch-track-width:4rem] [--md-comp-switch-unselected-handle-size:1.25rem] [--md-comp-switch-with-icon-handle-size:1.875rem]"
      />
      <Switch
        label="Squircle (track + handle shape)"
        defaultChecked
        controlClassName="[--md-comp-switch-handle-shape:0.375rem] [--md-comp-switch-track-shape:0.625rem]"
      />
      <Switch
        label="Custom colors (inverse roles)"
        defaultChecked
        icons="selected"
        controlClassName="[--md-comp-switch-selected-handle-color:var(--md-sys-color-inverse-primary)] [--md-comp-switch-selected-icon-color:var(--md-sys-color-inverse-surface)] [--md-comp-switch-selected-track-color:var(--md-sys-color-inverse-surface)]"
      />
      <Switch
        label="Slow motion (handle-duration: 1.2s)"
        controlClassName="[--md-comp-switch-handle-duration:1.2s]"
      />
      <Switch
        label="No handle animation (handle-duration: 0s)"
        controlClassName="[--md-comp-switch-handle-duration:0s]"
      />
    </div>
  ),
};
