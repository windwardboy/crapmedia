import { useCallback, useEffect, useRef, type RefObject } from "react";
import { saveTrackPosition } from "@/app/playlists/playback-actions";
import type { YouTubePlayerHandle } from "@/components/youtube/youtube-player";

const SAVE_INTERVAL_MS = 15_000;
const MIN_DELTA_SEC = 3;

export function useSavePlaybackPosition(
  trackId: string | undefined,
  playerRef: RefObject<YouTubePlayerHandle | null>,
  playing: boolean,
  onSaved?: (trackId: string, positionSec: number) => void,
) {
  const lastSavedRef = useRef(0);
  const trackIdRef = useRef(trackId);
  const wasPlayingRef = useRef(false);

  const persist = useCallback(
    async (positionSec: number, force = false) => {
      if (!trackIdRef.current) return;
      const position = Math.max(0, Math.floor(positionSec));
      if (
        !force &&
        Math.abs(position - lastSavedRef.current) < MIN_DELTA_SEC
      ) {
        return;
      }
      lastSavedRef.current = position;
      await saveTrackPosition(trackIdRef.current, position);
      onSaved?.(trackIdRef.current, position);
    },
    [onSaved],
  );

  const flush = useCallback(
    (reset = false) => {
      if (!trackIdRef.current) return;
      if (reset) {
        lastSavedRef.current = 0;
        void saveTrackPosition(trackIdRef.current, 0);
        onSaved?.(trackIdRef.current, 0);
        return;
      }
      const progress = playerRef.current?.getProgress();
      if (!progress) return;
      void persist(progress.current, true);
    },
    [persist, playerRef, onSaved],
  );

  useEffect(() => {
    trackIdRef.current = trackId;
    lastSavedRef.current = 0;
  }, [trackId]);

  useEffect(() => {
    if (!trackId || !playing) return;

    const id = window.setInterval(() => {
      const progress = playerRef.current?.getProgress();
      if (!progress) return;
      void persist(progress.current);
    }, SAVE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [trackId, playing, persist, playerRef]);

  useEffect(() => {
    const wasPlaying = wasPlayingRef.current;
    wasPlayingRef.current = playing;
    if (wasPlaying && !playing && trackId) {
      flush();
    }
  }, [playing, trackId, flush]);

  useEffect(() => {
    if (!trackId) return;

    return () => {
      const progress = playerRef.current?.getProgress();
      if (!progress) return;
      void saveTrackPosition(trackId, Math.floor(progress.current));
    };
  }, [trackId, playerRef]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== "hidden") return;
      flush();
    };

    const onUnload = () => flush();

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onUnload);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onUnload);
    };
  }, [flush]);

  return { flush, resetPosition: () => flush(true) };
}
