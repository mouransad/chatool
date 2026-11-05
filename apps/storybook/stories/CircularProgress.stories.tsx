import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@chatool/ui/button";
import CircularProgress from "@chatool/ui/circular-progress";

const meta = {
  title: "UI/CircularProgress",
  component: CircularProgress,
  tags: ["autodocs"],
  args: { value: 60 },
  argTypes: {
    shape: { control: "inline-radio", options: ["wavy", "flat"] },
    color: { control: "inline-radio", options: ["primary", "inherit"] },
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: "number" },
    size: { control: { type: "range", min: 24, max: 240, step: 4 } },
    thickness: { control: { type: "range", min: 2, max: 16 } },
    amplitude: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    wavelength: { control: { type: "range", min: 8, max: 40 } },
    waveSpeed: { control: { type: "range", min: 0, max: 60 } },
    gap: { control: { type: "range", min: 0, max: 12 } },
    track: { control: "boolean" },
    animated: { control: "boolean" },
  },
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak every prop live from the controls panel. */
export const Playground: Story = {};

/** Wavy and flat, each determinate and indeterminate. */
export const Shapes: Story = {
  render: (args) => (
    <div className="gap-8 flex flex-wrap items-center">
      <CircularProgress {...args} shape="wavy" aria-label="Uploading" />
      <CircularProgress {...args} shape="flat" aria-label="Uploading" />
      <CircularProgress
        {...args}
        shape="wavy"
        value={undefined}
        aria-label="Connecting"
      />
      <CircularProgress
        {...args}
        shape="flat"
        value={undefined}
        aria-label="Connecting"
      />
    </div>
  ),
};

/**
 * 24–240dp. The wave count follows the circumference, so it always closes. Large
 * rings read best with a thicker stroke and a longer `wavelength` to match it.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="gap-6 flex flex-col">
      {[args.value, undefined].map((value) => (
        <div key={String(value)} className="gap-6 flex flex-wrap items-center">
          {[24, 32, 48, 72].map((size) => (
            <CircularProgress key={size} {...args} size={size} value={value} />
          ))}
          {[96, 160, 240].map((size) => (
            <CircularProgress
              key={size}
              {...args}
              size={size}
              value={value}
              thickness={6}
              wavelength={size / 4}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** 4dp is the default and 8dp the M3 thick sample, at 52dp. */
export const Thickness: Story = {
  render: (args) => (
    <div className="gap-8 flex flex-wrap items-center">
      {[4, 8, 12].map((thickness) => (
        <CircularProgress key={thickness} {...args} thickness={thickness} />
      ))}
      {[4, 8, 12].map((thickness) => (
        <CircularProgress
          key={thickness}
          {...args}
          thickness={thickness}
          value={undefined}
        />
      ))}
    </div>
  ),
};

/** The wave fades in after 10% and out by 95%; a dot marks first progress. */
export const ValueRange: Story = {
  render: (args) => (
    <div className="gap-6 flex flex-wrap items-center">
      {[0, 1, 5, 10, 11, 25, 50, 75, 94, 96, 100].map((value) => (
        <div key={value} className="gap-1 flex flex-col items-center">
          <CircularProgress {...args} value={value} />
          <span className="text-label-small text-on-surface-variant">
            {value}%
          </span>
        </div>
      ))}
    </div>
  ),
};

/** `value` changes ease over 500ms, retargeting smoothly mid-flight. */
export const Determinate: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(20);
    return (
      <div className="gap-4 flex flex-col items-center">
        <CircularProgress
          {...args}
          size={96}
          value={value}
          aria-label="Uploading"
        />
        <div className="gap-2 flex">
          <Button
            variant="tonal"
            size="xs"
            onClick={() => setValue(Math.max(value - 15, 0))}
          >
            −15
          </Button>
          <Button
            variant="tonal"
            size="xs"
            onClick={() => setValue(Math.min(value + 15, 100))}
          >
            +15
          </Button>
        </div>
      </div>
    );
  },
};

/** Set `value` once it's known: the arc turns back to the top and settles. */
export const IndeterminateToDeterminate: Story = {
  render: function Render(args) {
    const [run, setRun] = useState(0);
    const [value, setValue] = useState<number | undefined>(undefined);

    useEffect(() => {
      setValue(undefined);
      const known = setTimeout(() => setValue(30), 2600);
      const steps = [
        setTimeout(() => setValue(70), 3800),
        setTimeout(() => setValue(100), 5200),
      ];
      return () => [known, ...steps].forEach(clearTimeout);
    }, [run]);

    return (
      <div className="gap-4 flex flex-col items-center">
        <CircularProgress
          {...args}
          size={96}
          value={value}
          aria-label="Syncing"
        />
        <Button variant="tonal" size="xs" onClick={() => setRun(run + 1)}>
          Restart
        </Button>
      </div>
    );
  },
};

/** In buttons: flat, no track, and the label's color for 3:1 contrast. */
export const InButton: Story = {
  render: () => (
    <div className="gap-3 flex flex-wrap items-center">
      <Button
        loading
        loadingIndicator={
          <CircularProgress
            shape="flat"
            color="inherit"
            track={false}
            size={24}
            thickness={3}
          />
        }
      >
        Saving
      </Button>
      <Button
        variant="outlined"
        loading
        loadingPosition="start"
        loadingIndicator={
          <CircularProgress
            shape="flat"
            color="inherit"
            track={false}
            size={24}
            thickness={3}
          />
        }
      >
        Sending
      </Button>
    </div>
  ),
};

/** Re-theme per instance with `--md-comp-circular-progress-*`. */
export const CustomTokens: Story = {
  render: (args) => (
    <CircularProgress
      {...args}
      size={96}
      thickness={8}
      className="[--md-comp-circular-progress-active-indicator-color:var(--md-sys-color-tertiary)] [--md-comp-circular-progress-track-color:var(--md-sys-color-tertiary-container)]"
    />
  ),
};

/** Name the process and the content, e.g. with a visible label. */
export const Accessibility: Story = {
  render: (args) => (
    <div className="gap-3 flex items-center">
      <CircularProgress {...args} aria-labelledby="circular-episode" />
      <span id="circular-episode" className="text-body-large text-on-surface">
        Downloading episode 12
      </span>
    </div>
  ),
};
