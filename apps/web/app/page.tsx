import Image from "next/image";
import Link from "next/link";

const playerUrl =
  process.env.NEXT_PUBLIC_PLAYER_URL ?? "http://localhost:3001";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Image src="/icon.png" alt="" width={36} height={36} />
          <span className="text-lg font-bold">CrapMedia</span>
        </div>
        <a
          href={playerUrl}
          className="cm-btn-primary px-5 py-2.5 text-sm"
        >
          Open Player
        </a>
      </header>

      <main className="mx-auto flex flex-1 w-full max-w-4xl flex-col justify-center px-6 pb-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-cm-accent">
          Free · Open source · Donation supported
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Play what you choose — not what an algorithm feeds you.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-cm-text-muted">
          CrapMedia is a driving-friendly player for YouTube playlists and your
          own MP3 libraries. No media hosting. No subscription wall.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href={playerUrl} className="cm-btn-primary px-8 py-3 text-base">
            Open Player →
          </a>
          <Link
            href="https://github.com"
            className="cm-btn-ghost px-8 py-3 text-base"
          >
            GitHub (soon)
          </Link>
        </div>

        <ul className="mt-14 grid gap-4 text-sm text-cm-text-muted sm:grid-cols-3">
          <li className="rounded-xl border border-cm-border bg-cm-bg-elevated p-4">
            <strong className="block text-cm-text">play.crapmedia.com</strong>
            Playlists & driving mode
          </li>
          <li className="rounded-xl border border-cm-border bg-cm-bg-elevated p-4">
            <strong className="block text-cm-text">Your libraries</strong>
            YouTube + remote MP3 connectors
          </li>
          <li className="rounded-xl border border-cm-border bg-cm-bg-elevated p-4">
            <strong className="block text-cm-text">PWA</strong>
            Install on your mounted phone
          </li>
        </ul>
      </main>

      <footer className="border-t border-cm-border px-6 py-8 text-center text-sm text-cm-text-muted">
        <p>Work in progress · MIT licensed · Support link coming soon</p>
      </footer>
    </div>
  );
}
