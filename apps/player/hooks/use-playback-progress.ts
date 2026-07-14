import { useEffect, useState, type RefObject } from "react";
import type { YouTubePlayerHandle } from "@/components/youtube/youtube-player";

export function usePlaybackProgress(
  playerRef: RefObject<YouTubePlayerHandle | null>,
  playing: boolean,
  trackKey: string,
  fallbackDurationSec?: number | null,
) {
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(fallbackDurationSec ?? 0);

  useEffect(() => {
    setCurrent(0);
    setDuration(fallbackDurationSec ?? 0);
  }, [trackKey, fallbackDurationSec]);

  useEffect(() => {
    const tick = () => {
      const progress = playerRef.current?.getProgress();
      if (!progress) return;
      setCurrent(progress.current);
      if (progress.duration > 0) {
        setDuration(progress.duration);
      }
    };

    tick();
    if (!playing) return;

    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [playing, playerRef, trackKey]);

  const percent =
    duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return { current, duration, percent };
}
