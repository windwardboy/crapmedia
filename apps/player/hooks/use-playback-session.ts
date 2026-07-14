"use client";

import { useCallback, useEffect, useState } from "react";
import { PlaybackErrorBanner } from "@/components/playback/playback-error-banner";
import { useSavePlaybackPosition } from "@/hooks/use-save-playback-position";
import type { YouTubePlayerHandle } from "@/components/youtube/youtube-player";
import { youtubePlayerErrorMessage } from "@/lib/youtube/player-errors";
import type { RefObject } from "react";

type UsePlaybackSessionOptions = {
  trackId: string | undefined;
  videoId: string | null;
  playerRef: RefObject<YouTubePlayerHandle | null>;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  handleEnded: () => void;
  hasNext: boolean;
  goNext: () => void;
  cacheResume: (trackId: string, sec: number) => void;
};

export function usePlaybackSession({
  trackId,
  videoId,
  playerRef,
  playing,
  setPlaying,
  handleEnded,
  hasNext,
  goNext,
  cacheResume,
}: UsePlaybackSessionOptions) {
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const { resetPosition } = useSavePlaybackPosition(
    trackId,
    playerRef,
    playing,
    cacheResume,
  );

  useEffect(() => {
    setPlaybackError(null);
  }, [videoId]);

  const onPlayerError = useCallback(
    (code: number) => {
      setPlaybackError(youtubePlayerErrorMessage(code));
      setPlaying(false);
    },
    [setPlaying],
  );

  const onEnded = useCallback(() => {
    resetPosition();
    handleEnded();
  }, [resetPosition, handleEnded]);

  const dismissError = useCallback(() => {
    setPlaybackError(null);
  }, []);

  const skipOnError = useCallback(() => {
    setPlaybackError(null);
    if (hasNext) goNext();
  }, [hasNext, goNext]);

  return {
    playbackError,
    onPlayerError,
    onEnded,
    dismissError,
    skipOnError,
  };
}
