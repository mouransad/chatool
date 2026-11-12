import { useState } from "react";
import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Slider, { RangeSlider } from "@chatool/ui/slider";
import Button from "@chatool/ui/button";
import TextField from "@chatool/ui/text-field";
import AddRounded from "@chatool/icons/AddRounded";
import LightModeRounded from "@chatool/icons/LightModeRounded";
import MicOffRounded from "@chatool/icons/MicOffRounded";
import MicRounded from "@chatool/icons/MicRounded";
import RemoveRounded from "@chatool/icons/RemoveRounded";
import VolumeOffRounded from "@chatool/icons/VolumeOffRounded";
import VolumeUpRounded from "@chatool/icons/VolumeUpRounded";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: { "aria-label": "Volume", defaultValue: 40 },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "s", "m", "l", "xl"] },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    valueIndicator: {
      control: "inline-radio",
      options: [false, true, "always"],
    },
    centered: { control: "boolean" },
    inverted: { control: "boolean" },
    disabled: { control: "boolean" },
    endStops: { control: "boolean" },
    haptics: { control: "boolean" },
    stops: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    largeStep: { control: "number" },
    icon: { table: { disable: true } },
    endIcon: { table: { disable: true } },
    classNames: { table: { disable: true } },
    format: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-xl pt-14 pb-4 px-6 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="gap-4 grid grid-cols-[6rem_1fr] items-center">
    <span className="text-label-medium text-on-surface-variant">{label}</span>
    {children}
  </div>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-14 flex flex-col">{children}</div>
);

/**
 * Every control. **Drag** the handle (it squeezes 4dp → 2dp), **click** the
 * track (it glides there on the Expressive spatial spring), or **Tab** to it
 * and use ← → / ↑ ↓, Page Up / Page Down (or Shift / Space + arrows) and
 * Home / End.
 */
export const Playground: Story = { args: { valueIndicator: true } };

/**
 * MD3's five sizes — XS 16dp (default), S 24dp, M 40dp, L 56dp, XL 96dp
 * tracks with 44 / 44 / 52 / 68 / 108dp handles. "Use larger sizes to
 * increase the targets and provide a larger visual emphasis"; reserve XL for
 * hero moments.
 */
export const Sizes: Story = {
  render: (args) => (
    <Stack>
      {(["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <Row key={size} label={size.toUpperCase()}>
          <Slider {...args} size={size} aria-label={`Size ${size}`} />
        </Row>
      ))}
    </Stack>
  ),
};

/**
 * MD3's three variants: **standard** (from the start), **centered** (from
 * the middle — zero or the default sits at the centre) and **range** (two
 * handles; the active track runs between them).
 */
export const Variants: Story = {
  render: () => (
    <Stack>
      <Row label="Standard">
        <Slider aria-label="Standard" defaultValue={30} valueIndicator />
      </Row>
      <Row label="Centered">
        <Slider
          aria-label="Exposure"
          centered
          min={-50}
          max={50}
          defaultValue={20}
          valueIndicator
        />
      </Row>
      <Row label="Range">
        <RangeSlider
          aria-label="Price"
          defaultValue={[20, 70]}
          valueIndicator
        />
      </Row>
    </Stack>
  ),
};

/**
 * **Stops** — `stops` draws a dot at every `step` and the handle snaps to
 * the nearest one ("discrete" slider). Stops are inset by the track corner,
 * dots under the handle gap are hidden, and the ones on the active track turn
 * `on-primary`. Pass an **array** for custom, non-uniform stops.
 */
export const Stops: Story = {
  render: () => (
    <Stack>
      <Row label="Every 10">
        <Slider
          aria-label="Every 10"
          step={10}
          stops
          defaultValue={40}
          valueIndicator
        />
      </Row>
      <Row label="Centered">
        <Slider
          aria-label="Balance"
          centered
          min={-5}
          max={5}
          stops
          defaultValue={-2}
          valueIndicator
        />
      </Row>
      <Row label="Range">
        <RangeSlider
          aria-label="Rating"
          min={1}
          max={10}
          stops
          defaultValue={[3, 7]}
          valueIndicator
        />
      </Row>
      <Row label="Custom">
        <Slider
          aria-label="Storage"
          stops={[0, 16, 32, 64, 128, 256]}
          max={256}
          defaultValue={64}
          size="s"
          valueIndicator
          format={(v) => `${v} GB`}
        />
      </Row>
      <Row label="No end stop">
        <Slider aria-label="No end stop" endStops={false} defaultValue={50} />
      </Row>
    </Stack>
  ),
};

/**
 * The **value indicator**: `true` shows it while the handle is pressed,
 * dragged or keyboard-focused; `"always"` keeps it up. `format` takes
 * `Intl.NumberFormatOptions` (serializable from a Server Component) or a
 * function, and also feeds `aria-valuetext`.
 */
export const ValueIndicator: Story = {
  render: () => (
    <Stack>
      <Row label="On interaction">
        <Slider aria-label="Interaction" defaultValue={42} valueIndicator />
      </Row>
      <Row label="Always">
        <Slider aria-label="Always" defaultValue={42} valueIndicator="always" />
      </Row>
      <Row label="Percent">
        <Slider
          aria-label="Opacity"
          min={0}
          max={1}
          step={0.01}
          defaultValue={0.65}
          valueIndicator="always"
          format={{ style: "percent" }}
        />
      </Row>
      <Row label="Currency">
        <RangeSlider
          aria-label="Budget"
          min={0}
          max={500}
          step={10}
          defaultValue={[120, 340]}
          valueIndicator="always"
          format={{
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }}
        />
      </Row>
      <Row label="Function">
        <Slider
          aria-label="Temperature"
          min={16}
          max={30}
          step={0.5}
          defaultValue={21.5}
          valueIndicator="always"
          format={(v) => `${v.toFixed(1)}°`}
        />
      </Row>
    </Stack>
  ),
};

/**
 * MD3 **inset icons** (M, L, XL): the icon rides the start of the active
 * track and hands off to the inactive track when there's no room — drag
 * towards 0 to watch it. `icon` can be a function of the value, e.g. volume
 * becoming mute at 0. `endIcon` anchors the track end instead of the stop.
 */
export const InsetIcons: Story = {
  render: () => (
    <Stack>
      <Row label="M">
        <Slider
          aria-label="Volume"
          size="m"
          defaultValue={60}
          icon={(v) => (v === 0 ? <VolumeOffRounded /> : <VolumeUpRounded />)}
        />
      </Row>
      <Row label="L">
        <Slider
          aria-label="Microphone"
          size="l"
          defaultValue={12}
          icon={(v) => (v === 0 ? <MicOffRounded /> : <MicRounded />)}
        />
      </Row>
      <Row label="XL">
        <Slider
          aria-label="Brightness"
          size="xl"
          defaultValue={70}
          icon={<LightModeRounded />}
        />
      </Row>
      <Row label="Start + end">
        <Slider
          aria-label="Zoom"
          size="m"
          defaultValue={45}
          icon={<RemoveRounded />}
          endIcon={<AddRounded />}
        />
      </Row>
    </Stack>
  ),
};

/**
 * **Vertical** sliders run bottom (min) → top (max); ↑ / → increase. The
 * value indicator sits to the side. `inverted` flips the direction.
 */
export const Vertical: Story = {
  render: () => (
    <div className="gap-10 pl-16 flex flex-wrap items-end">
      <Slider
        aria-label="XS"
        orientation="vertical"
        defaultValue={60}
        valueIndicator
      />
      <Slider
        aria-label="S"
        orientation="vertical"
        size="s"
        defaultValue={30}
        stops
        step={10}
        valueIndicator
      />
      <Slider
        aria-label="M"
        orientation="vertical"
        size="m"
        defaultValue={70}
        icon={(v) => (v === 0 ? <VolumeOffRounded /> : <VolumeUpRounded />)}
        valueIndicator
      />
      <Slider
        aria-label="L"
        orientation="vertical"
        size="l"
        centered
        min={-10}
        max={10}
        defaultValue={4}
        valueIndicator
      />
      <Slider
        aria-label="XL"
        orientation="vertical"
        size="xl"
        defaultValue={45}
        icon={<LightModeRounded />}
        className="h-64"
      />
      <Slider
        aria-label="Inverted"
        orientation="vertical"
        inverted
        defaultValue={30}
        valueIndicator
      />
    </div>
  ),
};

/** `inverted` (max at the start) and RTL: everything mirrors, keys follow the screen. */
export const DirectionAndRtl: Story = {
  render: () => (
    <Stack>
      <Row label="Inverted">
        <Slider
          aria-label="Inverted"
          inverted
          defaultValue={30}
          valueIndicator
        />
      </Row>
      <div dir="rtl">
        <Row label="RTL">
          <Slider
            aria-label="صدا"
            size="m"
            defaultValue={35}
            icon={<VolumeUpRounded />}
            valueIndicator
          />
        </Row>
      </div>
      <div dir="rtl">
        <Row label="RTL range">
          <RangeSlider
            aria-label="قیمت"
            defaultValue={[25, 60]}
            stops
            step={5}
            valueIndicator
          />
        </Row>
      </div>
    </Stack>
  ),
};

/**
 * Disabled: `on-surface` tracks at 38% / 12%, a 38% handle, and no
 * interaction. A surrounding `<fieldset disabled>` disables it too.
 */
export const Disabled: Story = {
  render: () => (
    <Stack>
      <Slider aria-label="Disabled" disabled defaultValue={40} />
      <Slider
        aria-label="Disabled stops"
        disabled
        defaultValue={40}
        step={10}
        stops
        size="s"
      />
      <RangeSlider
        aria-label="Disabled range"
        disabled
        defaultValue={[20, 60]}
      />
      <fieldset disabled>
        <Slider
          aria-label="In a disabled fieldset"
          size="m"
          defaultValue={60}
          icon={<VolumeUpRounded />}
        />
      </fieldset>
    </Stack>
  ),
};

const ControlledDemo = () => {
  const [value, setValue] = useState(30);
  const [committed, setCommitted] = useState(30);
  return (
    <div className="gap-4 flex flex-col">
      <Slider
        aria-label="Controlled"
        value={value}
        onValueChange={setValue}
        onValueCommit={setCommitted}
        valueIndicator
      />
      <div className="gap-2 flex items-center">
        <Button variant="tonal" size="xs" onClick={() => setValue(0)}>
          0
        </Button>
        <Button variant="tonal" size="xs" onClick={() => setValue(50)}>
          50
        </Button>
        <Button variant="tonal" size="xs" onClick={() => setValue(100)}>
          100
        </Button>
        <span className="text-body-medium text-on-surface-variant">
          value {value} · committed {committed}
        </span>
      </div>
    </div>
  );
};

/**
 * Controlled with `value` + `onValueChange`; `onValueCommit` fires once per
 * gesture (pointer up / key press). Programmatic changes glide on the spring.
 */
export const Controlled: Story = { render: () => <ControlledDemo /> };

const WithTextFieldDemo = () => {
  const [value, setValue] = useState(64);
  return (
    <div className="gap-4 flex items-center">
      <Slider
        id="speed-slider"
        aria-label="Speed"
        value={value}
        onValueChange={setValue}
        max={200}
        className="flex-1"
      />
      <TextField
        label="Speed"
        type="number"
        className="w-28"
        value={String(value)}
        onChange={(event) => {
          const next = Number(event.currentTarget.value);
          if (Number.isFinite(next)) setValue(Math.min(200, Math.max(0, next)));
        }}
      />
    </div>
  );
};

/**
 * MD3: "Instead of showing the built-in value label, a separate text input
 * field can be added outside of the slider … the slider and value in this
 * text field should automatically update to match each other." Tab moves
 * from the slider straight to the field.
 */
export const WithTextField: Story = { render: () => <WithTextFieldDemo /> };

const RangeDemo = () => {
  const [range, setRange] = useState<[number, number]>([200, 800]);
  return (
    <div className="gap-3 flex flex-col">
      <RangeSlider
        aria-label="Price range"
        thumbLabels={["Minimum price", "Maximum price"]}
        min={0}
        max={1000}
        step={50}
        minStepsBetweenThumbs={2}
        value={range}
        onValueChange={setRange}
        valueIndicator
        format={{
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }}
      />
      <span className="text-body-medium text-on-surface-variant">
        ${range[0]} – ${range[1]} (at least 2 steps apart)
      </span>
    </div>
  );
};

/** A controlled range with `minStepsBetweenThumbs` and named handles. */
export const Range: Story = { render: () => <RangeDemo /> };

const FormDemo = () => {
  const [data, setData] = useState<string>("—");
  return (
    <form
      className="gap-6 flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setData(
          JSON.stringify({
            volume: form.get("volume"),
            price: form.getAll("price"),
          }),
        );
      }}
    >
      <Slider
        name="volume"
        aria-label="Volume"
        defaultValue={25}
        size="m"
        icon={<VolumeUpRounded />}
      />
      <RangeSlider name="price" aria-label="Price" defaultValue={[10, 90]} />
      <div className="gap-2 flex">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="outlined">
          Reset
        </Button>
      </div>
      <code className="text-body-small">{data}</code>
    </form>
  );
};

/**
 * Forms: `name` submits the value (both values for a range); a form
 * `reset` restores `defaultValue`.
 */
export const Forms: Story = { render: () => <FormDemo /> };

/**
 * Accessibility: name the slider like its visible text (`<label htmlFor>` +
 * `id`, or `aria-labelledby`), add `aria-valuetext` via `format` /
 * `getAriaValueText`, and use plus / minus icon buttons outside the track as
 * an alternative to the end stops.
 */
export const Accessibility: Story = {
  render: () => (
    <Stack>
      <div className="gap-2 flex flex-col">
        <label htmlFor="a11y-brightness" className="text-label-large">
          Screen brightness
        </label>
        <Slider
          id="a11y-brightness"
          defaultValue={70}
          getAriaValueText={(v) => `${v} percent`}
        />
      </div>
      <div className="gap-2 flex flex-col">
        <span id="a11y-days" className="text-label-large">
          Trip length
        </span>
        <RangeSlider
          aria-labelledby="a11y-days"
          thumbLabels={["Shortest trip", "Longest trip"]}
          min={1}
          max={30}
          defaultValue={[5, 12]}
          getAriaValueText={(v) => `${v} days`}
        />
      </div>
    </Stack>
  ),
};

/**
 * Customization: global `--md-sys-*` roles, per-slider `--md-comp-slider-*`
 * tokens (colors, track height, corners, handle, gap, stops, motion), and
 * `classNames` per part.
 */
export const Customization: Story = {
  render: () => (
    <Stack>
      <Slider
        aria-label="Tertiary"
        defaultValue={60}
        size="s"
        style={
          {
            "--md-comp-slider-active-track-color":
              "var(--md-sys-color-tertiary)",
            "--md-comp-slider-handle-color": "var(--md-sys-color-tertiary)",
            "--md-comp-slider-inactive-track-color":
              "var(--md-sys-color-tertiary-container)",
          } as React.CSSProperties
        }
      />
      <Slider
        aria-label="Square"
        defaultValue={40}
        size="m"
        style={
          {
            "--md-comp-slider-track-corner": "0.25rem",
            "--md-comp-slider-handle-gap": "0.5rem",
            "--md-comp-slider-handle-width": "0.375rem",
          } as React.CSSProperties
        }
      />
      <Slider
        aria-label="Class names"
        defaultValue={50}
        valueIndicator="always"
        classNames={{
          valueIndicator: "bg-primary text-on-primary",
          handle: "bg-error",
          activeTrack: "bg-error",
        }}
      />
    </Stack>
  ),
};
