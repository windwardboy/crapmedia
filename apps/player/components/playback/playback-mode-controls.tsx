"use client";

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
      ? "cm-btn cm-btn-transparent h-14 w-14 text-xl"
      : "cm-btn cm-btn-transparent h-11 w-11 text-base";

  const activeClass = "ring-2 ring-cm-accent text-cm-accent bg-transparent";

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
        🔀
      </button>
      <button
        type="button"
        onClick={onToggleLoop}
        aria-pressed={loop}
        aria-label={loop ? "Loop on" : "Loop off"}
        className={`${buttonClass} ${loop ? activeClass : ""}`}
        title={loop ? "Loop on" : "Loop off"}
      >
        🔁
      </button>
    </div>
  );
}
