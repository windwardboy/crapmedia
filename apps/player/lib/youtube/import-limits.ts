export type YoutubeImportAction = "add_video" | "import_playlist" | "embed_sync";

export const YOUTUBE_DAILY_VIDEO_CAP = Number(
  process.env.YOUTUBE_DAILY_VIDEO_CAP ?? 200,
);

export const YOUTUBE_SINGLE_IMPORT_CAP = Number(
  process.env.YOUTUBE_SINGLE_IMPORT_CAP ?? 100,
);

type SupabaseServer = Awaited<
  ReturnType<typeof import("@/lib/supabase/server").createClient>
>;

function startOfUtcDay(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getDailyVideoUsage(
  supabase: SupabaseServer,
  userId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("youtube_import_log")
    .select("video_count")
    .eq("user_id", userId)
    .gte("created_at", startOfUtcDay());

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + row.video_count, 0);
}

export type ImportLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; error: string };

export async function checkImportLimit(
  supabase: SupabaseServer,
  userId: string,
  videoCount: number,
  options: {
    isAdmin?: boolean;
    singleImport?: boolean;
  } = {},
): Promise<ImportLimitResult> {
  if (options.isAdmin) {
    return { ok: true, remaining: YOUTUBE_DAILY_VIDEO_CAP };
  }

  if (videoCount <= 0) {
    return { ok: true, remaining: YOUTUBE_DAILY_VIDEO_CAP };
  }

  if (options.singleImport && videoCount > YOUTUBE_SINGLE_IMPORT_CAP) {
    return {
      ok: false,
      error: `That import has ${videoCount} new videos — the limit is ${YOUTUBE_SINGLE_IMPORT_CAP} per import. Try a smaller playlist or add tracks in batches.`,
    };
  }

  const used = await getDailyVideoUsage(supabase, userId);
  const remaining = YOUTUBE_DAILY_VIDEO_CAP - used;

  if (videoCount > remaining) {
    return {
      ok: false,
      error:
        remaining <= 0
          ? `Daily YouTube import limit reached (${YOUTUBE_DAILY_VIDEO_CAP} videos per day). Try again tomorrow.`
          : `Daily limit: ${remaining} video${remaining === 1 ? "" : "s"} left today (${used}/${YOUTUBE_DAILY_VIDEO_CAP} used). This action needs ${videoCount}.`,
    };
  }

  return { ok: true, remaining: remaining - videoCount };
}

export async function recordImportUsage(
  supabase: SupabaseServer,
  userId: string,
  action: YoutubeImportAction,
  videoCount: number,
): Promise<void> {
  if (videoCount <= 0) return;

  await supabase.from("youtube_import_log").insert({
    user_id: userId,
    action,
    video_count: videoCount,
  });
}
