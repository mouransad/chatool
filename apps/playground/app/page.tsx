import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@karnameh/ui/dropdown-menu";
import { cn } from "@karnameh/utils";

import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "@karnameh/ui/button";
import SvgKarnamehLogoIcon from "@karnameh/icons/KarnamehLogoIcon";
import SvgChevronDownIcon from "@karnameh/icons/ChevronDownIcon";
import SvgSpinnerIcon from "@karnameh/icons/SpinnerIcon";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 p-8">
      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <SvgKarnamehLogoIcon className="size-7 text-primary" />
          @karnameh/* playground
        </h1>
        <ThemeToggle />
      </header>

      {/* @karnameh/ui — Button (client component, server-rendered here) */}
      <Section title="@karnameh/ui — Button">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button disabled>
          <SvgSpinnerIcon className="animate-spin" />
          Loading
        </Button>
      </Section>

      {/* @karnameh/ui — DropdownMenu (exercises the internal icons too) */}
      <Section title="@karnameh/ui — DropdownMenu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Open menu
              <SvgChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>
              Notifications
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* @karnameh/icons */}
      <Section title="@karnameh/icons">
        <SvgKarnamehLogoIcon className="size-8" />
        <SvgChevronDownIcon className="size-8 text-muted-foreground" />
        <SvgSpinnerIcon className="size-8 animate-spin text-primary" />
      </Section>

      {/* @karnameh/utils — cn() composing conditional classes */}
      <Section title="@karnameh/utils — cn()">
        <span
          className={cn(
            "rounded-md px-3 py-1 text-sm",
            true && "bg-accent text-accent-foreground",
            false && "hidden",
          )}
        >
          Built with cn()
        </span>
      </Section>

      {/* @karnameh/api is wired in app/lib/services.ts (no live call). */}
      <p className="text-sm text-muted-foreground">
        <code>@karnameh/api</code> is wired in <code>app/lib/services.ts</code>{" "}
        — set <code>API_BASE_URL</code> and call a service from a Server
        Component to exercise a live request.
      </p>
    </main>
  );
}
