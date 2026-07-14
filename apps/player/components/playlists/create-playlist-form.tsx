"use client";

import { useFormStatus } from "react-dom";
import { createPlaylist } from "@/app/playlists/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cm-btn cm-btn-primary px-5 py-2.5 text-sm disabled:opacity-60"
    >
      {pending ? "Creating…" : "New playlist"}
    </button>
  );
}

export function CreatePlaylistForm() {
  return (
    <form action={createPlaylist} className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
        <span className="text-cm-text-muted">Playlist name</span>
        <input
          name="name"
          type="text"
          required
          maxLength={200}
          placeholder="Audiobooks, Road trip, …"
          className="rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-cm-text outline-none focus:border-cm-accent"
        />
      </label>
      <SubmitButton />
    </form>
  );
}
