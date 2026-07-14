import type { Metadata, Viewport } from "next";
import "@crapmedia/ui/themes/charcoal";
import "@crapmedia/ui/themes/stone";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CrapMedia Player",
  description: "Your playlists. Your libraries. Driving-friendly playback.",
  applicationName: "CrapMedia Player",
  appleWebApp: {
    capable: true,
    title: "CrapMedia",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#00B87A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="charcoal" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
