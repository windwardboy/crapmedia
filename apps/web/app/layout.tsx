import type { Metadata } from "next";
import "@crapmedia/ui/themes/charcoal";
import "./globals.css";
import {
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Free driving-friendly media player`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "YouTube playlist player",
    "driving mode music player",
    "audiobook player",
    "PWA media player",
    "self-hosted music",
    "free music player",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName,
    title: `${siteName} — Play what you choose`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#00B87A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
  };

  return (
    <html lang="en" data-theme="charcoal">
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
