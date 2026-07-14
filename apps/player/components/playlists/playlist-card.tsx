import Link from "next/link";
import type { PlaylistWithTrackCount } from "@/lib/playlists/types";

export function PlaylistCard({ playlist }: { playlist: PlaylistWithTrackCount }) {
  const trackLabel =
    playlist.track_count === 1 ? "1 track" : `${playlist.track_count} tracks`;

  return (
    <Link
      href={`/playlists/${playlist.id}`}
      className="cm-card block p-5 transition hover:border-cm-accent"
    >
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
    </Link>
  );
}
