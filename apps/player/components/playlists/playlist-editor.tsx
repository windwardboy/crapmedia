"use client";

import { useTransition } from "react";
import { deletePlaylist, updatePlaylist } from "@/app/playlists/actions";
import { PlaylistModeToggles } from "@/components/playlists/playlist-mode-toggles";
import { YoutubeTracksPanel } from "@/components/playlists/youtube-tracks-panel";
import type { Playlist, PlaylistTrack } from "@/lib/playlists/types";

export function PlaylistEditor({
  playlist,
  tracks,
}: {
  playlist: Playlist;
  tracks: PlaylistTrack[];
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${playlist.name}"? This cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      await deletePlaylist(playlist.id);
    });
  }

  return (
    <div className="space-y-8">
      <form
        action={updatePlaylist.bind(null, playlist.id)}
        className="cm-card space-y-4 p-6"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cm-text-muted">Name</span>
          <input
            name="name"
            type="text"
            required
            maxLength={200}
            defaultValue={playlist.name}
            className="rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-cm-text outline-none focus:border-cm-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cm-text-muted">Description (optional)</span>
          <textarea
            name="description"
            rows={2}
            maxLength={500}
            defaultValue={playlist.description ?? ""}
            className="resize-none rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-cm-text outline-none focus:border-cm-accent"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="cm-btn cm-btn-primary px-5 py-2.5 text-sm disabled:opacity-60"
        >
          Save changes
        </button>
      </form>

      <div className="cm-card space-y-3 p-6">
        <div>
          <p className="font-medium">Mode defaults</p>
          <p className="text-sm text-cm-text-muted">
            Which playlist opens for Drive and Sleep. Only one playlist can be
            default for each mode.
          </p>
        </div>
        <PlaylistModeToggles
          playlistId={playlist.id}
          isDrivingDefault={playlist.is_driving_default}
          isSleepDefault={Boolean(playlist.is_sleep_default)}
          layout="stack"
        />
      </div>

      <YoutubeTracksPanel playlist={playlist} tracks={tracks} />

      <div className="border-t border-cm-border pt-6">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="text-sm text-red-400 hover:underline disabled:opacity-60"
        >
          Delete playlist
        </button>
      </div>
    </div>
  );
}
