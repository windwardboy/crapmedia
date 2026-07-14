import { useCallback, useRef, useState } from "react";
import type { YouTubePlayerHandle } from "@/components/youtube/youtube-player";
import type { PlaylistTrack } from "@/lib/playlists/types";
import { videoIdFromTrack } from "@/lib/playlists/track-utils";

function shuffleIndices(length: number, startIndex: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const startPos = indices.indexOf(startIndex);
  if (startPos <= 0) return indices;
  return [...indices.slice(startPos), ...indices.slice(0, startPos)];
}

function shuffleIndicesAvoidFirst(length: number, avoidIndex: number): number[] {
  if (length <= 1) return [0];
  let order = shuffleIndices(length, 0);
  if (order[0] === avoidIndex) {
    const swapWith = 1 + Math.floor(Math.random() * (length - 1));
    [order[0], order[swapWith]] = [order[swapWith], order[0]];
  }
  return order;
}

export function useYoutubePlaylistPlayback(
  tracks: PlaylistTrack[],
  options?: { startTrackId?: string },
) {
  const initialIndex = tracks.findIndex((t) => t.id === options?.startTrackId);
  const [index, setIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[] | null>(null);
  const [shufflePos, setShufflePos] = useState(0);
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const resumeCacheRef = useRef<Record<string, number>>({});

  const track = tracks[index];
  const videoId = track ? videoIdFromTrack(track) : null;

  const resumeSec = useCallback((t: PlaylistTrack | undefined) => {
    if (!t) return 0;
    return resumeCacheRef.current[t.id] ?? t.last_position_sec ?? 0;
  }, []);

  const cacheResume = useCallback((trackId: string, sec: number) => {
    resumeCacheRef.current[trackId] = sec;
  }, []);

  const loadTrack = useCallback(
    (nextIndex: number, autoplay: boolean, nextShufflePos?: number) => {
      const t = tracks[nextIndex];
      const vid = t ? videoIdFromTrack(t) : null;
      if (!vid) return;
      setIndex(nextIndex);
      if (nextShufflePos !== undefined) {
        setShufflePos(nextShufflePos);
      }
      setPlaying(autoplay);
      if (autoplay) {
        playerRef.current?.loadAndPlay(vid, resumeSec(t));
      }
    },
    [tracks, resumeSec],
  );

  const advance = useCallback(
    (autoplay: boolean) => {
      if (tracks.length === 0) return false;

      if (shuffle && shuffleOrder) {
        const nextPos = shufflePos + 1;
        if (nextPos < shuffleOrder.length) {
          loadTrack(shuffleOrder[nextPos], autoplay, nextPos);
          return true;
        }
        if (loop) {
          if (tracks.length === 1) {
            loadTrack(index, autoplay, 0);
            return true;
          }
          const lastPlayed = shuffleOrder[shufflePos];
          const newOrder = shuffleIndicesAvoidFirst(tracks.length, lastPlayed);
          setShuffleOrder(newOrder);
          loadTrack(newOrder[0], autoplay, 0);
          return true;
        }
        return false;
      }

      if (index < tracks.length - 1) {
        loadTrack(index + 1, autoplay);
        return true;
      }
      if (loop) {
        loadTrack(0, autoplay);
        return true;
      }
      return false;
    },
    [tracks.length, shuffle, shuffleOrder, shufflePos, index, loop, loadTrack],
  );

  const goNext = useCallback(() => {
    advance(true);
  }, [advance]);

  const goPrev = useCallback(() => {
    if (tracks.length === 0) return;

    if (shuffle && shuffleOrder) {
      if (shufflePos > 0) {
        const prevPos = shufflePos - 1;
        loadTrack(shuffleOrder[prevPos], true, prevPos);
        return;
      }
      if (loop && tracks.length > 1) {
        const prevPos = shuffleOrder.length - 1;
        loadTrack(shuffleOrder[prevPos], true, prevPos);
      }
      return;
    }

    if (index > 0) {
      loadTrack(index - 1, true);
      return;
    }
    if (loop && tracks.length > 1) {
      loadTrack(tracks.length - 1, true);
    }
  }, [tracks.length, shuffle, shuffleOrder, shufflePos, index, loop, loadTrack]);

  const handleEnded = useCallback(() => {
    const advanced = advance(true);
    if (!advanced) setPlaying(false);
  }, [advance]);

  const togglePlay = useCallback(() => {
    if (!playing) {
      setPlaying(true);
      if (videoId) {
        playerRef.current?.loadAndPlay(videoId, resumeSec(track));
      } else {
        playerRef.current?.play();
      }
    } else {
      setPlaying(false);
      playerRef.current?.pause();
    }
  }, [playing, videoId, track, resumeSec]);

  const toggleShuffle = useCallback(() => {
    setShuffle((on) => {
      const next = !on;
      if (next) {
        const order = shuffleIndices(tracks.length, index);
        setShuffleOrder(order);
        setShufflePos(0);
      } else {
        setShuffleOrder(null);
        setShufflePos(0);
      }
      return next;
    });
  }, [tracks.length, index]);

  const toggleLoop = useCallback(() => {
    setLoop((on) => !on);
  }, []);

  const hasNext =
    tracks.length > 0 &&
    (loop ||
      (shuffle && shuffleOrder
        ? shufflePos < shuffleOrder.length - 1
        : index < tracks.length - 1));

  const hasPrev =
    tracks.length > 0 &&
    (loop ||
      (shuffle && shuffleOrder
        ? shufflePos > 0
        : index > 0));

  return {
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
  };
}
