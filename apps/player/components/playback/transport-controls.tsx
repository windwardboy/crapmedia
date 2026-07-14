"use client";

import { PlaybackModeControls } from "@/components/playback/playback-mode-controls";
import {
  IconNext,
  IconPause,
  IconPlay,
  IconPrevious,
} from "@/components/playback/playback-icons";

type TransportControlsProps = {
  playing: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  shuffle: boolean;
  loop: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
  size?: "default" | "large";
};

const sizes = {
  default: {
    side: "h-14 w-14",
    play: "h-16 w-16",
    iconSide: "h-6 w-6",
    iconPlay: "h-7 w-7",
  },
  large: {
    side: "h-16 w-16",
    play: "h-20 w-20",
    iconSide: "h-7 w-7",
    iconPlay: "h-8 w-8",
  },
} as const;

export function TransportControls({
  playing,
  hasPrev,
  hasNext,
  shuffle,
  loop,
  onPrev,
  onNext,
  onTogglePlay,
  onToggleShuffle,
  onToggleLoop,
  size = "default",
}: TransportControlsProps) {
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={`cm-btn cm-btn-outline ${s.side} disabled:opacity-40`}
          aria-label="Previous"
        >
          <IconPrevious className={s.iconSide} />
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          className={`cm-btn cm-btn-primary ${s.play}`}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <IconPause className={s.iconPlay} />
          ) : (
            <IconPlay className={s.iconPlay} />
          )}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={`cm-btn cm-btn-outline ${s.side} disabled:opacity-40`}
          aria-label="Next"
        >
          <IconNext className={s.iconSide} />
        </button>
      </div>
      <PlaybackModeControls
        shuffle={shuffle}
        loop={loop}
        onToggleShuffle={onToggleShuffle}
        onToggleLoop={onToggleLoop}
        size={size}
      />
    </div>
  );
}
