"use client";

import Link from "next/link";
import { useYoutubePlaylistPlayback } from "@/hooks/use-youtube-playlist-playback";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import type { PlaylistTrack } from "@/lib/playlists/types";

export function PlaylistListenClient({
  playlistId,
  tracks,
}: {
  playlistId: string;
  tracks: PlaylistTrack[];
  startIndex?: number;
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
    hasNext,
    hasPrev,
  } = useYoutubePlaylistPlayback(tracks);

  if (!track || !videoId) {
    return (
      <p className="text-cm-text-muted">
        No playable YouTube tracks in this list.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <YouTubePlayer
        ref={playerRef}
        videoId={videoId}
        playing={playing}
        startSeconds={track.last_position_sec ?? 0}
        onEnded={hasNext ? goNext : undefined}
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
        {!playing ? (
          <p className="mt-2 text-xs text-cm-text-muted">
            Tap play below to start (browser autoplay rules).
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={!hasPrev}
          className="cm-btn cm-btn-ghost h-14 w-14 text-xl disabled:opacity-40"
          aria-label="Previous"
        >
          ⏮
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="cm-btn cm-btn-primary h-16 w-16 text-2xl"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!hasNext}
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
