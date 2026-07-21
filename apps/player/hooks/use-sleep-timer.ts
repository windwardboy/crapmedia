"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatCountdown,
  readLastSleepTimerMinutes,
  storeLastSleepTimerMinutes,
  storeLastSleepTimerMode,
  type SleepTimerMode,
} from "@/lib/sleep-timer";

type UseSleepTimerOptions = {
  onExpire: () => void;
};

type SleepTimerState =
  | { status: "idle" }
  | { status: "running"; mode: "duration"; endsAt: number; minutes: number }
  | { status: "running"; mode: "end_of_track" };

export function useSleepTimer({ onExpire }: UseSleepTimerOptions) {
  const [state, setState] = useState<SleepTimerState>({ status: "idle" });
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState(30);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setCustomMinutes(readLastSleepTimerMinutes());
  }, []);

  const clear = useCallback(() => {
    setState({ status: "idle" });
    setRemainingSec(null);
  }, []);

  const startDuration = useCallback((minutes: number) => {
    const clamped = Math.min(24 * 60, Math.max(1, Math.round(minutes)));
    storeLastSleepTimerMinutes(clamped);
    storeLastSleepTimerMode("duration");
    setCustomMinutes(clamped);
    const endsAt = Date.now() + clamped * 60 * 1000;
    setState({ status: "running", mode: "duration", endsAt, minutes: clamped });
    setRemainingSec(clamped * 60);
  }, []);

  const startEndOfTrack = useCallback(() => {
    storeLastSleepTimerMode("end_of_track");
    setState({ status: "running", mode: "end_of_track" });
    setRemainingSec(null);
  }, []);

  const extend = useCallback((extraMinutes: number) => {
    setState((prev) => {
      if (prev.status !== "running" || prev.mode !== "duration") return prev;
      const addMs = Math.max(1, Math.round(extraMinutes)) * 60 * 1000;
      const endsAt = prev.endsAt + addMs;
      setRemainingSec(Math.max(0, (endsAt - Date.now()) / 1000));
      return { ...prev, endsAt };
    });
  }, []);

  useEffect(() => {
    if (state.status !== "running" || state.mode !== "duration") return;

    const tick = () => {
      const left = (state.endsAt - Date.now()) / 1000;
      if (left <= 0) {
        setState({ status: "idle" });
        setRemainingSec(null);
        onExpireRef.current();
        return;
      }
      setRemainingSec(left);
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state]);

  const active = state.status === "running";
  const mode: SleepTimerMode | null =
    state.status === "running" ? state.mode : null;
  const shouldStopOnTrackEnd =
    state.status === "running" && state.mode === "end_of_track";

  const countdownLabel =
    state.status === "running" && state.mode === "duration" && remainingSec != null
      ? formatCountdown(remainingSec)
      : state.status === "running" && state.mode === "end_of_track"
        ? "End of track"
        : null;

  return {
    active,
    mode,
    shouldStopOnTrackEnd,
    remainingSec,
    countdownLabel,
    customMinutes,
    setCustomMinutes,
    startDuration,
    startEndOfTrack,
    extend,
    clear,
  };
}
