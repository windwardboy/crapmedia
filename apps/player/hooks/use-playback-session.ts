"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSavePlaybackPosition } from "@/hooks/use-save-playback-position";
import type { YouTubePlayerHandle } from "@/components/youtube/youtube-player";
import {
  isAutoSkippablePlaybackError,
  youtubePlayerErrorMessage,
} from "@/lib/youtube/player-errors";
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
  trackCount: number;
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
  trackCount,
}: UsePlaybackSessionOptions) {
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [skippedNotice, setSkippedNotice] = useState<string | null>(null);
  const autoSkipCountRef = useRef(0);
  const { resetPosition } = useSavePlaybackPosition(
    trackId,
    playerRef,
    playing,
    cacheResume,
  );

  useEffect(() => {
    setPlaybackError(null);
    setSkippedNotice(null);
  }, [videoId]);

  useEffect(() => {
    if (!playing || !videoId) return;
    const id = window.setTimeout(() => {
      autoSkipCountRef.current = 0;
    }, 3000);
    return () => window.clearTimeout(id);
  }, [videoId, playing]);

  const onPlayerError = useCallback(
    (code: number) => {
      const canAutoSkip =
        isAutoSkippablePlaybackError(code) &&
        hasNext &&
        autoSkipCountRef.current < trackCount;

      if (canAutoSkip) {
        autoSkipCountRef.current += 1;
        resetPosition();
        setPlaybackError(null);
        setSkippedNotice("Skipped unavailable track");
        goNext();
        return;
      }

      setSkippedNotice(null);
      setPlaybackError(youtubePlayerErrorMessage(code));
      setPlaying(false);
    },
    [hasNext, trackCount, resetPosition, goNext, setPlaying],
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
    skippedNotice,
    onPlayerError,
    onEnded,
    dismissError,
    skipOnError,
  };
}
