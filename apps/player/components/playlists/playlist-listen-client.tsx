"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import type { PlaylistTrack } from "@/lib/playlists/types";

function videoIdFromTrack(track: PlaylistTrack): string | null {
  if (track.source_type !== "youtube") return null;
  const ref = track.source_ref as { videoId?: string };
  return ref.videoId ?? null;
}

export function PlaylistListenClient({
  playlistId,
  tracks,
  startIndex = 0,
}: {
  playlistId: string;
  tracks: PlaylistTrack[];
  startIndex?: number;
}) {
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(true);

  const track = tracks[index];
  const videoId = track ? videoIdFromTrack(track) : null;

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, tracks.length - 1));
    setPlaying(true);
  }, [tracks.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    setPlaying(true);
  }, []);

  if (!track || !videoId) {
    return (
      <p className="text-cm-text-muted">No playable YouTube tracks in this list.</p>
    );
  }

  return (
    <div className="space-y-8">
      <YouTubePlayer
        key={`${videoId}-${index}`}
        videoId={videoId}
        playing={playing}
        startSeconds={track.last_position_sec ?? 0}
        onEnded={index < tracks.length - 1 ? goNext : undefined}
      />

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-cm-accent">
          Now playing
        </p>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">{track.title}</h1>
        <p className="mt-1 text-cm-text-muted">{track.artist}</p>
        <p className="mt-1 text-sm text-cm-text-muted">
          {index + 1} of {tracks.length}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="cm-btn cm-btn-ghost h-14 w-14 text-xl disabled:opacity-40"
          aria-label="Previous"
        >
          ⏮
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="cm-btn cm-btn-primary h-16 w-16 text-2xl"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={index >= tracks.length - 1}
          className="cm-btn cm-btn-ghost h-14 w-14 text-xl disabled:opacity-40"
          aria-label="Next"
        >
          ⏭
        </button>
      </div>

      <p className="text-center text-sm">
        <Link
          href={`/playlists/${playlistId}`}
          className="text-cm-text-muted hover:text-cm-text"
        >
          ← Back to playlist
        </Link>
      </p>
    </div>
  );
}
