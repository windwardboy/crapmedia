"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/playlists/action-result";

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
    .update({ last_position_sec: position })
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
