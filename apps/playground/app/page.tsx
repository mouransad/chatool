import { cn } from "@chatool/utils";

import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "@chatool/ui/button";
import ChatOutlined from "@chatool/icons/ChatOutlined";
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
    <section className="space-y-4 p-6 rounded-lg border bg-card text-card-foreground">
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

      {/* @chatool/ui — Button (client component, server-rendered here) */}
      <Section title="@chatool/ui — Button">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button disabled>
          <ProgressActivityOutlined className="animate-spin" />
          Loading
        </Button>
      </Section>

      {/* @chatool/icons */}
      <Section title="@chatool/icons">
        <ChatOutlined className="size-8" />
        <KeyboardArrowDownOutlined className="size-8 text-muted-foreground" />
        <ProgressActivityOutlined className="size-8 animate-spin text-primary" />
      </Section>

      {/* @chatool/utils — cn() composing conditional classes */}
      <Section title="@chatool/utils — cn()">
        <span
          className={cn(
            "px-3 py-1 text-sm rounded-md",
            true && "bg-accent text-accent-foreground",
            false && "hidden",
          )}
        >
          Built with cn()
        </span>
      </Section>
    </main>
  );
}
