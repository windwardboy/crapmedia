import Link from "next/link";
import { InterestForm } from "@/components/interest-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { githubUrl, playerUrl } from "@/lib/config";

const features = [
  {
    title: "YouTube playlists",
    body: "Import or build playlists from YouTube — audiobooks, mixes, long-form listening. Metadata is cached so you are not re-fetching on every play.",
  },
  {
    title: "Driving mode",
    body: "Large controls, screen wake lock, and a minimal full-screen UI designed for a mounted phone — not tiny buttons you cannot hit at 70 mph.",
  },
  {
    title: "Install as an app",
    body: "Add play.crapmedia.com to your home screen. Works like a native app without an app store.",
  },
  {
    title: "Your libraries, your rules",
    body: "Remote MP3 connectors are on the roadmap. Stream from your own hosting — CrapMedia never stores your media files.",
  },
  {
    title: "Resume where you left off",
    body: "Pick up mid-chapter or mid-playlist. Playback position is saved per track.",
  },
  {
    title: "Open source",
    body: "MIT licensed. Skins, connectors, and driving UX improvements welcome from the community.",
  },
];

const faqs = [
  {
    q: "Is CrapMedia a streaming service?",
    a: "No. We do not host music or video files. You play from YouTube or connect your own libraries. Think of it as a remote control for media you already have access to.",
  },
  {
    q: "Does it cost anything?",
    a: "The core player is free. There is no subscription wall for playback. The project may accept optional donations in future, but playback stays free.",
  },
  {
    q: "Can I use it now?",
    a: "Yes — the player at play.crapmedia.com is in early access. Sign in with Google, create playlists, and try driving mode. More library connectors are coming.",
  },
  {
    q: "What data do you store?",
    a: "If you use the player, we store your playlists and playback positions in Supabase — tied to your Google account. We do not store media files. See our privacy page for details.",
  },
  {
    q: "Why the name?",
    a: "Honest branding for a scrappy, low-maintenance project that does one job well — play what you choose, not what an algorithm feeds you.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-cm-accent">
            Early access · Free · Open source
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Play what you choose — not what an algorithm feeds you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cm-text-muted sm:text-xl">
            CrapMedia is a driving-friendly player for YouTube playlists and
            personal music libraries. No central media hosting. No subscription
            wall. Just a focused player at{" "}
            <a
              href={playerUrl}
              className="text-cm-accent hover:underline"
            >
              play.crapmedia.com
            </a>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={playerUrl} className="cm-btn-primary px-8 py-3.5 text-base">
              Try the player →
            </a>
            <Link href="/about" className="cm-btn-ghost px-8 py-3.5 text-base">
              Learn more
            </Link>
          </div>
        </section>

        <section className="border-y border-cm-border bg-cm-bg-elevated/40">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <InterestForm />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            <li>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cm-accent/15 text-sm font-bold text-cm-accent">
                1
              </span>
              <h3 className="mt-4 font-semibold">Sign in &amp; build playlists</h3>
              <p className="mt-2 text-sm text-cm-text-muted">
                Open the player, sign in with Google, and add YouTube videos or
                import a YouTube playlist URL.
              </p>
            </li>
            <li>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cm-accent/15 text-sm font-bold text-cm-accent">
                2
              </span>
              <h3 className="mt-4 font-semibold">Listen or drive</h3>
              <p className="mt-2 text-sm text-cm-text-muted">
                Use the standard player at your desk, or switch to driving mode
                for large controls and a distraction-free screen.
              </p>
            </li>
            <li>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cm-accent/15 text-sm font-bold text-cm-accent">
                3
              </span>
              <h3 className="mt-4 font-semibold">Pick up where you stopped</h3>
              <p className="mt-2 text-sm text-cm-text-muted">
                Resume mid-track next time. Your playlists and positions sync
                across sessions.
              </p>
            </li>
          </ol>
        </section>

        <section className="border-t border-cm-border bg-cm-bg-elevated/30">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="text-2xl font-bold sm:text-3xl">Built for real listening</h2>
            <p className="mt-3 max-w-2xl text-cm-text-muted">
              YouTube&apos;s app is fine for clips. It is less fine for a
              three-hour audiobook in the car. CrapMedia strips the UI down to
              what matters when you are listening, not scrolling.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="cm-card p-5"
                >
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-cm-text-muted">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">What we are not</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="cm-card p-6">
              <h3 className="font-semibold">Not a streaming service</h3>
              <p className="mt-2 text-sm text-cm-text-muted">
                We do not upload, transcode, or serve your files from our
                servers. YouTube streams from Google; your MP3s will stream from
                wherever you host them.
              </p>
            </div>
            <div className="cm-card p-6">
              <h3 className="font-semibold">Not another subscription</h3>
              <p className="mt-2 text-sm text-cm-text-muted">
                No paywall on playback. The goal is a sustainable free tool —
                optional community support may come later, not a monthly fee for
                basics.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-cm-border">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="text-2xl font-bold sm:text-3xl">Common questions</h2>
            <dl className="mt-10 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <dt className="font-semibold">{faq.q}</dt>
                  <dd className="mt-2 text-sm text-cm-text-muted">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-cm-border bg-cm-bg-elevated/40">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to listen?</h2>
            <p className="mx-auto mt-3 max-w-lg text-cm-text-muted">
              The player is live in early access. Works best on mobile — install
              it to your home screen for driving.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={playerUrl} className="cm-btn-primary px-8 py-3.5">
                Open play.crapmedia.com
              </a>
              <a
                href={githubUrl}
                className="cm-btn-ghost px-8 py-3.5"
                rel="noopener noreferrer"
                target="_blank"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
