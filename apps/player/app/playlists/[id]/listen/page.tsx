import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PlaylistListenClient } from "@/components/playlists/playlist-listen-client";
import { getPlaylist } from "@/lib/playlists/queries";

export default async function PlaylistListenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPlaylist(id);

  if (result === null) {
    const supabase = await import("@/lib/supabase/server").then((m) =>
      m.createClient(),
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect(`/settings?next=${encodeURIComponent(`/playlists/${id}/listen`)}`);
    }

    notFound();
  }

  const { playlist, tracks } = result;
  const youtubeTracks = tracks.filter((t) => t.source_type === "youtube");

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href={`/playlists/${id}`}
          className="text-sm text-cm-text-muted hover:text-cm-text"
        >
          ← {playlist.name}
        </Link>
        <div className="mt-6">
          <PlaylistListenClient
            playlistId={playlist.id}
            tracks={youtubeTracks}
          />
        </div>
      </main>
    </>
  );
}
