import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatoolProvider, useTheme } from "@chatool/core";

/**
 * Demonstrates the real app integration: `ChatoolProvider` owns the `.dark`
 * class and `useTheme` reads/sets the selection.
 */
function ThemeDemo() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const modes = ["light", "dark", "system"] as const;
  return (
    <div className="gap-4 p-6 flex flex-col items-center rounded-lg border border-border bg-card text-card-foreground">
      <p className="text-sm">
        selection: <code className="font-mono">{theme}</code> · resolved:{" "}
        <code className="font-mono">{resolvedTheme}</code>
      </p>
      <div className="gap-2 flex">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={`px-3 py-1 text-sm font-medium cursor-pointer rounded-md border capitalize transition-colors ${
              theme === mode
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <p className="max-w-xs text-xs text-center text-muted-foreground">
        The choice persists to <code>localStorage</code> and follows the OS in
        system mode — reload to see it restored.
      </p>
    </div>
  );
}

const meta = {
  title: "Core/ChatoolProvider",
  component: ThemeDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    themes: { disable: true },
  },
  decorators: [
    (Story) => (
      <ChatoolProvider>
        <Story />
      </ChatoolProvider>
    ),
  ],
} satisfies Meta<typeof ThemeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
