"use client";

import Link from "next/link";
import { PlaylistModeToggles } from "@/components/playlists/playlist-mode-toggles";
import type { PlaylistWithTrackCount } from "@/lib/playlists/types";

function playHref(playlist: PlaylistWithTrackCount) {
  if (playlist.is_driving_default) return "/drive";
  if (playlist.is_sleep_default) return "/sleep";
  return `/playlists/${playlist.id}/listen`;
}

export function PlaylistCard({ playlist }: { playlist: PlaylistWithTrackCount }) {
  const isSleepDefault = Boolean(playlist.is_sleep_default);
  const trackLabel =
    playlist.track_count === 1 ? "1 track" : `${playlist.track_count} tracks`;
  const canPlay = playlist.track_count > 0;
  const href = playHref({ ...playlist, is_sleep_default: isSleepDefault });

  return (
    <div className="cm-card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold">{playlist.name}</h2>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          {playlist.is_driving_default ? (
            <span className="rounded-full bg-cm-bg-subtle px-2 py-0.5 text-xs font-medium text-cm-accent">
              Drive
            </span>
          ) : null}
          {isSleepDefault ? (
            <span className="rounded-full bg-cm-bg-subtle px-2 py-0.5 text-xs font-medium text-cm-accent">
              Sleep
            </span>
          ) : null}
        </div>
      </div>
      {playlist.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-cm-text-muted">
          {playlist.description}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-cm-text-muted">{trackLabel}</p>

      <div className="mt-4 border-t border-cm-border/60 pt-3">
        <PlaylistModeToggles
          playlistId={playlist.id}
          isDrivingDefault={playlist.is_driving_default}
          isSleepDefault={isSleepDefault}
        />
      </div>

      <div className="mt-4 flex gap-2">
        {canPlay ? (
          <Link
            href={href}
            className="cm-btn cm-btn-primary flex-1 py-2.5 text-center text-sm"
          >
            Play now
          </Link>
        ) : (
          <span
            className="cm-btn cm-btn-primary flex-1 cursor-not-allowed py-2.5 text-center text-sm opacity-40"
            aria-disabled
            title="Add tracks before playing"
          >
            Play now
          </span>
        )}
        <Link
          href={`/playlists/${playlist.id}`}
          className="cm-btn cm-btn-outline flex-1 py-2.5 text-center text-sm"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
