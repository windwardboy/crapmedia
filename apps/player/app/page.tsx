import Link from "next/link";
import Image from "next/image";
import { AppNav } from "@/components/app-nav";
import { SkinPickerLink } from "@/components/skin-picker";

export default function HomePage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-start gap-4">
          <Image
            src="/icon.png"
            alt="CrapMedia"
            width={56}
            height={56}
            className="shrink-0"
          />
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cm-accent">
              YouTube playlists · Driving mode
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              CrapMedia Player
            </h1>
            <p className="mt-2 max-w-lg text-cm-text-muted">
              Import playlists from YouTube, listen with video, or drive with
              big controls and your default queue. Playback resumes where you
              left off.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/drive"
            className="cm-card block p-6 transition hover:border-cm-accent"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-cm-accent">
              Featured
            </div>
            <h2 className="mt-2 text-xl font-semibold">Driving mode</h2>
            <p className="mt-2 text-sm text-cm-text-muted">
              Large controls, wake lock, shuffle & loop — built for the car.
            </p>
          </Link>

          <Link
            href="/playlists"
            className="cm-card block p-6 transition hover:border-cm-accent"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-cm-accent">
              Library
            </div>
            <h2 className="mt-2 text-xl font-semibold">Playlists</h2>
            <p className="mt-2 text-sm text-cm-text-muted">
              Create queues, import from YouTube, set your driving default.
            </p>
          </Link>
        </div>

        <p className="mt-8 text-sm text-cm-text-muted">
          Appearance: Charcoal or Stone — <SkinPickerLink />
        </p>
      </main>
    </>
  );
}
