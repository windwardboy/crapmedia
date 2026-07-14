"use client";

import { IconLoop, IconShuffle } from "@/components/playback/playback-icons";

type PlaybackModeControlsProps = {
  shuffle: boolean;
  loop: boolean;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
  size?: "default" | "large";
};

export function PlaybackModeControls({
  shuffle,
  loop,
  onToggleShuffle,
  onToggleLoop,
  size = "default",
}: PlaybackModeControlsProps) {
  const buttonClass =
    size === "large"
      ? "cm-btn cm-btn-outline h-14 w-14"
      : "cm-btn cm-btn-outline h-11 w-11";

  const iconClass = size === "large" ? "h-6 w-6" : "h-5 w-5";
  const activeClass = "ring-2 ring-cm-accent border-cm-accent text-cm-accent";

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onToggleShuffle}
        aria-pressed={shuffle}
        aria-label={shuffle ? "Shuffle on" : "Shuffle off"}
        className={`${buttonClass} ${shuffle ? activeClass : ""}`}
        title={shuffle ? "Shuffle on" : "Shuffle off"}
      >
        <IconShuffle className={iconClass} />
      </button>
      <button
        type="button"
        onClick={onToggleLoop}
        aria-pressed={loop}
        aria-label={loop ? "Loop on" : "Loop off"}
        className={`${buttonClass} ${loop ? activeClass : ""}`}
        title={loop ? "Loop on" : "Loop off"}
      >
        <IconLoop className={iconClass} />
      </button>
    </div>
  );
}
