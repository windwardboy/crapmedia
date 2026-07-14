export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];
export const PLAYBACK_RATE_STORAGE_KEY = "cm-playback-rate";

export function readStoredPlaybackRate(): PlaybackRate {
  if (typeof window === "undefined") return 1;
  const stored = Number(localStorage.getItem(PLAYBACK_RATE_STORAGE_KEY));
  if (PLAYBACK_RATES.includes(stored as PlaybackRate)) {
    return stored as PlaybackRate;
  }
  return 1;
}

export function storePlaybackRate(rate: PlaybackRate) {
  localStorage.setItem(PLAYBACK_RATE_STORAGE_KEY, String(rate));
}

export function nextPlaybackRate(current: PlaybackRate): PlaybackRate {
  const index = PLAYBACK_RATES.indexOf(current);
  const next = (index + 1) % PLAYBACK_RATES.length;
  return PLAYBACK_RATES[next];
}

export function formatPlaybackRate(rate: PlaybackRate): string {
  return rate === 1 ? "1×" : `${rate}×`;
}
