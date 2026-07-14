import type { Metadata, Viewport } from "next";
import "@crapmedia/ui/themes/charcoal";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrapMedia",
  description: "Free, driving-friendly media playback. YouTube and your libraries.",
  icons: { icon: "/icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#00B87A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="charcoal">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
