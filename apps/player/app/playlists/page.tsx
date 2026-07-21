import Link from "next/link";
import { AppNavShell } from "@/components/app-nav-shell";
import { CreatePlaylistForm } from "@/components/playlists/create-playlist-form";
import { PlaylistCard } from "@/components/playlists/playlist-card";
import { SignInPrompt } from "@/components/playlists/sign-in-prompt";
import { listPlaylists } from "@/lib/playlists/queries";

export default async function PlaylistsPage() {
  const playlists = await listPlaylists();

  return (
    <>
      <AppNavShell />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Playlists</h1>
            <p className="mt-2 text-cm-text-muted">
              Your queues — flip Drive or Sleep on a card to set the default.
            </p>
          </div>
          {playlists ? (
            <Link href="/" className="text-sm text-cm-text-muted hover:text-cm-text">
              ← Home
            </Link>
          ) : null}
        </div>

        {playlists === null ? (
          <SignInPrompt nextPath="/playlists" />
        ) : (
          <>
            <CreatePlaylistForm />

            {playlists.length === 0 ? (
              <p className="mt-10 text-sm text-cm-text-muted">
                No playlists yet — create one above.
              </p>
            ) : (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <PlaylistCard playlist={playlist} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </>
  );
}
