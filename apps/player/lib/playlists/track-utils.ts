import type { PlaylistTrack } from "@/lib/playlists/types";

export function videoIdFromTrack(track: PlaylistTrack): string | null {
  if (track.source_type !== "youtube") return null;
  const ref = track.source_ref as { videoId?: string };
  return ref.videoId ?? null;
}

export function youtubeTracks(tracks: PlaylistTrack[]): PlaylistTrack[] {
  return tracks.filter((t) => videoIdFromTrack(t) != null);
}
