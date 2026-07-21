import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SleepPlayer } from "@/components/sleep/sleep-player";
import { getPlaylist } from "@/lib/playlists/queries";
import { youtubeTracks } from "@/lib/playlists/track-utils";

export default async function PlaylistSleepPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ track?: string }>;
}) {
  const { id } = await params;
  const { track: startTrackId } = await searchParams;
  const result = await getPlaylist(id);

  if (result === null) {
    const supabase = await import("@/lib/supabase/server").then((m) =>
      m.createClient(),
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect(
        `/settings?next=${encodeURIComponent(`/playlists/${id}/sleep`)}`,
      );
    }

    notFound();
  }

  const { playlist, tracks } = result;
  const playable = youtubeTracks(tracks);

  return (
    <div className="flex min-h-dvh flex-col bg-cm-bg">
      <header className="flex items-center justify-between px-4 py-3 text-sm">
        <Link href="/" className="text-cm-text-muted hover:text-cm-text">
          ← Exit sleep
        </Link>
        <Link
          href={`/playlists/${playlist.id}/listen${startTrackId ? `?track=${startTrackId}` : ""}`}
          className="text-cm-text-muted hover:text-cm-text"
        >
          Show video
        </Link>
      </header>
      <SleepPlayer
        playlist={playlist}
        tracks={playable}
        startTrackId={startTrackId}
      />
    </div>
  );
}
