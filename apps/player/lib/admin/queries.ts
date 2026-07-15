import { isAdminEmail } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/admin/service";
import {
  YOUTUBE_DAILY_VIDEO_CAP,
  YOUTUBE_SINGLE_IMPORT_CAP,
} from "@/lib/youtube/import-limits";

export type AdminStats = {
  configured: boolean;
  users: number;
  playlists: number;
  tracks: number;
  interestSignups: number;
  importsToday: number;
  importsTodayVideos: number;
  recentInterest: Array<{ email: string; created_at: string }>;
  recentImports: Array<{
    action: string;
    video_count: number;
    created_at: string;
    user_email: string | null;
  }>;
  topImportUsersToday: Array<{
    user_id: string;
    email: string | null;
    video_count: number;
  }>;
};

function startOfUtcDay(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const empty: AdminStats = {
    configured: false,
    users: 0,
    playlists: 0,
    tracks: 0,
    interestSignups: 0,
    importsToday: 0,
    importsTodayVideos: 0,
    recentInterest: [],
    recentImports: [],
    topImportUsersToday: [],
  };

  const supabase = createServiceClient();
  if (!supabase) return empty;

  const since = startOfUtcDay();

  const [
    usersResult,
    playlistsResult,
    tracksResult,
    interestCountResult,
    interestRecentResult,
    importsTodayResult,
    recentImportsResult,
  ] = await Promise.all([
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("playlists").select("id", { count: "exact", head: true }),
    supabase
      .from("playlist_tracks")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("interest_signups")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("interest_signups")
      .select("email, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
    supabase
      .from("youtube_import_log")
      .select("video_count")
      .gte("created_at", since),
    supabase
      .from("youtube_import_log")
      .select("user_id, action, video_count, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const emailByUserId = new Map<string, string>();
  for (const user of usersResult.data.users ?? []) {
    if (user.email) emailByUserId.set(user.id, user.email);
  }

  const importsToday = importsTodayResult.data ?? [];
  const importsTodayVideos = importsToday.reduce(
    (sum, row) => sum + row.video_count,
    0,
  );

  const { data: todayByUser } = await supabase
    .from("youtube_import_log")
    .select("user_id, video_count")
    .gte("created_at", since);

  const usageByUser = new Map<string, number>();
  for (const row of todayByUser ?? []) {
    usageByUser.set(
      row.user_id,
      (usageByUser.get(row.user_id) ?? 0) + row.video_count,
    );
  }

  const topImportUsersToday = [...usageByUser.entries()]
    .map(([user_id, video_count]) => ({
      user_id,
      email: emailByUserId.get(user_id) ?? null,
      video_count,
    }))
    .sort((a, b) => b.video_count - a.video_count)
    .slice(0, 10);

  const recentImports = (recentImportsResult.data ?? []).map((row) => ({
    action: row.action,
    video_count: row.video_count,
    created_at: row.created_at,
    user_email: emailByUserId.get(row.user_id) ?? null,
  }));

  return {
    configured: true,
    users: usersResult.data.users?.length ?? 0,
    playlists: playlistsResult.count ?? 0,
    tracks: tracksResult.count ?? 0,
    interestSignups: interestCountResult.count ?? 0,
    importsToday: importsToday.length,
    importsTodayVideos,
    recentInterest: interestRecentResult.data ?? [],
    recentImports,
    topImportUsersToday,
  };
}

export function adminLimitsSummary(): {
  dailyCap: number;
  singleImportCap: number;
  adminEmails: string[];
} {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return {
    dailyCap: YOUTUBE_DAILY_VIDEO_CAP,
    singleImportCap: YOUTUBE_SINGLE_IMPORT_CAP,
    adminEmails: raw
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean),
  };
}

export { isAdminEmail };
