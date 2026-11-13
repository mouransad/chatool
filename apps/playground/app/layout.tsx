import type { Metadata } from "next";
import { ChatoolProvider } from "@chatool/core";
import { SnackbarHost } from "@chatool/ui/snackbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "@chatool/* playground",
  description: "Internal playground for developing the @chatool/* packages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-on-surface antialiased">
        <ChatoolProvider>
          {children}
          {/* Shows every `snackbar(…)` call in the app, one at a time. */}
          <SnackbarHost />
        </ChatoolProvider>
      </body>
    </html>
  );
}
