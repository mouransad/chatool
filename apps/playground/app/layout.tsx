import type { Metadata } from "next";
import { ChatoolProvider } from "@chatool/core";
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
        <ChatoolProvider>{children}</ChatoolProvider>
      </body>
    </html>
  );
}
