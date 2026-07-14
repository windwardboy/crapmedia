"use client";

import { ThemeProvider } from "@crapmedia/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
