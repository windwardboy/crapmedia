"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WaveBars } from "@crapmedia/ui";
import { PlaybackModeControls } from "@/components/playback/playback-mode-controls";
import { usePlaybackProgress } from "@/hooks/use-playback-progress";
import { useYoutubePlaylistPlayback } from "@/hooks/use-youtube-playlist-playback";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import { formatDuration } from "@/lib/youtube/duration";
import type { Playlist, PlaylistTrack } from "@/lib/playlists/types";

export function DrivePlayer({
  playlist,
  tracks,
}: {
  playlist: Playlist;
  tracks: PlaylistTrack[];
}) {
  const {
    index,
    playing,
    track,
    videoId,
    playerRef,
    goNext,
    goPrev,
    togglePlay,
    handleEnded,
    shuffle,
    loop,
    toggleShuffle,
    toggleLoop,
    hasNext,
    hasPrev,
  } = useYoutubePlaylistPlayback(tracks);

  const { current, duration, percent } = usePlaybackProgress(
    playerRef,
    playing,
    `${videoId ?? ""}-${index}`,
    track?.duration_sec,
  );

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

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

  if (!track || !videoId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-cm-text-muted">
          No playable tracks in your driving playlist.
        </p>
        <Link
          href={`/playlists/${playlist.id}`}
          className="mt-4 text-sm text-cm-accent hover:underline"
        >
          Add YouTube tracks →
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hidden player — audio only in the car */}
      <div className="sr-only" aria-hidden>
        <YouTubePlayer
          ref={playerRef}
          videoId={videoId}
          playing={playing}
          startSeconds={track.last_position_sec ?? 0}
          onEnded={handleEnded}
        />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cm-accent">
          Now playing
        </p>
        <h1 className="max-w-md text-center text-2xl font-bold leading-tight sm:text-3xl">
          {track.title}
        </h1>
        <p className="mt-2 text-lg text-cm-text-muted">{track.artist}</p>
        <p className="mt-1 text-sm text-cm-text-muted">
          {playlist.name} · {index + 1} of {tracks.length}
        </p>

        <div className="my-10 flex w-full justify-center">
          <WaveBars className={playing ? "" : "paused"} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={!hasPrev}
              className="cm-btn cm-btn-transparent h-16 w-16 text-2xl disabled:opacity-40"
              aria-label="Previous"
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="cm-btn cm-btn-transparent h-20 w-20 text-3xl"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "⏸" : "▶"}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!hasNext}
              className="cm-btn cm-btn-transparent h-16 w-16 text-2xl disabled:opacity-40"
              aria-label="Next"
            >
              ⏭
            </button>
          </div>
          <PlaybackModeControls
            shuffle={shuffle}
            loop={loop}
            onToggleShuffle={toggleShuffle}
            onToggleLoop={toggleLoop}
            size="large"
          />
        </div>

        <div className="mt-8 w-full max-w-xs">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-cm-bg-subtle"
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Playback progress"
          >
            <div
              className="h-full rounded-full bg-cm-accent transition-[width] duration-300 ease-linear"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-cm-text-muted tabular-nums">
            <span>{formatDuration(Math.round(current))}</span>
            <span>{formatDuration(duration > 0 ? Math.round(duration) : null)}</span>
          </div>
        </div>

        <p className="mt-6 max-w-sm text-center text-xs text-cm-text-muted">
          {!playing
            ? "Tap play to start."
            : wakeLock
              ? "Screen wake lock active."
              : "Playing."}
        </p>
      </main>
    </>
  );
}
