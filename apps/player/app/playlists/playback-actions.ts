"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/playlists/action-result";
import { EMBED_CHECK_VERSION } from "@/lib/youtube/api";

export async function saveTrackPosition(
  trackId: string,
  positionSec: number,
): Promise<ActionResult> {
  const position = Math.max(0, Math.floor(positionSec));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in required." };
  }

  const { data, error } = await supabase
    .from("playlist_tracks")
    .update({
      last_position_sec: position,
      ...(position > 0 ? { last_played_at: new Date().toISOString() } : {}),
    })
    .eq("id", trackId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Track not found." };
  }

  return { success: "Saved" };
}

async function updateTrackEmbedRef(
  trackId: string,
  patch: Record<string, unknown>,
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: track } = await supabase
    .from("playlist_tracks")
    .select("id, playlist_id, source_ref")
    .eq("id", trackId)
    .maybeSingle();

  if (!track) return false;

  const { data: playlist } = await supabase
    .from("playlists")
    .select("id")
    .eq("id", track.playlist_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!playlist) return false;

  const source_ref = {
    ...(track.source_ref as Record<string, unknown>),
    ...patch,
    embedCheckVersion: EMBED_CHECK_VERSION,
  };

  const { error } = await supabase
    .from("playlist_tracks")
    .update({ source_ref })
    .eq("id", trackId);

  if (error) return false;

  revalidatePath(`/playlists/${track.playlist_id}`);
  revalidatePath(`/playlists/${track.playlist_id}/listen`);
  return true;
}

export async function markTrackEmbedBlocked(trackId: string): Promise<void> {
  await updateTrackEmbedRef(trackId, {
    embeddable: false,
    embedVerifiedInApp: true,
    embedBlockedByPlayback: true,
  });
}

export async function markTrackEmbedVerified(trackId: string): Promise<void> {
  await updateTrackEmbedRef(trackId, {
    embeddable: true,
    embedVerifiedInApp: true,
    embedBlockedByPlayback: false,
  });
}
