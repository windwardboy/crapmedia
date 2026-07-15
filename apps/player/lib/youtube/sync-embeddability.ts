import { createClient } from "@/lib/supabase/server";
import { EMBED_CHECK_VERSION, fetchVideoMetadata } from "@/lib/youtube/api";
import type { PlaylistTrack } from "@/lib/playlists/types";

type YoutubeSourceRef = {
  videoId?: string;
  embeddable?: boolean;
  embedCheckVersion?: number;
  embedVerifiedInApp?: boolean;
  embedBlockedByPlayback?: boolean;
};

function needsEmbeddabilityCheck(track: PlaylistTrack): boolean {
  if (track.source_type !== "youtube") return false;
  const ref = track.source_ref as YoutubeSourceRef;
  if (ref.embedVerifiedInApp === true || ref.embedBlockedByPlayback === true) {
    return false;
  }
  return ref.embedCheckVersion !== EMBED_CHECK_VERSION;
}

export async function syncTrackEmbeddability(
  tracks: PlaylistTrack[],
): Promise<PlaylistTrack[]> {
  const toCheck = tracks.filter(needsEmbeddabilityCheck);

  if (toCheck.length === 0) {
    return tracks;
  }

  const videoIds = toCheck
    .map((track) => (track.source_ref as YoutubeSourceRef).videoId)
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

  for (const track of toCheck) {
    const videoId = (track.source_ref as YoutubeSourceRef).videoId;
    if (!videoId) continue;

    const video = meta.get(videoId);
    const embeddable = video?.embeddable === true;
    const source_ref = {
      ...(track.source_ref as Record<string, unknown>),
      videoId,
      embeddable,
      embedCheckVersion: EMBED_CHECK_VERSION,
    };

    await supabase
      .from("playlist_tracks")
      .update({ source_ref })
      .eq("id", track.id);

    updated.set(track.id, { ...track, source_ref });
  }

  return tracks.map((track) => updated.get(track.id) ?? track);
}
