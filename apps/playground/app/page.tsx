import type { CSSProperties } from "react";
import { cn } from "@chatool/utils";

import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "@chatool/ui/button";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";
import ProgressActivityOutlined from "@chatool/icons/ProgressActivityOutlined";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 p-6 rounded-lg border bg-surface-container text-on-surface">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="gap-3 flex flex-wrap items-center">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="max-w-3xl space-y-8 p-8 mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="gap-2 text-2xl font-bold flex items-center">
          <ChatOutlined className="size-7 text-primary" />
          @chatool/* playground
        </h1>
        <ThemeToggle />
      </header>

      {/* MD3 common button — the five styles (color is fixed per style) */}
      <Section title="@chatool/ui — Button (styles)">
        <Button variant="filled">Filled</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </Section>

      {/* Sizes (XS–XL) */}
      <Section title="Button — sizes">
        <Button size="xs">XS</Button>
        <Button size="s">S</Button>
        <Button size="m">M</Button>
        <Button size="l">L</Button>
      </Section>

      {/* Shape (round/square, morphs on press), icons, loading */}
      <Section title="Button — shape, icons, loading">
        <Button shape="round">Round</Button>
        <Button shape="square">Square</Button>
        <Button startIcon={<CheckOutlined />}>Leading</Button>
        <Button endIcon={<ArrowForwardOutlined />}>Trailing</Button>
        <Button loading>Loading</Button>
      </Section>

      {/* Per-instance component-token override (only this button re-themes) */}
      <Section title="Button — --md-comp-* override">
        <Button>Default</Button>
        <Button
          style={
            {
              "--md-comp-button-container-color": "#006971",
              "--md-comp-button-label-text-color": "#ffffff",
            } as CSSProperties
          }
        >
          Custom token
        </Button>
      </Section>

      {/* @chatool/icons */}
      <Section title="@chatool/icons">
        <ChatOutlined className="size-8" />
        <KeyboardArrowDownOutlined className="size-8 text-on-surface-variant" />
        <ProgressActivityOutlined className="size-8 animate-spin text-primary" />
      </Section>

      {/* @chatool/utils — cn() composing conditional classes */}
      <Section title="@chatool/utils — cn()">
        <span
          className={cn(
            "px-3 py-1 text-sm rounded-md",
            true && "bg-secondary-container text-on-secondary-container",
            false && "hidden",
          )}
        >
          Built with cn()
        </span>
      </Section>
    </main>
  );
}
