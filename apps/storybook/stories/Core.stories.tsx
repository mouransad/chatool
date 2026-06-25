import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatoolProvider, useTheme } from "@chatool/core";
import Button from "@chatool/ui/button";

/**
 * Demonstrates the real app integration: `ChatoolProvider` owns the `.dark`
 * class and `useTheme` reads/sets the selection. The global toolbar theme
 * switch is disabled for this story (`themes: { disable: true }`) so the two
 * don't fight over the class.
 */
function ThemeDemo() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const modes = ["light", "dark", "system"] as const;
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 text-card-foreground">
      <p className="text-sm">
        selection: <code className="font-mono">{theme}</code> · resolved:{" "}
        <code className="font-mono">{resolvedTheme}</code>
      </p>
      <div className="flex gap-2">
        {modes.map((mode) => (
          <Button
            key={mode}
            size="sm"
            variant={theme === mode ? "default" : "outline"}
            onClick={() => setTheme(mode)}
            className="capitalize"
          >
            {mode}
          </Button>
        ))}
      </div>
      <p className="max-w-xs text-center text-xs text-muted-foreground">
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
