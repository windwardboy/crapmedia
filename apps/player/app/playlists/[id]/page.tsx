import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PlaylistEditor } from "@/components/playlists/playlist-editor";
import { getPlaylist } from "@/lib/playlists/queries";

export default async function PlaylistDetailPage({
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
      redirect(`/settings?next=${encodeURIComponent(`/playlists/${id}`)}`);
    }

    notFound();
  }

  const { playlist, tracks } = result;

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/playlists"
          className="text-sm text-cm-text-muted hover:text-cm-text"
        >
          ← All playlists
        </Link>
        <h1 className="mt-4 text-2xl font-bold">{playlist.name}</h1>
        <PlaylistEditor playlist={playlist} tracks={tracks} />
      </main>
    </>
  );
}
