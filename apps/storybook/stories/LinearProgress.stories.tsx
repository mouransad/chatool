import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@chatool/ui/button";
import LinearProgress from "@chatool/ui/linear-progress";

const meta = {
  title: "UI/LinearProgress",
  component: LinearProgress,
  tags: ["autodocs"],
  args: { value: 60 },
  argTypes: {
    shape: { control: "inline-radio", options: ["wavy", "flat"] },
    color: { control: "inline-radio", options: ["primary", "inherit"] },
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: "number" },
    thickness: { control: { type: "range", min: 2, max: 16 } },
    amplitude: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    wavelength: { control: { type: "range", min: 12, max: 80 } },
    waveSpeed: { control: { type: "range", min: 0, max: 120 } },
    gap: { control: { type: "range", min: 0, max: 12 } },
    stop: { control: "boolean" },
    animated: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinearProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak every prop live from the controls panel. */
export const Playground: Story = {};

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="gap-2 flex flex-col">
    <span className="text-label-medium text-on-surface-variant">{label}</span>
    {children}
  </div>
);

/** Wavy and flat, each determinate and indeterminate. */
export const Shapes: Story = {
  render: (args) => (
    <div className="gap-6 flex flex-col">
      <Row label="Wavy">
        <LinearProgress {...args} shape="wavy" aria-label="Uploading" />
      </Row>
      <Row label="Flat">
        <LinearProgress {...args} shape="flat" aria-label="Uploading" />
      </Row>
      <Row label="Wavy, indeterminate">
        <LinearProgress
          {...args}
          shape="wavy"
          value={undefined}
          aria-label="Connecting"
        />
      </Row>
      <Row label="Flat, indeterminate">
        <LinearProgress
          {...args}
          shape="flat"
          value={undefined}
          aria-label="Connecting"
        />
      </Row>
    </div>
  ),
};

/** 4dp is the default and 8dp the M3 thick sample; wavy adds 6dp of height. */
export const Thickness: Story = {
  render: (args) => (
    <div className="gap-6 flex flex-col">
      {[4, 8, 12].map((thickness) => (
        <Row key={thickness} label={`${thickness}dp`}>
          <LinearProgress {...args} thickness={thickness} />
          <LinearProgress {...args} thickness={thickness} shape="flat" />
          <LinearProgress {...args} thickness={thickness} value={undefined} />
        </Row>
      ))}
    </div>
  ),
};

/**
 * The wave fades in after 10% and out by 95%. A dot marks the first bit of
 * progress, and the stop dot is eaten by the arriving bar.
 */
export const ValueRange: Story = {
  render: (args) => (
    <div className="gap-4 flex flex-col">
      {[0, 1, 5, 10, 11, 50, 94, 96, 99, 100].map((value) => (
        <Row key={value} label={`${value}%`}>
          <LinearProgress {...args} value={value} />
        </Row>
      ))}
    </div>
  ),
};

/** `value` changes ease over 500ms, retargeting smoothly mid-flight. */
export const Determinate: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(20);
    return (
      <div className="gap-4 flex flex-col">
        <LinearProgress {...args} value={value} aria-label="Uploading" />
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

/** Set `value` once it's known: the lines run off, and the bar draws itself in. */
export const IndeterminateToDeterminate: Story = {
  render: function Render(args) {
    const [run, setRun] = useState(0);
    const [value, setValue] = useState<number | undefined>(undefined);

    useEffect(() => {
      setValue(undefined);
      const known = setTimeout(() => setValue(25), 2600);
      const steps = [
        setTimeout(() => setValue(60), 3800),
        setTimeout(() => setValue(100), 5200),
      ];
      return () => [known, ...steps].forEach(clearTimeout);
    }, [run]);

    return (
      <div className="gap-4 flex flex-col">
        <LinearProgress {...args} value={value} aria-label="Syncing" />
        <Button
          variant="tonal"
          size="xs"
          className="self-start"
          onClick={() => setRun(run + 1)}
        >
          Restart
        </Button>
      </div>
    );
  },
};

/** Mirrored in right-to-left languages, automatically. */
export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl" className="gap-6 flex flex-col">
      <LinearProgress {...args} />
      <LinearProgress {...args} shape="flat" />
      <LinearProgress {...args} value={undefined} />
    </div>
  ),
};

/** On the edge of a container that's loading. */
export const InACard: Story = {
  render: (args) => (
    <div className="overflow-hidden rounded-xl bg-surface-container">
      <LinearProgress {...args} value={undefined} shape="flat" />
      <div className="p-6 text-body-medium text-on-surface">
        Loading episodes…
      </div>
    </div>
  ),
};

/** Re-theme per instance with `--md-comp-linear-progress-*`. */
export const CustomTokens: Story = {
  render: (args) => (
    <LinearProgress
      {...args}
      thickness={8}
      className="[--md-comp-linear-progress-active-indicator-color:var(--md-sys-color-tertiary)] [--md-comp-linear-progress-stop-indicator-color:var(--md-sys-color-tertiary)] [--md-comp-linear-progress-track-color:var(--md-sys-color-tertiary-container)]"
    />
  ),
};

/** Name the process and the content, e.g. with a visible label. */
export const Accessibility: Story = {
  render: (args) => (
    <div className="gap-2 flex flex-col">
      <span id="linear-episode" className="text-body-large text-on-surface">
        Downloading episode 12
      </span>
      <LinearProgress
        {...args}
        aria-labelledby="linear-episode"
        aria-valuetext={`${args.value} percent, about a minute left`}
      />
    </div>
  ),
};
