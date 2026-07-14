"use client";

import { ThemeProvider } from "@crapmedia/ui";
import { OfflineBanner } from "@/components/offline-banner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <OfflineBanner />
      {children}
    </ThemeProvider>
  );
}
