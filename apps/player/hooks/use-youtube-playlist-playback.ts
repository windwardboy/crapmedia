import { useCallback, useRef, useState } from "react";
import type { YouTubePlayerHandle } from "@/components/youtube/youtube-player";
import type { PlaylistTrack } from "@/lib/playlists/types";
import { videoIdFromTrack } from "@/lib/playlists/track-utils";

export function useYoutubePlaylistPlayback(tracks: PlaylistTrack[]) {
  const [index, setIndex] = useState(0);
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
    hasNext: index < tracks.length - 1,
    hasPrev: index > 0,
  };
}
