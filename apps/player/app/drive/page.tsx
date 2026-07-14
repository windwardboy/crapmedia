"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { WaveBars } from "@crapmedia/ui";

export default function DrivePage() {
  const [playing, setPlaying] = useState(true);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  useEffect(() => {
    if (!playing) {
      setWakeLock(null);
      return;
    }

    let cancelled = false;
    let sentinel: WakeLockSentinel | null = null;

    async function acquire() {
      if (!("wakeLock" in navigator)) return;
      try {
        sentinel = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await sentinel.release();
          return;
        }
        setWakeLock(sentinel);
      } catch {
        /* unsupported or denied */
      }
    }

    acquire();

    return () => {
      cancelled = true;
      sentinel?.release().catch(() => {});
    };
  }, [playing]);

  return (
    <div className="flex min-h-dvh flex-col bg-cm-bg">
      <header className="flex items-center justify-between px-4 py-3 text-sm">
        <Link href="/" className="text-cm-text-muted hover:text-cm-text">
          ← Exit drive
        </Link>
        <span className="rounded-full bg-cm-accent-muted px-2 py-0.5 text-xs font-medium text-cm-accent">
          DEMO
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cm-accent">
          Now playing
        </p>
        <h1 className="max-w-md text-center text-2xl font-bold leading-tight sm:text-3xl">
          Joyride
        </h1>
        <p className="mt-2 text-lg text-cm-text-muted">Roxette</p>
        <p className="mt-1 text-sm text-cm-text-muted">Queue · 3 of 47</p>

        <div className="my-10 w-full max-w-xs">
          <WaveBars className={playing ? "" : "paused"} />
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="cm-btn cm-btn-ghost h-14 w-14 text-xl">
            ⏮
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="cm-btn cm-btn-primary h-20 w-20 text-2xl"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <button type="button" className="cm-btn cm-btn-ghost h-14 w-14 text-xl">
            ⏭
          </button>
        </div>

        <p className="mt-8 max-w-sm text-center text-xs text-cm-text-muted">
          {wakeLock
            ? "Screen wake lock active while playing."
            : "Wake lock applies when supported and playing."}
        </p>
      </main>
    </div>
  );
}
