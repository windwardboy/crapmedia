"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deletePlaylist,
  setDrivingDefault,
  updatePlaylist,
} from "@/app/playlists/actions";
import type { Playlist, PlaylistTrack } from "@/lib/playlists/types";

export function PlaylistEditor({
  playlist,
  tracks,
}: {
  playlist: Playlist;
  tracks: PlaylistTrack[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDrivingDefault(checked: boolean) {
    startTransition(async () => {
      await setDrivingDefault(playlist.id, checked);
      router.refresh();
    });
  }

  function handleDelete() {
    if (
      !confirm(
        `Delete "${playlist.name}"? This cannot be undone.`,
      )
    ) {
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

      <div className="cm-card p-6">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p className="font-medium">Default for driving mode</p>
            <p className="text-sm text-cm-text-muted">
              Use this playlist when you open Drive (playback wiring comes
              next).
            </p>
          </div>
          <input
            type="checkbox"
            checked={playlist.is_driving_default}
            disabled={pending}
            onChange={(e) => handleDrivingDefault(e.target.checked)}
            className="h-5 w-5 accent-[var(--cm-accent)]"
          />
        </label>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Tracks</h2>
        {tracks.length === 0 ? (
          <div className="cm-card p-6 text-sm text-cm-text-muted">
            No tracks yet. YouTube import and add-by-URL land in the next step.
          </div>
        ) : (
          <ol className="cm-card divide-y divide-cm-border">
            {tracks.map((track, index) => (
              <li
                key={track.id}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <span className="w-6 text-cm-text-muted">{index + 1}</span>
                <span className="flex-1 truncate">{track.title}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

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
