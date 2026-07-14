import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Playlist, PlaylistTrack, PlaylistWithTrackCount } from "./types";

export async function listPlaylists(): Promise<PlaylistWithTrackCount[] | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*, playlist_tracks(count)")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const countRow = row.playlist_tracks as { count: number }[] | null;
    const track_count = countRow?.[0]?.count ?? 0;
    const { playlist_tracks, ...playlist } = row;
    void playlist_tracks;
    return { ...playlist, track_count } as PlaylistWithTrackCount;
  });
}

export async function getPlaylist(
  id: string,
): Promise<{ playlist: Playlist; tracks: PlaylistTrack[] } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: playlist, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!playlist) {
    return null;
  }

  const { data: tracks, error: tracksError } = await supabase
    .from("playlist_tracks")
    .select("*")
    .eq("playlist_id", id)
    .order("position", { ascending: true });

  if (tracksError) {
    throw new Error(tracksError.message);
  }

  return {
    playlist: playlist as Playlist,
    tracks: (tracks ?? []) as PlaylistTrack[],
  };
}

export async function getDrivingDefaultPlaylist(): Promise<{
  playlist: Playlist;
  tracks: PlaylistTrack[];
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: playlist, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_driving_default", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!playlist) {
    return null;
  }

  const { data: tracks, error: tracksError } = await supabase
    .from("playlist_tracks")
    .select("*")
    .eq("playlist_id", playlist.id)
    .order("position", { ascending: true });

  if (tracksError) {
    throw new Error(tracksError.message);
  }

  return {
    playlist: playlist as Playlist,
    tracks: (tracks ?? []) as PlaylistTrack[],
  };
}

export async function requireUser(nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/settings?next=${encodeURIComponent(nextPath)}`);
  }

  return { supabase, user };
}

export type ContinueListening = {
  playlist: Playlist;
  track: PlaylistTrack;
};

export async function getContinueListening(): Promise<ContinueListening | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: playlists } = await supabase
    .from("playlists")
    .select("id")
    .eq("user_id", user.id);

  const playlistIds = (playlists ?? []).map((p) => p.id);
  if (playlistIds.length === 0) {
    return null;
  }

  const { data: track, error } = await supabase
    .from("playlist_tracks")
    .select("*")
    .in("playlist_id", playlistIds)
    .gt("last_position_sec", 30)
    .not("last_played_at", "is", null)
    .order("last_played_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !track) {
    return null;
  }

  const { data: playlist } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", track.playlist_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!playlist) {
    return null;
  }

  return {
    playlist: playlist as Playlist,
    track: track as PlaylistTrack,
  };
}
