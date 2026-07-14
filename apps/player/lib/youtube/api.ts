import { parseIso8601Duration } from "./duration";

export type YoutubeVideoMeta = {
  videoId: string;
  title: string;
  channel: string;
  durationSec: number | null;
  thumbnailUrl: string | null;
};

function apiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error(
      "YouTube API key is not configured. Add YOUTUBE_API_KEY to the player environment.",
    );
  }
  return key;
}

async function youtubeFetch<T>(path: string, params: Record<string, string>) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  url.searchParams.set("key", apiKey());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        "YouTube API quota exceeded. Try again later or add fewer videos at once.",
      );
    }
    const body = await res.text();
    throw new Error(
      `YouTube API error (${res.status}): ${body.slice(0, 200)}`,
    );
  }
  return res.json() as Promise<T>;
}

type VideosResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
    };
    contentDetails?: { duration?: string };
  }>;
};

export async function fetchVideoMetadata(
  videoIds: string[],
): Promise<Map<string, YoutubeVideoMeta>> {
  const unique = [...new Set(videoIds)].filter(Boolean);
  const map = new Map<string, YoutubeVideoMeta>();
  if (unique.length === 0) return map;

  const batchSize = 50;
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const data = await youtubeFetch<VideosResponse>("videos", {
      part: "snippet,contentDetails",
      id: batch.join(","),
    });

    for (const item of data.items ?? []) {
      const duration = item.contentDetails?.duration
        ? parseIso8601Duration(item.contentDetails.duration)
        : null;
      map.set(item.id, {
        videoId: item.id,
        title: item.snippet?.title ?? "Untitled",
        channel: item.snippet?.channelTitle ?? "",
        durationSec: duration,
        thumbnailUrl:
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url ??
          null,
      });
    }
  }

  return map;
}

type PlaylistItemsResponse = {
  items?: Array<{
    snippet?: {
      resourceId?: { videoId?: string };
      title?: string;
    };
  }>;
  nextPageToken?: string;
};

export async function fetchPlaylistVideoIds(
  playlistId: string,
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  do {
    const params: Record<string, string> = {
      part: "snippet",
      playlistId,
      maxResults: "50",
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await youtubeFetch<PlaylistItemsResponse>(
      "playlistItems",
      params,
    );

    for (const item of data.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId;
      if (videoId) ids.push(videoId);
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return ids;
}
