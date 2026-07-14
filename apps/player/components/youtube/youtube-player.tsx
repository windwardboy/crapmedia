"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoading: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoading) return apiLoading;

  apiLoading = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const poll = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(poll);
          resolve();
        }
      }, 50);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });

  return apiLoading;
}

export type YouTubePlayerHandle = {
  loadAndPlay: (videoId: string, startSeconds?: number) => void;
  play: () => void;
  pause: () => void;
  getProgress: () => { current: number; duration: number } | null;
};

type PendingLoad = {
  videoId: string;
  startSeconds: number;
  autoplay: boolean;
};

export const YouTubePlayer = forwardRef<
  YouTubePlayerHandle,
  {
    videoId: string;
    playing: boolean;
    startSeconds?: number;
    onEnded?: () => void;
    onError?: (code: number) => void;
    className?: string;
  }
>(function YouTubePlayer(
  { videoId, playing, startSeconds = 0, onEnded, onError, className },
  ref,
) {
  const elementId = useId().replace(/:/g, "");
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const playingRef = useRef(playing);
  const onEndedRef = useRef(onEnded);
  const onErrorRef = useRef(onError);
  const pendingRef = useRef<PendingLoad | null>(null);

  playingRef.current = playing;
  onEndedRef.current = onEnded;
  onErrorRef.current = onError;

  function applyLoad(load: PendingLoad) {
    const player = playerRef.current;
    if (!player || !readyRef.current) {
      pendingRef.current = load;
      return;
    }
    player.loadVideoById(load.videoId, load.startSeconds);
    if (load.autoplay) {
      player.playVideo();
    }
    pendingRef.current = null;
  }

  useImperativeHandle(ref, () => ({
    loadAndPlay(videoId: string, startSeconds = 0) {
      applyLoad({ videoId, startSeconds, autoplay: true });
    },
    play() {
      playerRef.current?.playVideo();
    },
    pause() {
      playerRef.current?.pauseVideo();
    },
    getProgress() {
      const player = playerRef.current;
      if (!player || !readyRef.current) return null;
      try {
        const duration = player.getDuration();
        const current = player.getCurrentTime();
        if (!Number.isFinite(duration) || !Number.isFinite(current)) {
          return null;
        }
        return { current, duration };
      } catch {
        return null;
      }
    },
  }));

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadYoutubeApi();
      if (cancelled || !window.YT) return;

      playerRef.current = new window.YT.Player(elementId, {
        videoId,
        playerVars: {
          autoplay: 0,
          ...(startSeconds > 0 ? { start: startSeconds } : {}),
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (pendingRef.current) {
              applyLoad(pendingRef.current);
            } else if (playingRef.current) {
              playerRef.current?.playVideo();
            }
          },
          onStateChange: (event) => {
            if (
              event.data === window.YT!.PlayerState.ENDED &&
              onEndedRef.current
            ) {
              onEndedRef.current();
            }
          },
          onError: (event) => {
            onErrorRef.current?.(event.data);
          },
        },
      });
    }

    init();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      readyRef.current = false;
      pendingRef.current = null;
    };
    // Only create the iframe once; track changes use loadVideoById via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId]);

  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    if (playing) playerRef.current.playVideo();
    else playerRef.current.pauseVideo();
  }, [playing]);

  return (
    <div
      className={className ?? "aspect-video w-full overflow-hidden rounded-xl"}
    >
      <div id={elementId} className="h-full w-full" />
    </div>
  );
});
