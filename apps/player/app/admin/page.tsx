import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin/auth";
import {
  adminLimitsSummary,
  fetchAdminStats,
} from "@/lib/admin/queries";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="cm-card p-5">
      <p className="text-sm text-cm-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-cm-text-muted">{hint}</p> : null}
    </div>
  );
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    redirect("/settings");
  }

  const stats = await fetchAdminStats();
  const limits = adminLimitsSummary();

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="mt-2 text-sm text-cm-text-muted">
              Signed in as {user.email}
            </p>
          </div>
          <Link href="/settings" className="text-sm text-cm-accent hover:underline">
            ← Settings
          </Link>
        </div>

        {!stats.configured ? (
          <div
            role="alert"
            className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
          >
            Add <code className="text-amber-50">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            to the player environment to load dashboard stats.
          </div>
        ) : null}

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Users" value={stats.users} />
            <StatCard label="Playlists" value={stats.playlists} />
            <StatCard label="Tracks" value={stats.tracks} />
            <StatCard
              label="Interest sign-ups"
              value={stats.interestSignups}
              hint="crapmedia.com"
            />
            <StatCard
              label="Imports today"
              value={stats.importsToday}
              hint={`${stats.importsTodayVideos} videos (API metadata)`}
            />
            <StatCard
              label="Daily import cap"
              value={limits.dailyCap}
              hint={`${limits.singleImportCap} max per playlist import`}
            />
          </div>
        </section>

        {stats.topImportUsersToday.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">
              Top importers today
            </h2>
            <div className="cm-card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-cm-border text-cm-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Videos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cm-border">
                  {stats.topImportUsersToday.map((row) => (
                    <tr key={row.user_id}>
                      <td className="px-4 py-3">
                        {row.email ?? row.user_id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {row.video_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Recent imports</h2>
            {stats.recentImports.length === 0 ? (
              <p className="text-sm text-cm-text-muted">No imports logged yet.</p>
            ) : (
              <ul className="cm-card divide-y divide-cm-border text-sm">
                {stats.recentImports.map((row, i) => (
                  <li key={`${row.created_at}-${i}`} className="px-4 py-3">
                    <p className="font-medium">
                      {row.user_email ?? "Unknown user"} · {row.action}
                    </p>
                    <p className="text-cm-text-muted">
                      {row.video_count} video{row.video_count === 1 ? "" : "s"}{" "}
                      · {formatWhen(row.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Recent interest emails</h2>
            {stats.recentInterest.length === 0 ? (
              <p className="text-sm text-cm-text-muted">No sign-ups yet.</p>
            ) : (
              <ul className="cm-card divide-y divide-cm-border text-sm">
                {stats.recentInterest.map((row) => (
                  <li key={row.email} className="px-4 py-3">
                    <p className="font-medium truncate">{row.email}</p>
                    <p className="text-cm-text-muted">
                      {formatWhen(row.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="mt-10 cm-card p-5 text-sm text-cm-text-muted">
          <p>
            <strong className="text-cm-text">Admin access:</strong>{" "}
            {limits.adminEmails.length > 0
              ? limits.adminEmails.join(", ")
              : "Set ADMIN_EMAILS on Vercel"}
          </p>
          <p className="mt-2">
            Playback does not count toward import limits — only YouTube metadata
            fetches (add track, playlist import, server embed sync).
          </p>
        </section>
      </main>
    </>
  );
}
