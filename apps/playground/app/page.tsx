import type { CSSProperties } from "react";
import { cn } from "@chatool/utils";

import { ThemeToggle } from "./components/theme-toggle";
import { FormDemo } from "./components/form-demo";
import { Button } from "@chatool/ui/button";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";
import ProgressActivityOutlined from "@chatool/icons/ProgressActivityOutlined";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 p-6 rounded-lg border bg-surface-container text-on-surface">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint ? (
          <p className="text-body-medium text-on-surface-variant">{hint}</p>
        ) : null}
      </div>
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

      <p className="text-body-medium text-on-surface-variant">
        This page is a Server Component — every <code>Button</code> below
        renders on the server; only the press ripple hydrates on the client.
        Click any button to see the ripple + shape-morph.
      </p>

      {/* MD3 common button — the five styles (color is fixed per style) */}
      <Section
        title="Button — styles"
        hint="MD3 fixes color per style; there is no color prop."
      >
        <Button variant="filled">Filled</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </Section>

      {/* Sizes (XS–XL) */}
      <Section
        title="Button — sizes"
        hint="XS / S / M / L / XL = 32 / 40 / 56 / 96 / 136 dp."
      >
        <Button size="xs">XS</Button>
        <Button size="s">S</Button>
        <Button size="m">M</Button>
        <Button size="l">L</Button>
        <Button size="xl">XL</Button>
      </Section>

      {/* Shape — round (pill) / square, both morph corners on press */}
      <Section
        title="Button — shape"
        hint="Round (pill) and square; both morph their corners while pressed."
      >
        <Button shape="round">Round</Button>
        <Button shape="round" variant="tonal">
          Round
        </Button>
        <Button shape="square">Square</Button>
        <Button shape="square" variant="outlined">
          Square
        </Button>
      </Section>

      {/* Icons — leading / trailing / icon-only (needs aria-label) / menu */}
      <Section
        title="Button — icons"
        hint="Icon-only buttons must pass aria-label; menu buttons set aria-haspopup/aria-expanded."
      >
        <Button startIcon={<CheckOutlined />}>Leading</Button>
        <Button endIcon={<ArrowForwardOutlined />}>Trailing</Button>
        <Button>No icon</Button>
        <Button aria-label="Open chat" startIcon={<ChatOutlined />} />
        <Button
          variant="outlined"
          endIcon={<KeyboardArrowDownOutlined />}
          aria-haspopup="menu"
          aria-expanded={false}
        >
          Menu
        </Button>
      </Section>

      {/* Loading — non-actionable + aria-busy, keeps color + spinner */}
      <Section
        title="Button — loading"
        hint="A loading button is non-actionable (mouse + keyboard) and aria-busy, but keeps its color + spinner."
      >
        <Button loading loadingPosition="start">
          Start
        </Button>
        <Button loading loadingPosition="center">
          Center
        </Button>
        <Button loading loadingPosition="end">
          End
        </Button>
        <Button variant="tonal" loading>
          Tonal
        </Button>
        <Button
          loading
          loadingIndicator={
            <ProgressActivityOutlined className="animate-spin" />
          }
        >
          Custom spinner
        </Button>
      </Section>

      {/* Disabled — across the styles */}
      <Section
        title="Button — disabled"
        hint="Dimmed to 38% and non-interactive."
      >
        <Button disabled>Filled</Button>
        <Button variant="tonal" disabled>
          Tonal
        </Button>
        <Button variant="elevated" disabled>
          Elevated
        </Button>
        <Button variant="outlined" disabled>
          Outlined
        </Button>
        <Button variant="text" disabled>
          Text
        </Button>
      </Section>

      {/* asChild — render the styles onto a real link */}
      <Section
        title="Button — asChild (link)"
        hint="Renders styles onto your element via Radix Slot; pass a natively interactive element."
      >
        <Button asChild variant="text" endIcon={<ArrowForwardOutlined />}>
          <a href="https://m3.material.io" target="_blank" rel="noreferrer">
            Open the M3 spec
          </a>
        </Button>
        <Button asChild variant="outlined">
          <a href="#top">Back to top</a>
        </Button>
      </Section>

      {/* type=button (default) vs type=submit inside a form */}
      <Section
        title="Button — in a form"
        hint="Default type='button' never submits the form; only type='submit' does."
      >
        <FormDemo />
      </Section>

      {/* Per-instance component-token override (only this button re-themes) */}
      <Section
        title="Button — --md-comp-* override"
        hint="Per-instance theming via CSS vars; only this button re-themes."
      >
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
