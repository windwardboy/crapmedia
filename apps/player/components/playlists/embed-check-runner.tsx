"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  markTrackEmbedBlocked,
  markTrackEmbedVerified,
} from "@/app/playlists/playback-actions";
import type { PlaylistTrack } from "@/lib/playlists/types";
import {
  needsEmbedVerification,
  videoIdFromTrack,
} from "@/lib/playlists/track-utils";
import { loadYoutubeApi } from "@/lib/youtube/load-api";
import { isEmbedRestrictedPlaybackError } from "@/lib/youtube/player-errors";

type ProbeResult = "ok" | "blocked" | "unknown";

function probeVideoEmbeddability(videoId: string): Promise<ProbeResult> {
  return new Promise((resolve) => {
    const elementId = `embed-probe-${videoId}-${Date.now()}`;
    const host = document.createElement("div");
    host.id = elementId;
    host.className = "sr-only";
    host.setAttribute("aria-hidden", "true");
    document.body.appendChild(host);

    let settled = false;
    let player: { destroy: () => void } | null = null;

    const finish = (result: ProbeResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      try {
        player?.destroy();
      } catch {
        /* player may not have initialized */
      }
      host.remove();
      resolve(result);
    };

    const timer = window.setTimeout(() => finish("unknown"), 12_000);

    if (!window.YT?.Player) {
      finish("unknown");
      return;
    }

    player = new window.YT.Player(elementId, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: () => finish("ok"),
        onError: (event: { data: number }) => {
          if (isEmbedRestrictedPlaybackError(event.data)) {
            finish("blocked");
            return;
          }
          finish("unknown");
        },
      },
    });
  });
}

export function EmbedCheckRunner({
  tracks,
  onBlocked,
}: {
  tracks: PlaylistTrack[];
  onBlocked?: (trackId: string) => void;
}) {
  const router = useRouter();
  const runningRef = useRef(false);

  useEffect(() => {
    const toCheck = tracks.filter(needsEmbedVerification);
    if (toCheck.length === 0 || runningRef.current) return;

    let cancelled = false;
    runningRef.current = true;

    async function run() {
      await loadYoutubeApi();
      if (cancelled) return;

      let changed = false;

      for (const track of toCheck) {
        if (cancelled) break;

        const videoId = videoIdFromTrack(track);
        if (!videoId) continue;

        const result = await probeVideoEmbeddability(videoId);
        if (cancelled) break;

        if (result === "blocked") {
          onBlocked?.(track.id);
          await markTrackEmbedBlocked(track.id);
          changed = true;
        } else if (result === "ok") {
          await markTrackEmbedVerified(track.id);
          changed = true;
        }
      }

      runningRef.current = false;
      if (changed && !cancelled) {
        router.refresh();
      }
    }

    void run();

    return () => {
      cancelled = true;
      runningRef.current = false;
    };
  }, [tracks, router, onBlocked]);

  return null;
}
