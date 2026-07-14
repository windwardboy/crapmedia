"use client";

import Link from "next/link";
import { PlaybackErrorBanner } from "@/components/playback/playback-error-banner";
import { TransportControls } from "@/components/playback/transport-controls";
import { usePlaybackSession } from "@/hooks/use-playback-session";
import { useYoutubePlaylistPlayback } from "@/hooks/use-youtube-playlist-playback";
import { YouTubePlayer } from "@/components/youtube/youtube-player";
import { formatDuration } from "@/lib/youtube/duration";
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
    setPlaying,
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
    resumeSec,
    cacheResume,
  } = useYoutubePlaylistPlayback(tracks);

  const {
    playbackError,
    onPlayerError,
    onEnded,
    dismissError,
    skipOnError,
  } = usePlaybackSession({
    trackId: track?.id,
    videoId,
    playerRef,
    playing,
    setPlaying,
    handleEnded,
    hasNext,
    goNext,
    cacheResume,
  });

  if (!track || !videoId) {
    return (
      <p className="text-cm-text-muted">
        No playable YouTube tracks in this list.
      </p>
    );
  }

  const resumeAt = resumeSec(track);

  return (
    <div className="space-y-8">
      <YouTubePlayer
        ref={playerRef}
        videoId={videoId}
        playing={playing}
        startSeconds={resumeAt}
        onEnded={onEnded}
        onError={onPlayerError}
      />

      {playbackError ? (
        <PlaybackErrorBanner
          message={playbackError}
          hasNext={hasNext}
          onSkip={skipOnError}
          onDismiss={dismissError}
        />
      ) : null}

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
            {resumeAt >= 30
              ? `Resumes from ${formatDuration(resumeAt)} · tap play to continue`
              : "Tap play below to start (browser autoplay rules)."}
          </p>
        ) : null}
      </div>

      <TransportControls
        playing={playing}
        hasPrev={hasPrev}
        hasNext={hasNext}
        shuffle={shuffle}
        loop={loop}
        onPrev={goPrev}
        onNext={goNext}
        onTogglePlay={togglePlay}
        onToggleShuffle={toggleShuffle}
        onToggleLoop={toggleLoop}
      />

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
