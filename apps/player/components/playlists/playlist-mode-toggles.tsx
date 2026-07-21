"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import {
  setDrivingDefault,
  setSleepDefault,
} from "@/app/playlists/actions";

type ModeFlags = {
  is_driving_default: boolean;
  is_sleep_default: boolean;
};

export function PlaylistModeToggles({
  playlistId,
  isDrivingDefault,
  isSleepDefault,
  layout = "row",
}: {
  playlistId: string;
  isDrivingDefault: boolean;
  isSleepDefault: boolean;
  layout?: "row" | "stack";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [flags, setOptimisticFlags] = useOptimistic(
    {
      is_driving_default: isDrivingDefault,
      is_sleep_default: isSleepDefault,
    } satisfies ModeFlags,
    (current, patch: Partial<ModeFlags>) => ({ ...current, ...patch }),
  );

  function toggleDrive(checked: boolean) {
    startTransition(async () => {
      setOptimisticFlags({ is_driving_default: checked });
      await setDrivingDefault(playlistId, checked);
      router.refresh();
    });
  }

  function toggleSleep(checked: boolean) {
    startTransition(async () => {
      setOptimisticFlags({ is_sleep_default: checked });
      await setSleepDefault(playlistId, checked);
      router.refresh();
    });
  }

  return (
    <div
      className={
        layout === "stack"
          ? "space-y-4"
          : "flex flex-wrap items-center gap-x-4 gap-y-2"
      }
      aria-busy={pending}
    >
      <ModeSwitch
        label="Drive"
        checked={flags.is_driving_default}
        disabled={pending}
        onChange={toggleDrive}
      />
      <ModeSwitch
        label="Sleep"
        checked={flags.is_sleep_default}
        disabled={pending}
        onChange={toggleSleep}
      />
    </div>
  );
}

function ModeSwitch({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <span className="min-w-[2.75rem] text-cm-text-muted">{label}</span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
          aria-label={`Default for ${label} mode`}
        />
        <span
          className="h-6 w-11 rounded-full bg-cm-bg-subtle transition peer-checked:bg-cm-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cm-accent peer-disabled:opacity-50"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5 peer-disabled:opacity-50"
          aria-hidden
        />
      </span>
    </label>
  );
}
