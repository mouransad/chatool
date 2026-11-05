import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@chatool/ui/button";
import LoadingIndicator from "@chatool/ui/loading-indicator";

const meta = {
  title: "UI/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  argTypes: {
    contained: { control: "boolean" },
    color: { control: "inline-radio", options: ["primary", "inherit"] },
    size: { control: { type: "range", min: 24, max: 240, step: 4 } },
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: "number" },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tweak every prop live from the controls panel. */
export const Playground: Story = {};

/** Default sits straight on a surface; contained stands out over other content. */
export const Variants: Story = {
  render: (args) => (
    <div className="gap-6 flex items-center">
      <LoadingIndicator {...args} aria-label="Loading messages" />
      <LoadingIndicator {...args} contained aria-label="Refreshing feed" />
    </div>
  ),
};

/** 24–240dp; the 38/48 active-indicator ratio holds at every size. */
export const Sizes: Story = {
  render: (args) => (
    <div className="gap-6 flex flex-wrap items-center">
      {[24, 32, 48, 72, 96, 160, 240].map((size) => (
        <LoadingIndicator key={size} {...args} size={size} contained />
      ))}
    </div>
  ),
};

/** Any `size-*` utility works too. */
export const SizedWithClassName: Story = {
  render: (args) => <LoadingIndicator {...args} className="size-20" />,
};

/**
 * With a `value`, the circle morphs into the soft burst and turns back a half
 * rotation — the pull-to-refresh gesture. Drag to scrub.
 */
export const Determinate: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(35);
    return (
      <div className="gap-4 w-72 flex flex-col items-center">
        <LoadingIndicator
          {...args}
          contained
          size={96}
          value={value}
          aria-label="Pull to refresh"
        />
        <input
          type="range"
          aria-label="Value"
          className="w-full accent-primary"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
    );
  },
};

/** A pull-to-refresh sketch: the pull scrubs the morph, release loops it. */
export const PullToRefresh: Story = {
  render: function Render() {
    const [pull, setPull] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const start = useRef<number | null>(null);

    useEffect(() => {
      if (!refreshing) return;
      const timer = setTimeout(() => {
        setRefreshing(false);
        setPull(0);
      }, 2400);
      return () => clearTimeout(timer);
    }, [refreshing]);

    return (
      <div
        className="w-72 h-96 relative touch-none overflow-hidden rounded-xl bg-surface-container select-none"
        onPointerDown={(event) => {
          if (refreshing) return;
          start.current = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (start.current === null) return;
          setPull(Math.max(0, Math.min(event.clientY - start.current, 120)));
        }}
        onPointerUp={() => {
          start.current = null;
          if (pull >= 90) setRefreshing(true);
          else setPull(0);
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: refreshing ? 16 : pull - 48 }}
        >
          {refreshing ? (
            <LoadingIndicator contained aria-label="Refreshing" />
          ) : (
            <LoadingIndicator
              contained
              value={pull}
              max={90}
              aria-label="Pull to refresh"
            />
          )}
        </div>
        <p className="inset-0 p-6 absolute flex items-center justify-center text-center text-body-medium text-on-surface-variant">
          Drag down past the threshold, then let go
        </p>
      </div>
    );
  },
};

/** Inside a button, take the label's color so contrast holds on any style. */
export const InButton: Story = {
  render: () => (
    <div className="gap-3 flex flex-wrap items-center">
      <Button
        loading
        loadingIndicator={<LoadingIndicator color="inherit" size={24} />}
      >
        Saving
      </Button>
      <Button
        variant="tonal"
        loading
        loadingPosition="start"
        loadingIndicator={<LoadingIndicator color="inherit" size={24} />}
      >
        Checking for updates
      </Button>
    </div>
  ),
};

/** Re-theme per instance with `--md-comp-loading-indicator-*`. */
export const CustomTokens: Story = {
  render: () => (
    <LoadingIndicator
      contained
      size={96}
      className="[--md-comp-loading-indicator-active-indicator-color:var(--md-sys-color-on-tertiary-container)] [--md-comp-loading-indicator-container-color:var(--md-sys-color-tertiary-container)]"
    />
  ),
};

/** Name what's loading. It defaults to "Loading" for a safe fallback. */
export const Accessibility: Story = {
  render: () => (
    <div className="gap-3 flex items-center">
      <LoadingIndicator aria-labelledby="loading-news" />
      <span id="loading-news" className="text-body-large text-on-surface">
        Loading news article
      </span>
    </div>
  ),
};
