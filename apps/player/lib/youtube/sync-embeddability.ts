import { createClient } from "@/lib/supabase/server";
import { fetchVideoMetadata } from "@/lib/youtube/api";
import type { PlaylistTrack } from "@/lib/playlists/types";

export async function syncTrackEmbeddability(
  tracks: PlaylistTrack[],
): Promise<PlaylistTrack[]> {
  const missing = tracks.filter((track) => {
    if (track.source_type !== "youtube") return false;
    const ref = track.source_ref as { embeddable?: boolean };
    return typeof ref.embeddable !== "boolean";
  });

  if (missing.length === 0) {
    return tracks;
  }

  const videoIds = missing
    .map((track) => (track.source_ref as { videoId?: string }).videoId)
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) {
    return tracks;
  }

  let meta: Awaited<ReturnType<typeof fetchVideoMetadata>>;
  try {
    meta = await fetchVideoMetadata(videoIds);
  } catch {
    return tracks;
  }

  const supabase = await createClient();
  const updated = new Map(tracks.map((track) => [track.id, track]));

  for (const track of missing) {
    const videoId = (track.source_ref as { videoId?: string }).videoId;
    if (!videoId) continue;

    const video = meta.get(videoId);
    const embeddable = video?.embeddable ?? false;
    const source_ref = {
      ...(track.source_ref as Record<string, unknown>),
      videoId,
      embeddable,
    };

    await supabase
      .from("playlist_tracks")
      .update({ source_ref })
      .eq("id", track.id);

    updated.set(track.id, { ...track, source_ref });
  }

  return tracks.map((track) => updated.get(track.id) ?? track);
}
