"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addYoutubeTrack,
  importYoutubePlaylist,
  moveTrack,
  removeTrack,
} from "@/app/playlists/youtube-actions";
import type { ActionResult } from "@/lib/playlists/action-result";
import type { Playlist, PlaylistTrack } from "@/lib/playlists/types";
import { isTrackEmbedBlocked } from "@/lib/playlists/track-utils";
import { formatDuration } from "@/lib/youtube/duration";

function videoIdFromTrack(track: PlaylistTrack): string | null {
  if (track.source_type !== "youtube") return null;
  const ref = track.source_ref as { videoId?: string };
  return ref.videoId ?? null;
}

function FormMessage({ result }: { result: ActionResult | null }) {
  if (!result?.error && !result?.success) return null;
  return (
    <p
      className={`text-sm ${result.error ? "text-red-400" : "text-cm-accent"}`}
    >
      {result.error ?? result.success}
    </p>
  );
}

export function YoutubeTracksPanel({
  playlist,
  tracks,
}: {
  playlist: Playlist;
  tracks: PlaylistTrack[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addState, addAction, addPending] = useActionState(
    addYoutubeTrack.bind(null, playlist.id),
    null,
  );
  const [importState, importAction, importPending] = useActionState(
    importYoutubePlaylist.bind(null, playlist.id),
    null,
  );

  function handleRemove(trackId: string) {
    startTransition(async () => {
      await removeTrack(playlist.id, trackId);
      router.refresh();
    });
  }

  function handleMove(trackId: string, direction: "up" | "down") {
    startTransition(async () => {
      await moveTrack(playlist.id, trackId, direction);
      router.refresh();
    });
  }

  const busy = pending || addPending || importPending;
  const blockedTracks = tracks.filter(isTrackEmbedBlocked);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Tracks</h2>
        {tracks.length > 0 ? (
          <Link
            href={`/playlists/${playlist.id}/listen`}
            className="cm-btn cm-btn-primary px-5 py-2 text-sm"
          >
            Play playlist
          </Link>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form action={addAction} className="cm-card space-y-3 p-4">
          <p className="text-sm font-medium">Add video</p>
          <input
            name="url"
            type="text"
            placeholder="YouTube URL or video ID"
            className="w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm outline-none focus:border-cm-accent"
          />
          <button
            type="submit"
            disabled={busy}
            className="cm-btn cm-btn-ghost w-full py-2 text-sm disabled:opacity-60"
          >
            Add track
          </button>
          <FormMessage result={addState} />
        </form>

        <form action={importAction} className="cm-card space-y-3 p-4">
          <p className="text-sm font-medium">Import YouTube playlist</p>
          <input
            name="url"
            type="text"
            placeholder="https://youtube.com/playlist?list=PL…"
            className="w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm outline-none focus:border-cm-accent"
          />
          <button
            type="submit"
            disabled={busy}
            className="cm-btn cm-btn-ghost w-full py-2 text-sm disabled:opacity-60"
          >
            Import
          </button>
          <FormMessage result={importState} />
        </form>
      </div>

      {blockedTracks.length > 0 ? (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
        >
          {blockedTracks.length === 1
            ? "1 track can't play in the app"
            : `${blockedTracks.length} tracks can't play in the app`}
          {" — "}embedding is restricted by the owner. Remove them before
          driving, or playback will skip them automatically.
        </div>
      ) : null}

      {tracks.length === 0 ? (
        <div className="cm-card p-6 text-sm text-cm-text-muted">
          Add a video or import a YouTube playlist to get started.
        </div>
      ) : (
        <ol className="cm-card divide-y divide-cm-border">
          {tracks.map((track, index) => {
            const vid = videoIdFromTrack(track);
            const blocked = isTrackEmbedBlocked(track);
            return (
              <li
                key={track.id}
                className={`flex items-center gap-3 px-3 py-3 text-sm sm:px-4 ${
                  blocked
                    ? "border-l-4 border-amber-500/60 bg-amber-500/5"
                    : ""
                }`}
              >
                <span className="w-6 shrink-0 text-cm-text-muted">
                  {index + 1}
                </span>
                {track.thumbnail_url ? (
                  <Image
                    src={track.thumbnail_url}
                    alt=""
                    width={48}
                    height={36}
                    className="h-9 w-12 shrink-0 rounded object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-9 w-12 shrink-0 rounded bg-cm-bg-subtle" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{track.title}</p>
                    {blocked ? (
                      <span className="shrink-0 rounded-full border border-amber-500/50 bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-200">
                        Can&apos;t embed
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-cm-text-muted">
                    {track.artist ?? "YouTube"}
                    {track.duration_sec
                      ? ` · ${formatDuration(track.duration_sec)}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    disabled={busy || index === 0}
                    onClick={() => handleMove(track.id, "up")}
                    className="rounded px-2 py-1 text-cm-text-muted hover:bg-cm-bg-subtle disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === tracks.length - 1}
                    onClick={() => handleMove(track.id, "down")}
                    className="rounded px-2 py-1 text-cm-text-muted hover:bg-cm-bg-subtle disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleRemove(track.id)}
                    className="rounded px-2 py-1 text-red-400 hover:bg-cm-bg-subtle disabled:opacity-30"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
                {vid ? (
                  <span className="sr-only">Video {vid}</span>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
