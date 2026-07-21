import Link from "next/link";
import { redirect } from "next/navigation";
import { DrivePlayer } from "@/components/drive/drive-player";
import { getDrivingDefaultPlaylist } from "@/lib/playlists/queries";
import { youtubeTracks } from "@/lib/playlists/track-utils";

export default async function DrivePage() {
  const result = await getDrivingDefaultPlaylist();

  if (result === null) {
    const supabase = await import("@/lib/supabase/server").then((m) =>
      m.createClient(),
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/settings?next=/drive");
    }

    return (
      <div className="flex min-h-dvh flex-col bg-cm-bg">
        <header className="flex items-center justify-between px-4 py-3 text-sm">
          <Link href="/" className="text-cm-text-muted hover:text-cm-text">
            ← Exit drive
          </Link>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-xl font-bold">No driving playlist</h1>
          <p className="mt-3 max-w-sm text-sm text-cm-text-muted">
            On the playlists page, flip the{" "}
            <strong className="text-cm-text">Drive</strong> switch on a
            playlist, then come back here.
          </p>
          <Link
            href="/playlists"
            className="cm-btn cm-btn-primary mt-8 px-6 py-3 text-sm"
          >
            Go to playlists
          </Link>
        </main>
      </div>
    );
  }

  const { playlist, tracks } = result;
  const playable = youtubeTracks(tracks);

  return (
    <div className="flex min-h-dvh flex-col bg-cm-bg">
      <header className="flex items-center justify-between px-4 py-3 text-sm">
        <Link href="/" className="text-cm-text-muted hover:text-cm-text">
          ← Exit drive
        </Link>
        <Link
          href={`/playlists/${playlist.id}/listen`}
          className="text-cm-text-muted hover:text-cm-text"
        >
          Show video
        </Link>
      </header>
      <DrivePlayer playlist={playlist} tracks={playable} />
    </div>
  );
}
