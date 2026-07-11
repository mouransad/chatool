import type { CSSProperties } from "react";
import { cn } from "@chatool/utils";

import { ThemeToggle } from "./components/theme-toggle";
import { FormDemo } from "./components/form-demo";
import {
  ButtonToggle,
  IconButtonToggle,
} from "./components/icon-button-toggle";
import { ButtonGroupSingleSelect } from "./components/button-group-demo";
import { Button } from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import ButtonGroup from "@chatool/ui/button-group";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import CheckOutlined from "@chatool/icons/CheckOutlined";
import ArrowForwardOutlined from "@chatool/icons/ArrowForwardOutlined";
import KeyboardArrowDownOutlined from "@chatool/icons/KeyboardArrowDownOutlined";
import ProgressActivityOutlined from "@chatool/icons/ProgressActivityOutlined";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import CloseOutlined from "@chatool/icons/CloseOutlined";
import SettingsOutlined from "@chatool/icons/SettingsOutlined";

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

      {/* Toggle — selected → aria-pressed + shape morph + leading-icon swap */}
      <Section
        title="Button — toggle"
        hint="Click to select: reflects aria-pressed, morphs round→square, swaps to the filled icon (outlined fills). Keep the label constant."
      >
        <ButtonToggle />
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

      {/* Icon button — the four MD3 styles (icon-only, color fixed per style) */}
      <Section
        title="Icon button — styles"
        hint="Icon-only buttons; each must pass aria-label. Color is fixed per style."
      >
        <IconButton variant="standard" aria-label="Favorite">
          <FavoriteOutlined />
        </IconButton>
        <IconButton variant="filled" aria-label="Settings">
          <SettingsOutlined />
        </IconButton>
        <IconButton variant="tonal" aria-label="Chat">
          <ChatOutlined />
        </IconButton>
        <IconButton variant="outlined" aria-label="Close">
          <CloseOutlined />
        </IconButton>
      </Section>

      {/* Icon button — sizes (square XS–XL) */}
      <Section
        title="Icon button — sizes"
        hint="Square containers on the same XS–XL scale as Button (32–136 dp)."
      >
        {(["xs", "s", "m", "l", "xl"] as const).map((size) => (
          <IconButton key={size} size={size} aria-label={`Favorite ${size}`}>
            <FavoriteOutlined />
          </IconButton>
        ))}
      </Section>

      {/* Icon button — shape (round circle / square, both morph on press) */}
      <Section
        title="Icon button — shape"
        hint="Round (circle) and square; both morph their corners while pressed."
      >
        <IconButton variant="tonal" shape="round" aria-label="Round">
          <FavoriteOutlined />
        </IconButton>
        <IconButton variant="tonal" shape="square" aria-label="Square">
          <FavoriteOutlined />
        </IconButton>
      </Section>

      {/* Icon button — toggle (selected → aria-pressed + shape morph + icon swap) */}
      <Section
        title="Icon button — toggle"
        hint="Click to select: reflects aria-pressed, morphs round→square, swaps to the filled icon. Keep the label constant."
      >
        <IconButtonToggle />
      </Section>

      {/* Icon button — loading / disabled */}
      <Section
        title="Icon button — loading / disabled"
        hint="Loading is non-actionable + aria-busy (keeps color); disabled dims to 38%."
      >
        <IconButton variant="filled" loading aria-label="Saving" />
        <IconButton variant="tonal" disabled aria-label="Favorite">
          <FavoriteOutlined />
        </IconButton>
      </Section>

      {/* Button group — standard (press squish: pressed expands, neighbors compress) */}
      <Section
        title="Button group — standard"
        hint="MD3 Expressive: press a button and it expands while its neighbors compress. Each child keeps its own shape."
      >
        <ButtonGroup aria-label="Document actions">
          <Button variant="filled">Save</Button>
          <Button variant="tonal">Duplicate</Button>
          <Button variant="outlined">Delete</Button>
        </ButtonGroup>
      </Section>

      {/* Button group — connected (tight 2dp cluster; children keep their radius) */}
      <Section
        title="Button group — connected"
        hint="Tight 2dp cluster. Children keep their own radius; the selected child morphs via its own smooth round→square animation."
      >
        <ButtonGroup variant="connected" aria-label="Range">
          <Button variant="tonal">Day</Button>
          <Button variant="tonal">Week</Button>
          <Button variant="tonal">Month</Button>
        </ButtonGroup>
        <ButtonGroup variant="connected" aria-label="Navigation">
          <IconButton variant="tonal" aria-label="Previous">
            <KeyboardArrowDownOutlined className="rotate-90" />
          </IconButton>
          <IconButton variant="tonal" aria-label="Menu">
            <SettingsOutlined />
          </IconButton>
          <IconButton variant="tonal" aria-label="Next">
            <KeyboardArrowDownOutlined className="-rotate-90" />
          </IconButton>
        </ButtonGroup>
      </Section>

      {/* Button group — vertical + single-select segmented (client island) */}
      <Section
        title="Button group — vertical / single-select"
        hint="Orientation flips the track axis. The single-select segmented control is a client island (selected children → aria-pressed)."
      >
        <ButtonGroup
          variant="connected"
          orientation="vertical"
          aria-label="Alignment"
        >
          <Button variant="tonal">Top</Button>
          <Button variant="tonal">Middle</Button>
          <Button variant="tonal">Bottom</Button>
        </ButtonGroup>
        <ButtonGroupSingleSelect />
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
