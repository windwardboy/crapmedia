import Link from "next/link";
import type { PlaylistWithTrackCount } from "@/lib/playlists/types";

export function PlaylistCard({ playlist }: { playlist: PlaylistWithTrackCount }) {
  const trackLabel =
    playlist.track_count === 1 ? "1 track" : `${playlist.track_count} tracks`;
  const canPlay = playlist.track_count > 0;

  return (
    <div className="cm-card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold">{playlist.name}</h2>
        {playlist.is_driving_default ? (
          <span className="shrink-0 rounded-full bg-cm-bg-subtle px-2 py-0.5 text-xs font-medium text-cm-accent">
            Drive
          </span>
        ) : null}
      </div>
      {playlist.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-cm-text-muted">
          {playlist.description}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-cm-text-muted">{trackLabel}</p>

      <div className="mt-4 flex gap-2">
        {canPlay ? (
          <Link
            href={`/playlists/${playlist.id}/listen`}
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
