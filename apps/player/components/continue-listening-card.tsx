import Link from "next/link";
import Image from "next/image";
import type { ContinueListening } from "@/lib/playlists/queries";
import { formatDuration } from "@/lib/youtube/duration";

export function ContinueListeningCard({
  data,
}: {
  data: ContinueListening;
}) {
  const { playlist, track } = data;
  const href = `/playlists/${playlist.id}/listen?track=${track.id}`;

  return (
    <Link
      href={href}
      className="cm-card flex items-center gap-4 p-4 transition hover:border-cm-accent"
    >
      {track.thumbnail_url ? (
        <Image
          src={track.thumbnail_url}
          alt=""
          width={64}
          height={48}
          className="h-12 w-16 shrink-0 rounded object-cover"
          unoptimized
        />
      ) : (
        <div className="h-12 w-16 shrink-0 rounded bg-cm-bg-subtle" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-cm-accent">
          Continue listening
        </p>
        <p className="mt-1 truncate font-semibold">{track.title}</p>
        <p className="truncate text-sm text-cm-text-muted">
          {playlist.name}
          {track.last_position_sec >= 30
            ? ` · from ${formatDuration(track.last_position_sec)}`
            : ""}
        </p>
      </div>
      <span className="shrink-0 text-cm-accent" aria-hidden>
        ▶
      </span>
    </Link>
  );
}
