"use client";

import { SLEEP_TIMER_PRESETS_MIN } from "@/lib/sleep-timer";

type SleepTimerControlsProps = {
  active: boolean;
  countdownLabel: string | null;
  customMinutes: number;
  onCustomMinutesChange: (minutes: number) => void;
  onStartDuration: (minutes: number) => void;
  onStartEndOfTrack: () => void;
  onExtend: (minutes: number) => void;
  onCancel: () => void;
};

export function SleepTimerControls({
  active,
  countdownLabel,
  customMinutes,
  onCustomMinutesChange,
  onStartDuration,
  onStartEndOfTrack,
  onExtend,
  onCancel,
}: SleepTimerControlsProps) {
  return (
    <section
      className="mt-8 w-full max-w-md rounded-2xl border border-cm-border/60 bg-cm-bg-elevated/40 px-4 py-5"
      aria-label="Sleep timer"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-cm-accent">
          Sleep timer
        </h2>
        {active && countdownLabel ? (
          <p
            className="text-lg font-semibold tabular-nums text-cm-text"
            aria-live="polite"
          >
            {countdownLabel}
          </p>
        ) : null}
      </div>

      {active ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onExtend(15)}
            className="cm-btn cm-btn-outline min-h-12 px-4 text-sm"
          >
            +15 min
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cm-btn cm-btn-ghost min-h-12 px-4 text-sm text-cm-text-muted"
          >
            Cancel timer
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {SLEEP_TIMER_PRESETS_MIN.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => onStartDuration(min)}
                className="cm-btn cm-btn-outline min-h-12 text-sm"
              >
                {min}m
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <label className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-cm-border px-3 text-sm">
              <span className="shrink-0 text-cm-text-muted">Custom</span>
              <input
                type="number"
                min={1}
                max={1440}
                value={customMinutes}
                onChange={(e) =>
                  onCustomMinutesChange(Number(e.target.value) || 1)
                }
                className="w-full bg-transparent text-cm-text tabular-nums outline-none"
                aria-label="Custom minutes"
              />
            </label>
            <button
              type="button"
              onClick={() => onStartDuration(customMinutes)}
              className="cm-btn cm-btn-primary min-h-12 px-4 text-sm"
            >
              Start
            </button>
          </div>

          <button
            type="button"
            onClick={onStartEndOfTrack}
            className="cm-btn cm-btn-outline mt-3 min-h-12 w-full text-sm"
          >
            Stop at end of track
          </button>
        </>
      )}
    </section>
  );
}
