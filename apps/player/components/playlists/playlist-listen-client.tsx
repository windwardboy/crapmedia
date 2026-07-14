"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  YouTubePlayer,
  type YouTubePlayerHandle,
} from "@/components/youtube/youtube-player";
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
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<YouTubePlayerHandle>(null);

  const track = tracks[index];
  const videoId = track ? videoIdFromTrack(track) : null;

  const loadTrack = useCallback(
    (nextIndex: number, autoplay: boolean) => {
      const t = tracks[nextIndex];
      const vid = t ? videoIdFromTrack(t) : null;
      if (!vid) return;
      setIndex(nextIndex);
      setPlaying(autoplay);
      if (autoplay) {
        playerRef.current?.loadAndPlay(vid, t.last_position_sec ?? 0);
      }
    },
    [tracks],
  );

  const goNext = useCallback(() => {
    if (index >= tracks.length - 1) return;
    loadTrack(index + 1, true);
  }, [index, tracks.length, loadTrack]);

  const goPrev = useCallback(() => {
    if (index <= 0) return;
    loadTrack(index - 1, true);
  }, [index, loadTrack]);

  const togglePlay = useCallback(() => {
    if (!playing) {
      setPlaying(true);
      if (videoId) {
        playerRef.current?.loadAndPlay(
          videoId,
          track?.last_position_sec ?? 0,
        );
      } else {
        playerRef.current?.play();
      }
    } else {
      setPlaying(false);
      playerRef.current?.pause();
    }
  }, [playing, videoId, track?.last_position_sec]);

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
          disabled={index === 0}
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
