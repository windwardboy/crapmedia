"use client";

import { useCallback, useEffect, useState } from "react";
import {
  formatPlaybackRate,
  nextPlaybackRate,
  readStoredPlaybackRate,
  storePlaybackRate,
  type PlaybackRate,
} from "@/lib/playback-rate";
import type { YouTubePlayerHandle } from "@/components/youtube/youtube-player";
import type { RefObject } from "react";

export function usePlaybackRate(
  playerRef: RefObject<YouTubePlayerHandle | null>,
  trackKey: string,
) {
  const [rate, setRate] = useState<PlaybackRate>(1);

  useEffect(() => {
    setRate(readStoredPlaybackRate());
  }, []);

  useEffect(() => {
    playerRef.current?.setPlaybackRate(rate);
  }, [rate, trackKey, playerRef]);

  const cycleRate = useCallback(() => {
    setRate((current) => {
      const next = nextPlaybackRate(current);
      storePlaybackRate(next);
      playerRef.current?.setPlaybackRate(next);
      return next;
    });
  }, [playerRef]);

  return { rate, cycleRate, rateLabel: formatPlaybackRate(rate) };
}
