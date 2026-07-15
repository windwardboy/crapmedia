import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { playerUrl, siteName } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy policy for ${siteName} — what we store and what we do not.`,
};

export default function PrivacyPage() {
  const updated = "July 2026";

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14 sm:py-20">
        <h1 className="text-3xl font-bold sm:text-4xl">Privacy policy</h1>
        <p className="mt-2 text-sm text-cm-text-muted">Last updated: {updated}</p>

        <div className="prose-cm mt-10 space-y-8 text-cm-text-muted">
          <section>
            <h2 className="text-lg font-semibold text-cm-text">Summary</h2>
            <p className="mt-2">
              {siteName} does not host your music or video files. We store
              playlist metadata and playback preferences when you use the
              player. This marketing site collects email addresses only if you
              opt in to launch updates.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cm-text">Player app</h2>
            <p className="mt-2">
              At{" "}
              <a href={playerUrl} className="text-cm-accent hover:underline">
                play.crapmedia.com
              </a>
              , you sign in with Google via Supabase Auth. We receive your
              Google account identifier and basic profile information needed for
              authentication (such as email and display name).
            </p>
            <p className="mt-3">
              We store playlists you create: track titles, YouTube video IDs,
              order, thumbnails, and resume positions. This data is tied to your
              account and protected by row-level security in our database.
            </p>
            <p className="mt-3">
              Playback streams directly from YouTube (or, in future, from
              library sources you configure). We do not proxy or record your
              streams.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cm-text">
              Marketing site &amp; interest sign-ups
            </h2>
            <p className="mt-2">
              If you submit your email on crapmedia.com, we store that address
              to send occasional project updates. You can ask us to remove it at
              any time by contacting the project maintainer via GitHub.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cm-text">Third parties</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-cm-text">Supabase</strong> — authentication
                and database hosting
              </li>
              <li>
                <strong className="text-cm-text">Google / YouTube</strong> —
                sign-in and video playback when you play YouTube tracks
              </li>
              <li>
                <strong className="text-cm-text">Vercel</strong> — website and
                player hosting
              </li>
            </ul>
            <p className="mt-3">
              Each provider has its own privacy policy governing their services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cm-text">Cookies</h2>
            <p className="mt-2">
              The player uses session cookies for authentication. This marketing
              site does not use analytics or advertising cookies at this time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cm-text">Changes</h2>
            <p className="mt-2">
              We may update this page as features ship. Material changes will be
              reflected in the date above.
            </p>
          </section>
        </div>

        <Link href="/" className="cm-btn-ghost mt-12 inline-flex px-6 py-3">
          ← Home
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
