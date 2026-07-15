import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { githubUrl, playerUrl, siteDescription, siteName } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `What ${siteName} is, why it exists, and where the project is headed.`,
};

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14 sm:py-20">
        <h1 className="text-3xl font-bold sm:text-4xl">About CrapMedia</h1>
        <p className="mt-4 text-lg text-cm-text-muted">{siteDescription}</p>

        <section className="mt-12 space-y-4 text-cm-text-muted">
          <h2 className="text-xl font-semibold text-cm-text">The problem</h2>
          <p>
            YouTube is everywhere, but its interface is built for discovery and
            engagement — not for listening to a ten-hour audiobook on a long
            drive. Existing music apps often want a subscription and their own
            catalogue. Personal MP3 collections live on shared hosting, NAS
            boxes, and old PHP scripts that still work fine but look like 2009.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-cm-text-muted">
          <h2 className="text-xl font-semibold text-cm-text">The approach</h2>
          <p>
            CrapMedia is a thin player layer: playlists, queue controls, driving
            mode, and resume — streaming from sources you already use. YouTube
            via the official iframe API today; self-hosted MP3 libraries via
            pluggable connectors tomorrow.
          </p>
          <p>
            We deliberately do not host media. That keeps costs low, keeps legal
            complexity manageable, and keeps you in control of your library.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-cm-text-muted">
          <h2 className="text-xl font-semibold text-cm-text">Project status</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-cm-text">Live now:</strong> Google sign-in,
              YouTube playlists, listen mode, driving mode, resume playback,
              PWA install, embed-blocked track detection
            </li>
            <li>
              <strong className="text-cm-text">Next up:</strong> HTTP connector
              for self-hosted MP3 libraries and mixed playlists
            </li>
            <li>
              <strong className="text-cm-text">Later:</strong> voice commands,
              Subsonic/Navirome connectors, optional AI assist (rate-limited,
              never required)
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-4 text-cm-text-muted">
          <h2 className="text-xl font-semibold text-cm-text">Open source</h2>
          <p>
            CrapMedia is MIT licensed. Skins, library connectors, and driving UX
            improvements are welcome. See the repo on{" "}
            <a
              href={githubUrl}
              className="text-cm-accent hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-4">
          <a href={playerUrl} className="cm-btn-primary px-6 py-3">
            Open the player
          </a>
          <Link href="/" className="cm-btn-ghost px-6 py-3">
            ← Home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
