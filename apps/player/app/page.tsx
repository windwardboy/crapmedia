import Link from "next/link";
import Image from "next/image";
import { AppNavShell } from "@/components/app-nav-shell";
import { ContinueListeningCard } from "@/components/continue-listening-card";
import { PwaInstallHint } from "@/components/pwa-install-hint";
import { SkinPickerLink } from "@/components/skin-picker";
import { getContinueListening } from "@/lib/playlists/queries";

export default async function HomePage() {
  const continueListening = await getContinueListening();

  return (
    <>
      <AppNavShell />
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
              YouTube playlists · Drive · Sleep
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              CrapMedia Player
            </h1>
            <p className="mt-2 max-w-lg text-cm-text-muted">
              Import playlists from YouTube, listen with video, drive with big
              controls, or sleep with a timer — no video distraction. Playback
              resumes where you left off.
            </p>
          </div>
        </div>

        {continueListening ? (
          <div className="mb-6">
            <ContinueListeningCard data={continueListening} />
          </div>
        ) : null}

        <PwaInstallHint />

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
            href="/sleep"
            className="cm-card block p-6 transition hover:border-cm-accent"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-cm-accent">
              Bedtime
            </div>
            <h2 className="mt-2 text-xl font-semibold">Sleep mode</h2>
            <p className="mt-2 text-sm text-cm-text-muted">
              Video-free listening with a sleep timer — stops when you doze off.
            </p>
          </Link>

          <Link
            href="/playlists"
            className="cm-card block p-6 transition hover:border-cm-accent sm:col-span-2"
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
