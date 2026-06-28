import type { CSSProperties } from "react";
import { cn } from "@chatool/utils";

import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import Fab from "@chatool/ui/fab";
import ButtonGroup from "@chatool/ui/button-group";
import ToggleButtonGroup, {
  ToggleButtonGroupItem,
} from "@chatool/ui/toggle-button-group";
import ChatOutlined from "@chatool/icons/ChatOutlined";
import AddOutlined from "@chatool/icons/AddOutlined";
import EditOutlined from "@chatool/icons/EditOutlined";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
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

      {/* Common buttons: variants, icons, loading */}
      <Section title="@chatool/ui — Button">
        <Button>Filled</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="elevated">Elevated</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button endIcon={<ArrowForwardOutlined />}>Next</Button>
        <Button loading>Loading</Button>
      </Section>

      {/* Colors + the per-instance --md-comp token override */}
      <Section title="Button — colors & component-token override">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="tertiary">Tertiary</Button>
        <Button color="error">Error</Button>
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

      {/* Icon buttons (incl. a toggle) */}
      <Section title="@chatool/ui — IconButton">
        <IconButton aria-label="Edit" variant="standard">
          <EditOutlined />
        </IconButton>
        <IconButton aria-label="Edit" variant="filled">
          <EditOutlined />
        </IconButton>
        <IconButton aria-label="Edit" variant="tonal">
          <EditOutlined />
        </IconButton>
        <IconButton aria-label="Edit" variant="outlined">
          <EditOutlined />
        </IconButton>
        <IconButton aria-label="Favorite" variant="outlined" defaultSelected>
          <FavoriteOutlined />
        </IconButton>
      </Section>

      {/* FAB */}
      <Section title="@chatool/ui — Fab">
        <Fab aria-label="Add">
          <AddOutlined />
        </Fab>
        <Fab aria-label="Add" color="tertiary" size="sm">
          <AddOutlined />
        </Fab>
        <Fab extended>
          <EditOutlined />
          Compose
        </Fab>
      </Section>

      {/* Button group (shared props + connected shape) */}
      <Section title="@chatool/ui — ButtonGroup">
        <ButtonGroup variant="connected" buttonVariant="outlined">
          <Button>Left</Button>
          <Button>Center</Button>
          <Button>Right</Button>
        </ButtonGroup>
      </Section>

      {/* Toggle / segmented selection */}
      <Section title="@chatool/ui — ToggleButtonGroup">
        <ToggleButtonGroup type="single" defaultValue="week">
          <ToggleButtonGroupItem value="day">Day</ToggleButtonGroupItem>
          <ToggleButtonGroupItem value="week">Week</ToggleButtonGroupItem>
          <ToggleButtonGroupItem value="month">Month</ToggleButtonGroupItem>
        </ToggleButtonGroup>
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
