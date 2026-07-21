export const SLEEP_TIMER_PRESETS_MIN = [15, 30, 45, 60] as const;
export type SleepTimerPresetMin = (typeof SLEEP_TIMER_PRESETS_MIN)[number];

export const SLEEP_TIMER_LAST_DURATION_KEY = "cm-sleep-timer-last-min";
export const SLEEP_TIMER_LAST_MODE_KEY = "cm-sleep-timer-last-mode";

export type SleepTimerMode = "duration" | "end_of_track";

export function readLastSleepTimerMinutes(): number {
  if (typeof window === "undefined") return 30;
  const stored = Number(localStorage.getItem(SLEEP_TIMER_LAST_DURATION_KEY));
  if (Number.isFinite(stored) && stored >= 1 && stored <= 24 * 60) {
    return Math.round(stored);
  }
  return 30;
}

export function storeLastSleepTimerMinutes(minutes: number) {
  localStorage.setItem(SLEEP_TIMER_LAST_DURATION_KEY, String(minutes));
}

export function readLastSleepTimerMode(): SleepTimerMode {
  if (typeof window === "undefined") return "duration";
  const stored = localStorage.getItem(SLEEP_TIMER_LAST_MODE_KEY);
  return stored === "end_of_track" ? "end_of_track" : "duration";
}

export function storeLastSleepTimerMode(mode: SleepTimerMode) {
  localStorage.setItem(SLEEP_TIMER_LAST_MODE_KEY, mode);
}

/** Format remaining seconds as M:SS or H:MM:SS. */
export function formatCountdown(totalSeconds: number): string {
  const sec = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}
