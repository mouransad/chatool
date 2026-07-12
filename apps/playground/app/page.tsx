import { ThemeToggle } from "./components/theme-toggle";
import ChatOutlined from "@chatool/icons/ChatOutlined";

export default function Home() {
  return (
    <main className="max-w-3xl space-y-8 p-8 mx-auto flex min-h-screen flex-col justify-center">
      <header className="pb-6 flex items-center justify-between border-b border-border">
        <h1 className="gap-2 text-2xl font-bold tracking-tight flex items-center">
          <ChatOutlined className="size-7 text-primary" />
          @chatool/* playground
        </h1>
        <ThemeToggle />
      </header>

      <section className="space-y-4 py-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Welcome to the shadcn Workspace
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The monorepo has been migrated from Material Design 3 back to shadcn
          custom properties. Our theme configuration integrates directly with
          Tailwind CSS v4 variables.
        </p>
      </section>

      <section className="p-6 space-y-3 rounded-lg border border-border bg-card text-card-foreground">
        <h3 className="font-medium">Active Configuration: shadcn</h3>
        <p className="text-xs text-muted-foreground">
          Components in <code>@chatool/ui</code> are configured via{" "}
          <code>components.json</code> and style off CSS variables exposed by{" "}
          <code>@chatool/core</code>.
        </p>
        <div className="pt-2 gap-2 flex flex-wrap">
          <span className="px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground">
            --background
          </span>
          <span className="px-2 py-1 text-xs font-mono rounded bg-primary text-primary-foreground">
            --primary
          </span>
          <span className="px-2 py-1 text-xs font-mono rounded bg-secondary text-secondary-foreground">
            --secondary
          </span>
          <span className="px-2 py-1 text-xs font-mono rounded bg-accent text-accent-foreground">
            --accent
          </span>
          <span className="px-2 py-1 text-xs font-mono rounded border border-border text-foreground">
            --border
          </span>
        </div>
      </section>
    </main>
  );
}
