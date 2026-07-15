"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/playlists/action-result";
import {
  EMBED_CHECK_VERSION,
  fetchPlaylistVideoIds,
  fetchVideoMetadata,
} from "@/lib/youtube/api";
import { parsePlaylistId, parseVideoId } from "@/lib/youtube/parse";

async function requireUserAndPlaylist(playlistId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in required." } as const;
  }

  const { data: playlist } = await supabase
    .from("playlists")
    .select("id")
    .eq("id", playlistId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!playlist) {
    return { error: "Playlist not found." } as const;
  }

  return { supabase, userId: user.id } as const;
}

async function nextPosition(
  supabase: Awaited<ReturnType<typeof createClient>>,
  playlistId: string,
) {
  const { data } = await supabase
    .from("playlist_tracks")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.position ?? -1) + 1;
}

async function existingYoutubeIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  playlistId: string,
) {
  const { data } = await supabase
    .from("playlist_tracks")
    .select("source_ref")
    .eq("playlist_id", playlistId)
    .eq("source_type", "youtube");

  const ids = new Set<string>();
  for (const row of data ?? []) {
    const ref = row.source_ref as { videoId?: string };
    if (ref.videoId) ids.add(ref.videoId);
  }
  return ids;
}

function revalidatePlaylist(playlistId: string) {
  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
  revalidatePath(`/playlists/${playlistId}/listen`);
}

export async function addYoutubeTrack(
  playlistId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const input = String(formData.get("url") ?? "").trim();
  const videoId = parseVideoId(input);

  if (!videoId) {
    return { error: "Paste a YouTube URL or 11-character video ID." };
  }

  const ctx = await requireUserAndPlaylist(playlistId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase } = ctx;
  const existing = await existingYoutubeIds(supabase, playlistId);
  if (existing.has(videoId)) {
    return { error: "That video is already in this playlist." };
  }

  try {
    const meta = await fetchVideoMetadata([videoId]);
    const video = meta.get(videoId);
    if (!video) {
      return { error: "Video not found or unavailable." };
    }

    const position = await nextPosition(supabase, playlistId);
    const { error } = await supabase.from("playlist_tracks").insert({
      playlist_id: playlistId,
      position,
      source_type: "youtube",
      source_ref: {
        videoId,
        embeddable: video.embeddable,
        embedCheckVersion: EMBED_CHECK_VERSION,
      },
      title: video.title,
      artist: video.channel,
      duration_sec: video.durationSec,
      thumbnail_url: video.thumbnailUrl,
    });

    if (error) return { error: error.message };

    revalidatePlaylist(playlistId);
    const blocked = video.embeddable
      ? ""
      : " It can't be played in the app — consider removing it.";
    return { success: `Added “${video.title}”.${blocked}` };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to add video.",
    };
  }
}

export async function importYoutubePlaylist(
  playlistId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const input = String(formData.get("url") ?? "").trim();
  const ytPlaylistId = parsePlaylistId(input);

  if (!ytPlaylistId) {
    return { error: "Paste a YouTube playlist URL (must include list=PL…)." };
  }

  const ctx = await requireUserAndPlaylist(playlistId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase } = ctx;

  try {
    const videoIds = await fetchPlaylistVideoIds(ytPlaylistId);
    if (videoIds.length === 0) {
      return { error: "Playlist is empty or not accessible." };
    }

    const existing = await existingYoutubeIds(supabase, playlistId);
    const toAdd = videoIds.filter((id) => !existing.has(id));
    if (toAdd.length === 0) {
      return { error: "All videos from that playlist are already here." };
    }

    const meta = await fetchVideoMetadata(toAdd);
    let position = await nextPosition(supabase, playlistId);
    const rows = [];
    let blockedCount = 0;

    for (const videoId of toAdd) {
      const video = meta.get(videoId);
      if (!video) continue;
      if (!video.embeddable) blockedCount += 1;
      rows.push({
        playlist_id: playlistId,
        position: position++,
        source_type: "youtube",
        source_ref: {
          videoId,
          embeddable: video.embeddable,
          embedCheckVersion: EMBED_CHECK_VERSION,
        },
        title: video.title,
        artist: video.channel,
        duration_sec: video.durationSec,
        thumbnail_url: video.thumbnailUrl,
      });
    }

    if (rows.length === 0) {
      return { error: "Could not load video metadata for that playlist." };
    }

    const { error } = await supabase.from("playlist_tracks").insert(rows);
    if (error) return { error: error.message };

    revalidatePlaylist(playlistId);
    const blockedNote =
      blockedCount > 0
        ? ` ${blockedCount} can't play in the app — highlighted below.`
        : "";
    return {
      success: `Imported ${rows.length} track${rows.length === 1 ? "" : "s"}.${blockedNote}`,
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to import playlist.",
    };
  }
}

export async function removeTrack(
  playlistId: string,
  trackId: string,
): Promise<ActionResult> {
  const ctx = await requireUserAndPlaylist(playlistId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase } = ctx;

  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .eq("id", trackId)
    .eq("playlist_id", playlistId);

  if (error) return { error: error.message };

  await renumberTracks(supabase, playlistId);
  revalidatePlaylist(playlistId);
  return { success: "Track removed." };
}

export async function moveTrack(
  playlistId: string,
  trackId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const ctx = await requireUserAndPlaylist(playlistId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase } = ctx;

  const { data: tracks } = await supabase
    .from("playlist_tracks")
    .select("id, position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (!tracks?.length) return { error: "No tracks." };

  const index = tracks.findIndex((t) => t.id === trackId);
  if (index < 0) return { error: "Track not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= tracks.length) {
    return {};
  }

  const a = tracks[index];
  const b = tracks[swapIndex];
  const temp = 100_000;

  await supabase
    .from("playlist_tracks")
    .update({ position: temp + a.position })
    .eq("id", a.id);
  await supabase
    .from("playlist_tracks")
    .update({ position: a.position })
    .eq("id", b.id);
  await supabase
    .from("playlist_tracks")
    .update({ position: b.position })
    .eq("id", a.id);

  revalidatePlaylist(playlistId);
  return { success: "Order updated." };
}

async function renumberTracks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  playlistId: string,
) {
  const { data: tracks } = await supabase
    .from("playlist_tracks")
    .select("id")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  for (let i = 0; i < (tracks?.length ?? 0); i++) {
    await supabase
      .from("playlist_tracks")
      .update({ position: i })
      .eq("id", tracks![i].id);
  }
}
